/**
 * Google Customer Reviews Component
 * Integrates Google Customer Reviews survey opt-in
 * This should be loaded on order confirmation/thank you pages
 */

interface GoogleCustomerReviewsProps {
  orderId?: string;
  email?: string;
  deliveryCountry?: string;
  estimatedDeliveryDate?: string;
  products?: Array<{ gtin: string }>;
}

export function GoogleCustomerReviews({
  orderId = 'ORDER_ID',
  email = 'CUSTOMER_EMAIL',
  deliveryCountry = 'SE',
  estimatedDeliveryDate = 'YYYY-MM-DD',
  products = [],
}: GoogleCustomerReviewsProps) {
  const MERCHANT_ID = 5594274980;

  return (
    <>
      {/* Google Customer Reviews API */}
      <script
        src="https://apis.google.com/js/platform.js?onload=renderOptIn"
        async
        defer
      />

      {/* Google Customer Reviews Configuration */}
      <script
        id="google-customer-reviews"
        dangerouslySetInnerHTML={{
          __html: `
window.renderOptIn = function() {
  window.gapi.load('surveyoptin', function() {
    window.gapi.surveyoptin.render(
      {
        // REQUIRED FIELDS
        "merchant_id": ${MERCHANT_ID},
        "order_id": "${orderId}",
        "email": "${email}",
        "delivery_country": "${deliveryCountry}",
        "estimated_delivery_date": "${estimatedDeliveryDate}",

        // OPTIONAL FIELDS
        ${products.length > 0 ? `"products": ${JSON.stringify(products)}` : ''}
      });
  });
}
          `,
        }}
      />
    </>
  );
}
