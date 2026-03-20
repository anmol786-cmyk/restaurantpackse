/**
 * GET /api/orders/[orderId]/invoice
 *
 * Generates and streams a professional invoice PDF for a WooCommerce order.
 * Requires an authenticated session (auth-storage cookie must be present).
 *
 * Response:
 *   Content-Type: application/pdf
 *   Content-Disposition: attachment; filename="Invoice-INV-YYYY-XXXXX.pdf"
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';
import {
  generateInvoicePDFBlob,
  buildInvoiceNumber,
  calculateDueDate,
  type InvoicePDFData,
} from '@/lib/pdf/invoice-pdf';

export const dynamic = 'force-dynamic';

// ─── Auth guard ───────────────────────────────────────────────────────────────

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authCookie  = cookieStore.get('auth-storage');

    if (!authCookie?.value) return false;

    const authData = JSON.parse(authCookie.value);
    const token    = authData?.state?.token;

    return typeof token === 'string' && token.length > 0;
  } catch {
    return false;
  }
}

// ─── WooCommerce order type (partial) ────────────────────────────────────────

interface WooLineItem {
  id:       number;
  name:     string;
  quantity: number;
  price:    string;   // WC returns price as string
  total:    string;   // Line total excl. tax, as string
  sku:      string;
}

interface WooOrder {
  id:           number;
  status:       string;
  date_created: string;
  currency:     string;
  total:        string;
  total_tax:    string;
  subtotal?:    string;
  billing: {
    first_name: string;
    last_name:  string;
    company:    string;
    email:      string;
    phone:      string;
    address_1:  string;
    address_2:  string;
    city:       string;
    state:      string;
    postcode:   string;
    country:    string;
  };
  shipping: {
    first_name: string;
    last_name:  string;
    address_1:  string;
    address_2:  string;
    city:       string;
    state:      string;
    postcode:   string;
    country:    string;
  };
  line_items:    WooLineItem[];
  // WC tax_lines gives us aggregated tax info
  tax_lines?:    Array<{ rate_percent: number; tax_total: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a WooCommerce address object into a single multi-line string. */
function formatAddress(addr: {
  address_1: string;
  address_2: string;
  city:      string;
  state:     string;
  postcode:  string;
  country:   string;
}): string {
  return [
    addr.address_1,
    addr.address_2,
    [addr.city, addr.state].filter(Boolean).join(', '),
    [addr.postcode, addr.country].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ');
}

/** Map WooCommerce order status to InvoicePDFData status. */
function mapStatus(wcStatus: string): InvoicePDFData['status'] {
  switch (wcStatus) {
    case 'completed':
    case 'processing':
      return 'paid';
    case 'failed':
    case 'cancelled':
      return 'overdue';
    default:
      return 'sent';
  }
}

/** Build InvoicePDFData from a raw WooCommerce order object. */
function buildInvoiceData(order: WooOrder): InvoicePDFData {
  const invoiceNumber = buildInvoiceNumber(order.id);
  const invoiceDate   = order.date_created;
  const dueDate       = calculateDueDate(invoiceDate, 28);

  // Customer
  const billing        = order.billing;
  const customerName   = `${billing.first_name} ${billing.last_name}`.trim();
  const billingAddress = formatAddress(billing);

  // Delivery address — only include if different from billing
  const shippingAddress = formatAddress(order.shipping);
  const deliveryAddress =
    shippingAddress && shippingAddress !== billingAddress ? shippingAddress : undefined;

  // Parse grand total & tax from WooCommerce (strings → numbers)
  const grandTotal = parseFloat(order.total)     || 0;
  const vatAmount  = parseFloat(order.total_tax) || 0;
  const subtotal   = grandTotal - vatAmount;

  // Line items
  const items: InvoicePDFData['items'] = order.line_items.map((item) => {
    const unitPrice = parseFloat(item.price) || 0;
    const lineTotal = parseFloat(item.total) || unitPrice * item.quantity;
    return {
      product_name: item.name,
      sku:          item.sku || undefined,
      quantity:     item.quantity,
      unitPrice,
      vatRate:      0.25,  // Swedish standard VAT rate
      total:        lineTotal,
    };
  });

  return {
    invoiceNumber,
    orderId:      String(order.id),
    invoiceDate,
    dueDate,
    paymentTerms: 'Net 28 Days',
    customer: {
      name:            customerName,
      email:           billing.email,
      phone:           billing.phone,
      company:         billing.company || undefined,
      billingAddress,
      deliveryAddress,
    },
    items,
    subtotal,
    vatAmount,
    grandTotal,
    currency:     order.currency || 'SEK',
    status:       mapStatus(order.status),
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  // 1. Auth check
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in to download invoices.' },
      { status: 401 }
    );
  }

  // 2. Resolve params
  const { orderId } = await params;

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    // 3. Fetch order from WooCommerce
    const response = await fetch(
      getWooCommerceUrl(`/orders/${orderId}`),
      {
        headers: {
          Authorization:  getWooCommerceAuthHeader(),
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      throw new Error(`WooCommerce API error: ${response.status}`);
    }

    const order: WooOrder = await response.json();

    // 4. Build invoice data
    const invoiceData = buildInvoiceData(order);

    // 5. Generate PDF blob
    const blob        = generateInvoicePDFBlob(invoiceData);
    const arrayBuffer = await blob.arrayBuffer();

    // 6. Return PDF response
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${invoiceData.invoiceNumber}.pdf"`,
        'Content-Length':      String(arrayBuffer.byteLength),
        'Cache-Control':       'no-store',
      },
    });
  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice. Please try again or contact support.' },
      { status: 500 }
    );
  }
}
