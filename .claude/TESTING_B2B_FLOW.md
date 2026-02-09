# B2B Features Testing Guide

This guide outlines the step-by-step process to verify the End-to-End Business 2 Business (B2B) workflow, including Registration, Credit Check, Ordering, Invoicing, and Data Export.

## Prerequisites

1.  **Admin Access**: You need access to the `/admin` dashboard (or knowledge of how to access it if auth is disabled).
2.  **Email Access**: Ability to check emails (Mailtrap is recommended for dev, or check your spam/inbox if using real SMTP).
3.  **Clean State**: Ideally, test with a brand new email address to avoid conflicts with existing users.

---

## Phase 1: Business Registration

**Goal**: Verify a user can sign up as a business and trigger the approval workflow.

1.  **Navigate to Registration**:
    *   Go to `/wholesale`.
    *   Click "Register as Business".
2.  **Fill Form**:
    *   Enter unique Email (e.g., `test-business-1@example.com`).
    *   Enter Company Name (e.g., `Test Bistro AB`).
    *   Enter VAT Number (e.g., `SE12345678901`).
    *   **CRITICAL**: Check "Apply for Credit Line" (to test credit visualization later).
    *   Submit the form.
3.  **Verify Success**:
    *   You should be redirected to `/my-account` or a success page.
    *   You should see a "Action Required" or "Pending" status badge on your dashboard if implemented, or at least be logged in.
4.  **Verify Admin Notification**:
    *   Check the admin email account (`INFO@restaurantpack.se` or `SMTP_USER`).
    *   Did you receive a "New Wholesale Registration" email?

---

## Phase 2: Admin Approval

**Goal**: Verify an admin can approve the business and enabling wholesale capabilities.

1.  **Access Admin Dashboard**:
    *   Go to `/admin/wholesale`.
    *   *(Note: Ensure your current user has admin permissions or basic auth protection is passed)*.
2.  **Find Request**:
    *   Locate `Test Bistro AB` in the pending requests table.
3.  **Approve**:
    *   Click the "Approve" (Green Check) button.
    *   Confirm the dialog.
    *   Verify the status changes to "Approved" in the table.
4.  **Verify User Notification**:
    *   Check the email for `test-business-1@example.com`.
    *   Did you receive a "Your Wholesale Account is Approved" email?

---

## Phase 3: Wholesale Dashboard & Credit Check

**Goal**: Verify the user now sees B2B specific features.

1.  **Login as User**:
    *   If not already logged in, login as `test-business-1@example.com`.
    *   Go to `/my-account`.
2.  **Check Credit Visualizer**:
    *   Look for the **"Business Credit Status"** card.
    *   **Status**: Should show "Application Pending" (Orange) or "Active Credit Line" (Green) depending on if you manually approved credit in backend (currently admin workflow only approves *wholesale status*, credit might need manual meta update or strictly follows wholesale approval depending on logic. *Check: Logic at `app/actions/admin.ts` approves wholesale but doesn't explicitly toggle `credit_application_status` to approved unless customized. It might still show "Pending" which is a valid test case.*).
    *   **Terms**: Verify "Payment terms: Net 28 days" (default) is visible.

---

## Phase 4: Placing a Wholesale Order

**Goal**: Submit an order and verify PDF generation.

1.  **Shop**:
    *   Go to `/shop`.
    *   Add products to cart.
2.  **Checkout**:
    *   Proceed to checkout.
    *   Fill in shipping details.
    *   Select "Invoice" or "Cash on Delivery" (whatever is available).
    *   Place Order.
3.  **Order Confirmation**:
    *   Verify you land on the "Order Received" page.
4.  **Verify Email & PDF**:
    *   Check email for `test-business-1@example.com`.
    *   **Attachment**: Is there a PDF file attached (e.g., `invoice-12345.pdf`)?
    *   Open the PDF. Does it look correct? (Company details, line items, totals).

---

## Phase 5: Post-Order Management & Exports

**Goal**: Verify the user can retrieve their data.

1.  **My Account -> Orders**:
    *   Go to `/my-account?tab=orders`.
    *   Find the order you just placed.
2.  **Test PDF Download**:
    *   Click the **"Invoice PDF"** button on the order card.
    *   Does it download the same PDF as the email?
3.  **Test Excel Export**:
    *   Click the **"Export Excel"** button at the top of the Orders list.
    *   Open the downloaded `.xlsx` file.
    *   Verify columns: Order Number, Date, Status, Total, etc.

---

## Phase 6: Product Catalogue

**Goal**: Verify the sales enablement tool.

1.  **My Account -> Downloads**:
    *   Go to `/my-account?tab=downloads`.
2.  **Download PPTX**:
    *   Click the **"Download Catalogue"** button.
    *   Wait for the "Generating slides..." toast.
    *   Open the downloaded `.pptx` file.
3.  **Verify Content**:
    *   Slide 1: Cover page with "Anmol Wholesale".
    *   Slide 2+: Grid of products with images and prices.

---

## Troubleshooting

*   **Email not executing?** Check console logs for `Nodemailer` errors.
*   **PDF empty?** Check `lib/invoice-generator.ts` logic.
*   **Credit Status missing?** Ensure `is_wholesale_customer` meta is 'yes' or 'approved'.
