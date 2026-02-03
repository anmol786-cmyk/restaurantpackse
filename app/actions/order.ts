'use server';

import { createOrder, type CreateOrderData } from '@/lib/woocommerce/orders';

export async function createOrderAction(orderData: CreateOrderData) {
    try {
        const order = await createOrder(orderData);

        // Order created successfully. Now try to send confirmation email with invoice.
        // We do this in a non-blocking way or catch errors so we don't fail the request if email fails.
        try {
            // value-imports only works if the module has no side effects or we are in an async scope
            const { generateInvoicePDF, getPaymentDueDate } = await import('@/lib/invoice-generator');
            const { sendEmail } = await import('@/lib/email/smtp');
            const { generateEmailTemplate, createInfoBox, createInfoRow } = await import('@/lib/email-template');

            // Determine payment terms from order meta or customer
            // Default to immediate/none if not found.
            // In a real app, this might come from customer meta, here we approximate.
            const paymentMethodTitle = orderData.payment_method_title || 'Credit Card';
            let paymentTerms: 'immediate' | 'net_28' | 'net_60' = 'immediate';

            // Heuristic for terms based on payment method title (simple check)
            if (paymentMethodTitle.toLowerCase().includes('invoice') || paymentMethodTitle.toLowerCase().includes('factura')) {
                // Check if user has specific terms (would need to fetch user, but let's assume immediate for now if not passed)
                // For B2B, this logic would be more complex.
                paymentTerms = 'immediate';
            }

            const invoiceDate = new Date();
            const dueDate = getPaymentDueDate(invoiceDate, paymentTerms);

            // Generate PDF
            const pdfBlob = await generateInvoicePDF({
                order,
                invoiceNumber: order.number || order.id.toString(),
                invoiceDate,
                dueDate,
                paymentTerms
            });

            const arrayBuffer = await pdfBlob.arrayBuffer();
            const pdfBuffer = Buffer.from(arrayBuffer);

            // Generate Email HTML
            const emailHtml = generateEmailTemplate({
                title: 'Order Confirmation',
                heading: `Thank you for your order!`,
                contentSections: [
                    {
                        title: `Order #${order.number || order.id}`,
                        content: `
                            <p style="margin: 0; color: #333; font-size: 14px;">
                                We have received your order and it is now being processed.
                                Please find your invoice attached to this email.
                            </p>
                            <div style="margin-top: 20px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    ${createInfoRow('Order Date', invoiceDate.toLocaleDateString())}
                                    ${createInfoRow('Payment Method', paymentMethodTitle)}
                                    ${createInfoRow('Total Amount', `${order.total} ${order.currency}`)}
                                </table>
                            </div>
                        `
                    },
                    {
                        title: 'What Happens Next?',
                        content: `
                            <p style="margin: 0; color: #333; font-size: 14px;">
                                You will receive another email when your order has been shipped.
                            </p>
                            ${createInfoBox('If you have questions about your order, please reply to this email.')}
                        `
                    }
                ]
            });

            // Send Email
            await sendEmail({
                to: order.billing?.email || 'customer@example.com',
                subject: `Order Confirmation #${order.number || order.id} - Anmol Wholesale`,
                html: emailHtml,
                attachments: [
                    {
                        filename: `Invoice-${order.number || order.id}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            });

            console.log(`Order confirmation email sent to ${order.billing?.email}`);

        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
            // Don't fail the action, just log the error
        }

        return { success: true, data: order };
    } catch (error: any) {
        console.error('Order creation error:', error);
        return { success: false, error: error.message || 'Failed to create order' };
    }
}
