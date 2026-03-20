import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';
import type { OrderTemplate } from '@/lib/storage/order-templates';

export const dynamic = 'force-dynamic';

const META_KEY = '_order_templates';

/**
 * Decode the auth-storage cookie and look up the WooCommerce customer record.
 * Returns the full customer object or null if not authenticated / not found.
 */
async function getCustomerFromAuth() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth-storage');

    if (!authCookie?.value) return null;

    const authData = JSON.parse(authCookie.value);
    const token = authData?.state?.token;
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const email = payload.data?.user?.user_email || payload.email;
    if (!email) return null;

    const response = await fetch(
      getWooCommerceUrl(`/customers?email=${encodeURIComponent(email)}`),
      { headers: { Authorization: getWooCommerceAuthHeader() } }
    );

    if (!response.ok) return null;

    const customers = await response.json();
    return customers[0] || null;
  } catch (error) {
    console.error('[templates] Error resolving customer from auth:', error);
    return null;
  }
}

/**
 * Extract the templates array from a customer's meta_data array.
 */
function extractTemplates(customer: { meta_data?: Array<{ key: string; value: unknown }> }): OrderTemplate[] {
  const meta = customer.meta_data ?? [];
  const entry = meta.find((m) => m.key === META_KEY);
  if (!entry) return [];

  try {
    const raw = typeof entry.value === 'string' ? JSON.parse(entry.value) : entry.value;
    return Array.isArray(raw) ? (raw as OrderTemplate[]) : [];
  } catch {
    return [];
  }
}

/**
 * GET /api/templates
 * Returns the customer's saved order templates.
 */
export async function GET() {
  const customer = await getCustomerFromAuth();

  if (!customer) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const templates = extractTemplates(customer);
  return NextResponse.json({ templates });
}

/**
 * POST /api/templates
 * Body: { template: OrderTemplate }
 * Adds or updates a template in the customer's meta_data.
 */
export async function POST(request: NextRequest) {
  const customer = await getCustomerFromAuth();

  if (!customer) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let body: { template: OrderTemplate };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { template } = body;
  if (!template?.id || !template?.name) {
    return NextResponse.json(
      { success: false, error: 'Invalid template payload' },
      { status: 400 }
    );
  }

  const templates = extractTemplates(customer);

  // Replace existing template with the same id, or append
  const existingIndex = templates.findIndex((t) => t.id === template.id);
  if (existingIndex !== -1) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }

  // Build the updated meta_data array — preserve other keys, upsert ours
  const otherMeta = (customer.meta_data ?? []).filter(
    (m: { key: string }) => m.key !== META_KEY
  );
  const updatedMeta = [
    ...otherMeta,
    { key: META_KEY, value: JSON.stringify(templates) },
  ];

  const updateResponse = await fetch(
    getWooCommerceUrl(`/customers/${customer.id}`),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getWooCommerceAuthHeader(),
      },
      body: JSON.stringify({ meta_data: updatedMeta }),
    }
  );

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    console.error('[templates] WooCommerce PUT failed:', errorText);
    return NextResponse.json(
      { success: false, error: 'Failed to persist template' },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, template });
}

/**
 * DELETE /api/templates?id={templateId}
 * Removes the specified template from the customer's meta_data.
 */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get('id');

  if (!templateId) {
    return NextResponse.json(
      { success: false, error: 'Missing template id' },
      { status: 400 }
    );
  }

  const customer = await getCustomerFromAuth();

  if (!customer) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const templates = extractTemplates(customer);
  const filtered = templates.filter((t) => t.id !== templateId);

  if (filtered.length === templates.length) {
    // Template not found on server — still return success so client stays in sync
    return NextResponse.json({ success: true });
  }

  const otherMeta = (customer.meta_data ?? []).filter(
    (m: { key: string }) => m.key !== META_KEY
  );
  const updatedMeta = [
    ...otherMeta,
    { key: META_KEY, value: JSON.stringify(filtered) },
  ];

  const updateResponse = await fetch(
    getWooCommerceUrl(`/customers/${customer.id}`),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getWooCommerceAuthHeader(),
      },
      body: JSON.stringify({ meta_data: updatedMeta }),
    }
  );

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    console.error('[templates] WooCommerce DELETE (PUT) failed:', errorText);
    return NextResponse.json(
      { success: false, error: 'Failed to remove template' },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
