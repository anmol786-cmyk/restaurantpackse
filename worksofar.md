Summary: Design System Implementation Complete
                                                                                                                          What Changed

  1. Color System - Royal Heritage Theme
  ┌───────────────────────────┬───────────────────────────────┐
  │          Before           │             After             │
  ├───────────────────────────┼───────────────────────────────┤
  │ Primary: Deep Red #A80E13 │ Primary: Burgundy #9f1239     │
  ├───────────────────────────┼───────────────────────────────┤
  │ Secondary: Teal #00584F   │ Secondary: Warm Stone #57534e │
  ├───────────────────────────┼───────────────────────────────┤
  │ No accent color           │ Accent: Gold #eab308          │
  └───────────────────────────┴───────────────────────────────┘
  2. Typography
  ┌────────────────┬─────────────────────────────────────────────┐
  │     Before     │                    After                    │
  ├────────────────┼─────────────────────────────────────────────┤
  │ Inter for both │ Inter (body) + Plus Jakarta Sans (headings) │
  └────────────────┴─────────────────────────────────────────────┘
  3. New Utility Classes Added
  - Buttons: .btn-primary, .btn-gold, .btn-secondary, .btn-ghost
  - Badges: .badge-gold, .badge-success, .badge-warning, .badge-info
  - B2B Specific: .wholesale-price, .tier-price-row, .credit-status-*, .order-status-*
  - Forms: .form-label, .form-input, .form-error
  - Stats: .stat-card, .stat-value, .stat-label

  4. Extended Color Palette
  - Full 11-shade primary scale (primary-50 to primary-950)
  - Full 11-shade gold scale (gold-50 to gold-950)
  - Status colors: success, warning, info, destructive


  Files Modified

  app/globals.css          - CSS variables & utility classes
  app/layout.tsx           - Plus Jakarta Sans font
  tailwind.config.ts       - Extended color palette
  app/actions/auth.ts      - Admin notifications for registration
  app/actions/admin.ts     - Admin actions (Approve/Reject) + User notifications
  app/actions/order.ts     - Order confirmation email with PDF Invoice

  Files Created

  .claude/DESIGN_SYSTEM.md - Complete design documentation
  app/admin/wholesale/page.tsx - Admin Dashboard
  app/admin/layout.tsx     - Admin Layout
  components/admin/wholesale-requests-table.tsx - Admin Table
  
  Completed Phases:
  1. Business Registration Backend Integration (Admin Dashboard, Notifications)
  2. Order Confirmation with PDF Invoices
  3. Customer Self-Service Exports (XLSX) for Orders, Invoices, Quotes, and Reorder Lists

  Completed Phases:
  1. Business Registration Backend Integration (Admin Dashboard, Notifications)
  2. Order Confirmation with PDF Invoices
## Current Status
- **Phase 3.1 (B2B Features)**: 🟡 In Progress / Debugging
    - **Business Registration**: VAT optionality implemented.
    - **Catalogue PDF Redesign**: ✅ Completed. Switched to strict Red (#A80E13) & White theme. Fixed build errors.
    - **Checkout Page**: ✅ Fixed ESLint warning for useEffect dependencies.
    - **Credit System**: Credit limit visualization added to dashboard.
    - **Exports**: Order history, Invoice list, and Reorder lists exportable to Excel.

## Next Steps
- **Phase 3.2**: Sales Dashboard & Analytics
- **Phase 3.3**: Advanced Order Management (Split shipments, Backorders)

Let me identify and update the key components to use the new design system. I'll start by exploring the main
  components that need styling updates.
                                                                                                                        ● Read 1 file (ctrl+o to expand)

● Update(components\ui\button.tsx)
  ⎿  Added 28 lines, removed 13 lines
       5  import { cn } from "@/lib/utils"
       6
       7  const buttonVariants = cva(
       8 -  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
         - ring-offset-background transition-all
         -focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
         -disabled:pointer-events-none disabled:opacity-50 active:scale-95",
       8 +  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold                          + ring-offset-background transition-all duration-200
         +focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2                    +disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
       9    {
      10      variants: {
      11        variant: {
      12 -        default: "bg-primary text-primary-foreground hover:bg-primary/90",
      13 -        destructive:
      14 -          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      15 -        outline:
      16 -          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      17 -        secondary:
      18 -          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      19 -        ghost: "hover:bg-accent hover:text-accent-foreground",
      12 +        // Primary: Burgundy - Main CTAs
      13 +        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-600 hover:shadow-md",
      14 +        // Gold: Premium B2B actions - Quotes, Credit, Wholesale
      15 +        gold: "bg-accent text-accent-foreground shadow-sm hover:bg-gold-600 hover:shadow-md",
      16 +        // Destructive: Cancel, Delete actions
      17 +        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      18 +        // Outline: Secondary actions with border
      19 +        outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary
         +hover:text-primary-foreground",
      20 +        // Outline Gold: Secondary gold actions
      21 +        "outline-gold": "border-2 border-accent text-accent bg-transparent hover:bg-accent
         +hover:text-accent-foreground",
      22 +        // Secondary: Muted background actions
      23 +        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      24 +        // Ghost: Minimal style, no background
      25 +        ghost: "hover:bg-muted hover:text-foreground",
      26 +        // Link: Text only with underline
      27          link: "text-primary underline-offset-4 hover:underline",
      28 -        premium: "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl
         -hover:-translate-y-0.5 transition-all duration-300",
      28 +        // Premium: Elevated with shadow and lift
      29 +        premium: "bg-primary text-primary-foreground shadow-lg hover:bg-primary-600 hover:shadow-xl
         +hover:-translate-y-0.5",
      30 +        // Premium Gold: Elevated gold button
      31 +        "premium-gold": "bg-accent text-accent-foreground shadow-lg hover:bg-gold-600 hover:shadow-xl
         +hover:-translate-y-0.5",
      32 +        // Success: Positive actions
      33 +        success: "bg-success text-success-foreground shadow-sm hover:bg-success/90",
      34        },
      35        size: {
      36 -        default: "h-10 px-4 py-2",
      37 -        sm: "h-9 rounded-md px-3",
      38 -        lg: "h-11 rounded-md px-8",
      36 +        default: "h-10 px-5 py-2",
      37 +        sm: "h-9 px-4 text-xs",
      38 +        lg: "h-12 px-8 text-base",
      39 +        xl: "h-14 px-10 text-lg",
      40          icon: "h-10 w-10",
      41 +        "icon-sm": "h-8 w-8",
      42 +        "icon-lg": "h-12 w-12",
      43        },
      44      },
      45      defaultVariants: {

● Read 1 file (ctrl+o to expand)

● Update(components\ui\badge.tsx)
  ⎿  Added 22 lines, removed 1 line
       8    {
       9      variants: {
      10        variant: {
      11 +        // Primary: Burgundy solid
      12          default:
      13            "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      14 +        // Gold: Premium/Wholesale highlights
      15 +        gold:                                                                                                       16 +          "border-transparent bg-accent text-accent-foreground hover:bg-gold-600",
      17 +        // Secondary: Muted style                                                                                   18          secondary:
      19            "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      20 +        // Destructive: Errors, cancellations
      21          destructive:
      22            "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      23 -        outline: "text-foreground",
      23 +        // Success: Completed, in stock
      24 +        success:
      25 +          "border-transparent bg-success text-success-foreground hover:bg-success/90",
      26 +        // Warning: Pending, low stock
      27 +        warning:
      28 +          "border-transparent bg-warning text-warning-foreground hover:bg-warning/90",
      29 +        // Info: Processing, informational
      30 +        info:
      31 +          "border-transparent bg-info text-info-foreground hover:bg-info/90",
      32 +        // Outline variants
      33 +        outline: "text-foreground border-border",
      34 +        "outline-primary": "text-primary border-primary bg-primary/5",
      35 +        "outline-gold": "text-accent border-accent bg-accent/5",
      36 +        "outline-success": "text-success border-success bg-success/5",
      37 +        "outline-warning": "text-warning border-warning bg-warning/5",
      38 +        "outline-destructive": "text-destructive border-destructive bg-destructive/5",
      39        },
      40      },
      41      defaultVariants: {

● Now let me work on the checkout page.

● Read 1 file (ctrl+o to expand)

● Let me update the checkout page with consistent design system styling.

● Update(app\(shop)\checkout\page.tsx)
  ⎿  Added 4 lines, removed 4 lines
      482        <Section>
      483          <Container>
      484            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      485 -            <ShoppingBag className="mb-4 h-16 w-16 text-neutral-400" />
      486 -            <h1 className="mb-2 font-heading text-3xl font-bold">Your cart is empty</h1>
      487 -            <p className="mb-6 text-neutral-600">Add items to your cart before checkout</p>
      488 -            <Button asChild size="lg" className="rounded-full">
      485 +            <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/50" />                                    486 +            <h1 className="mb-2 font-heading text-3xl font-bold text-foreground
          +">Your cart is empty</h1>                                                                                          487 +            <p className="mb-6 text-muted-foreground">Add items to your cart before checkout</p>
      488 +            <Button asChild size="lg" variant="gold">
      489                <Link href="/shop">Shop Now</Link>
      490              </Button>
      491            </div>

● Update(app\(shop)\checkout\page.tsx)
  ⎿  Added 6 lines, removed 6 lines
      503      <Section>
      504        <Container>
      505          <div className="mb-8">
      506 -          <h1 className="mb-4 font-heading text-4xl font-bold">Checkout</h1>
      506 +          <h1 className="mb-4 font-heading text-4xl font-bold text-foreground">Checkout</h1>
      507
      508            {/* 2-Step Progress */}
      509            <div className="flex items-center justify-center max-w-md mx-auto">                                     ...
      514                      className={cn(                                                                                 515                        'flex h-10 w-10 items-center justify-center rounded-full transition-all',
      516                        currentStep === step.id
      517 -                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
      517 +                        ? 'bg-primary text-primary-foreground ring-4 ring-primary-100'
      518                          : index === 0 && currentStep === 'payment'
      519 -                          ? 'bg-green-600 text-white'
      520 -                          : 'bg-neutral-200 text-neutral-500'
      519 +                          ? 'bg-success text-success-foreground'
      520 +                          : 'bg-muted text-muted-foreground'
      521                      )}
      522                    >
      523                      {index === 0 && currentStep === 'payment' ? (
     ...
      529                    <span
      530                      className={cn(
      531                        'font-medium',
      532 -                      currentStep === step.id ? 'text-primary-700' : 'text-neutral-500'
      532 +                      currentStep === step.id ? 'text-primary' : 'text-muted-foreground'
      533                      )}
      534                    >
      535                      {step.label}
     ...
      539                    <div
      540                      className={cn(
      541                        'mx-4 h-1 flex-1 rounded',
      542 -                      currentStep === 'payment' ? 'bg-green-600' : 'bg-neutral-200'
      542 +                      currentStep === 'payment' ? 'bg-success' : 'bg-muted'
      543                      )}
      544                    />
      545                  )}

● Update(app\(shop)\checkout\page.tsx)
  ⎿  Added 9 lines, removed 9 lines
      753
      754                      {isCalculatingShipping ? (
      755                        <div className="flex items-center justify-center py-8">
      756 -                        <Loader2 className="h-6 w-6 animate-spin text-primary-600 mr-2" />
      757 -                        <span>Calculating shipping rates...</span>
      756 +                        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
      757 +                        <span className="text-muted-foreground">Calculating shipping rates...</span>
      758                        </div>                                                                                       759                      ) : shippingMethods.length === 0 ? (
      760 -                      <div className="text-center py-8 text-neutral-500">                                          760 +                      <div className="text-center py-8 text-muted-foreground">
      761                          <Truck className="h-10 w-10 mx-auto mb-2 opacity-50" />
      762                          <p>Enter your postcode to see shipping options</p>
      763                        </div>
     ...
      776                                className={cn(
      777                                  'flex items-center justify-between p-4 border rounded-lg
           cursor-pointer transition-all',
      778                                  selectedShippingMethod?.id === method.id
      779 -                                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
      780 -                                  : 'border-neutral-200 hover:border-neutral-300'
      779 +                                  ? 'border-primary bg-primary-50 ring-2 ring-primary'
      780 +                                  : 'border-border hover:border-primary/30'
      781                                )}
      782                                onClick={() => setSelectedShippingMethod(method)}
      783                              >
      784                                <div className="flex items-center gap-3">
      785                                  <RadioGroupItem value={method.id} id={method.id} />
      786 -                                <div className="text-primary-600">
      786 +                                <div className="text-primary">
      787                                    {getShippingIcon(method.method_id)}
      788                                  </div>
      789 -                                <Label htmlFor={method.id} className="cursor-pointer font-medium">
      789 +                                <Label htmlFor={method.id} className="cursor-pointer font-medium
          + text-foreground">
      790                                    {method.label}
      791                                  </Label>
      792                                </div>
      793 -                              <span className="font-bold">
      793 +                              <span className="font-bold text-foreground">
      794                                  {method.cost === 0 ? (
      795 -                                  <span className="text-green-600">Free</span>
      795 +                                  <span className="text-success">Free</span>
      796                                  ) : (
      797                                    formatPrice(method.total_cost || method.cost, 'SEK')
      798                                  )}

● Update(app\(shop)\checkout\page.tsx)
  ⎿  Added 2 lines, removed 1 line
      824
      825                    <Button
      826                      size="lg"
      827 -                    className="w-full rounded-full"
      827 +                    variant="gold"
      828 +                    className="w-full"
      829                      onClick={handleContinueToPayment}
      830                      disabled={!selectedShippingMethod}                                                             831                    >
                                                                                                                        ● Update(app\(shop)\checkout\page.tsx)
  ⎿  Added 5 lines, removed 5 lines
      846                    {/* Order Summary Card */}
      847                    <Card className="p-6">
      848                      <div className="flex items-center justify-between mb-4">
      849 -                      <h3 className="font-semibold">Shipping to</h3>
      849 +                      <h3 className="font-semibold text-foreground">Shipping to</h3>
      850                        <Button
      851                          variant="link"
      852                          size="sm"                                                                                 ...
      855                          Edit                                                                                       856                        </Button>
      857                      </div>
      858 -                    <p className="text-sm text-neutral-600">
      858 +                    <p className="text-sm text-muted-foreground">
      859                        {addressData.first_name} {addressData.last_name}
      860                        <br />
      861                        {addressData.address_1}
     ...
      865                      </p>
      866                      {selectedShippingMethod && (
      867                        <p className="mt-2 text-sm">
      868 -                        <span className="text-neutral-500">Shipping:</span>{' '}
      869 -                        <span className="font-medium">{selectedShippingMethod.label}</span>
      868 +                        <span className="text-muted-foreground">Shipping:</span>{' '}
      869 +                        <span className="font-medium text-foreground
          +">{selectedShippingMethod.label}</span>
      870                          {' - '}
      871                          {shippingCost === 0 ? (
      872 -                          <span className="text-green-600 font-semibold">Free</span>
      872 +                          <span className="text-success font-semibold">Free</span>
      873                          ) : (
      874                            formatPrice(shippingCost, 'SEK')
      875                          )}

● Update(app\(shop)\checkout\page.tsx)
  ⎿  Added 2 lines, removed 1 line
      938                      </Button>
      939                      <Button
      940                        size="lg"
      941 -                      className="flex-1 rounded-full"
      941 +                      variant="gold"
      942 +                      className="flex-1"
      943                        onClick={handlePlaceOrder}
      944                        disabled={isProcessing || (isStripePayment && !!stripeClientSecret)}                         945                      >
                                                                                                                        ● Update(app\(shop)\checkout\page.tsx)
  ⎿  Added 4 lines, removed 4 lines
      733                      <h2 className="font-heading text-xl font-bold mb-4">Shipping Method</h2>
      734
      735                      {/* Free Shipping Banner */}
      736 -                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
      737 -                      <p className="flex items-center gap-2 text-sm font-medium text-green-700">
      738 -                        <span>🚚</span>
      736 +                    <div className="mb-4 rounded-lg border border-success/30 bg-success/10 p-3">
      737 +                      <p className="flex items-center gap-2 text-sm font-medium text-success">                     738 +                        <Truck className="h-4 w-4" />
      739                          {cartTotal >= 5000 ? (                                                                     740                            <span>You qualify for free shipping within Stockholm!</span>
      741                          ) : (
     ...
      743                          )}
      744                        </p>
      745                        {cartTotal < 5000 && (
      746 -                        <p className="mt-1 text-xs text-green-600">
      746 +                        <p className="mt-1 text-xs text-success/80">
      747                            Add {formatPrice(5000 - cartTotal, 'SEK')} more to qualify
      748                          </p>
      749                        )}

● Read 1 file (ctrl+o to expand)

● Let me update the order status badge function to use the new design system variants.

● Update(app\(shop)\my-account\page.tsx)
  ⎿  Added 6 lines, removed 6 lines
      367    const getOrderStatusBadge = (status: string) => {
      368      switch (status) {
      369        case 'completed':
      370 -        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      370 +        return <Badge variant="success">Completed</Badge>;
      371        case 'processing':
      372 -        return <Badge className="bg-blue-500 hover:bg-blue-600">Processing</Badge>;
      372 +        return <Badge variant="info">Processing</Badge>;                                                           373        case 'on-hold':
      374 -        return <Badge className="bg-yellow-500 hover:bg-yellow-600">On Hold</Badge>;                               374 +        return <Badge variant="warning">On Hold</Badge>;
      375        case 'pending':
      376 -        return <Badge className="bg-orange-500 hover:bg-orange-600">Pending Payment</Badge>;
      376 +        return <Badge variant="outline-warning">Pending Payment</Badge>;
      377        case 'cancelled':
      378          return <Badge variant="destructive">Cancelled</Badge>;
      379        case 'refunded':
     ...
      389    const getWholesaleStatusBadge = (status: WholesaleStatus) => {
      390      switch (status) {
      391        case 'approved':
      392 -        return <Badge className="bg-green-500 hover:bg-green-600
          -"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>;
      392 +        return <Badge variant="success"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>;
      393        case 'pending':
      394 -        return <Badge className="bg-yellow-500 hover:bg-yellow-600
          -"><Clock className="w-3 h-3 mr-1" /> Pending Verification</Badge>;
      394 +        return <Badge variant="warning
          +"><Clock className="w-3 h-3 mr-1" /> Pending Verification</Badge>;
      395        case 'rejected':
      396          return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Not
           Approved</Badge>;
      397        default:

● Read 1 file (ctrl+o to expand)

● Let me update the key styling elements in the my-account page.

● Update(app\(shop)\my-account\page.tsx)
  ⎿  Added 9 lines, removed 9 lines
      400    };
      401
      402    return (
      403 -    <Section className="bg-neutral-50 dark:bg-neutral-900/50">
      403 +    <Section className="bg-muted/30 dark:bg-muted/10">
      404        <Container>
      405          {/* Verification Status Banner */}
      406          {businessInfo.isBusinessCustomer && businessInfo.wholesaleStatus === 'pending' && (                        407 -          <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
      408 -            <Clock className="h-4 w-4 text-yellow-600" />                                                          409 -            <AlertTitle className="text-yellow-800 dark:text-yellow-200
          -">Account Verification Pending</AlertTitle>
      410 -            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
      407 +          <Alert className="mb-6 border-warning/30 bg-warning/10">
      408 +            <Clock className="h-4 w-4 text-warning" />
      409 +            <AlertTitle className="text-warning">Account Verification Pending</AlertTitle>
      410 +            <AlertDescription className="text-warning/80">
      411                Your business account is under review. Our team will verify your details within 24-48
           hours.
      412                Once approved, you&apos;ll get access to wholesale pricing and payment terms.
      413              </AlertDescription>
     ...
      415          )}
      416
      417          {businessInfo.isBusinessCustomer && businessInfo.wholesaleStatus === 'approved' && (
      418 -          <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
      419 -            <CheckCircle2 className="h-4 w-4 text-green-600" />
      420 -            <AlertTitle className="text-green-800 dark:text-green-200
          -">Wholesale Account Active</AlertTitle>
      421 -            <AlertDescription className="text-green-700 dark:text-green-300">
      418 +          <Alert className="mb-6 border-success/30 bg-success/10">
      419 +            <CheckCircle2 className="h-4 w-4 text-success" />
      420 +            <AlertTitle className="text-success">Wholesale Account Active</AlertTitle>
      421 +            <AlertDescription className="text-success/80">
      422                You have access to wholesale pricing, volume discounts, and business payment terms.
      423              </AlertDescription>
      424            </Alert>

● Update(app\(shop)\my-account\page.tsx)
  ⎿  Added 3 lines, removed 3 lines
      427          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      428            <div>
      429              <div className="flex items-center gap-3 mb-1">
      430 -              <h1 className="font-heading text-3xl font-bold text-primary-950 dark:text-primary-50">
      430 +              <h1 className="font-heading text-3xl font-bold text-foreground">
      431                  My Account
      432                </h1>
      433                {businessInfo.isBusinessCustomer && (                                                                434 -                <Badge variant="outline" className="border-primary text-primary">
      434 +                <Badge variant="gold">                                                                             435                    <Building2 className="w-3 h-3 mr-1" />
      436                    Business
      437                  </Badge>
      438                )}
      439              </div>
      440 -            <p className="text-neutral-600 dark:text-neutral-400">
      440 +            <p className="text-muted-foreground">
      441                Welcome back, {user.first_name}!
      442                {businessInfo.companyName && (
      443                  <span className="ml-2 text-primary font-medium">({businessInfo.companyName})</span>

● Update(app\(shop)\my-account\page.tsx)
  ⎿  Added 2 lines, removed 2 lines
      638
      639                      {/* Quick Actions */}
      640                      <div className="pt-4 border-t">
      641 -                      <h4 className="font-semibold mb-3">Quick Actions</h4>
      641 +                      <h4 className="font-semibold mb-3 text-foreground">Quick Actions</h4>
      642                        <div className="flex flex-wrap gap-3">
      643 -                        <Button asChild variant="outline">
      643 +                        <Button asChild variant="gold">                                                            644                            <Link href="/wholesale/quote">
      645                              <FileText className="h-4 w-4 mr-2" />                                                  646                              Request Quote

● Read 1 file (ctrl+o to expand)

● Let me update key elements in the product template to use the new design system.

● Update(components\templates\product-template.tsx)
  ⎿  Added 3 lines, removed 3 lines
      245                    </>
      246                  )}
      247                  {product.featured && (
      248 -                  <Badge className="bg-secondary text-primary">
      249 -                    ⭐ Featured
      248 +                  <Badge variant="gold">
      249 +                    Featured
      250                    </Badge>                                                                                         251                  )}
      252                  {product.on_sale && discount > 0 && (                                                              253 -                  <Badge variant="destructive">
      253 +                  <Badge variant="gold">
      254                      -{discount}% OFF
      255                    </Badge>
      256                  )}

● Update(components\templates\product-template.tsx)
  ⎿  Added 1 line, removed 1 line
      411                    const quantityLimit = CommerceRules.getQuantityLimit(product.id);
      412                    if (quantityLimit !== null) {
      413                      return (
      414 -                      <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500 bg-
          -yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
      414 +                      <div className="flex items-center gap-2 text-warning bg-warning/10
          + px-3 py-2 rounded-lg">
      415                          <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor"                        viewBox="0 0 24 24">
      416                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13                     16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      417                          </svg>

● Update(components\templates\product-template.tsx)
  ⎿  Added 2 lines, removed 2 lines
      431                      variation={selectedVariation}
      432                      quantity={quantity}
      433                      size="lg"
      434 -                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-
          -full py-5"
      435 -                    style={{ fontSize: '17.89px', fontWeight: 500
          -, lineHeight: 1.52, letterSpacing: '0.03em' }}
      434 +                    className="flex-1 bg-accent hover:bg-gold-600 text-accent-foreground rounded-lg                    + py-5 shadow-md hover:shadow-lg transition-all"
      435 +                    style={{ fontSize: '17.89px', fontWeight: 600                                                      +, lineHeight: 1.52, letterSpacing: '0.03em' }}
      436                    />
      437                    <WishlistButton
      438                      product={product}

● Update(components\templates\product-template.tsx)
  ⎿  Added 1 line, removed 1 line
      385                )}
      386
      387                {/* Add to Cart Section */}
      388 -              <div className="space-y-3 bg-primary/5 rounded-2xl p-5">
      388 +              <div className="space-y-3 bg-muted/50 border border-border rounded-xl p-5">
      389                  {/* Quantity Selector */}
      390                  <div className="flex items-center gap-4">
      391                    <span style={{ fontSize: '15.13px', fontWeight: 500, lineHeight: 1.57,                                letterSpacing: '0.03em' }} className="text-foreground">Quantity:</span>
                                                                                                                        ● Update(components\templates\product-template.tsx)
  ⎿  Added 1 line, removed 1 line
      439                      variation={selectedVariation || undefined}
      440                      size="lg"
      441                      variant="outline"
      442 -                    className="rounded-full py-5 px-6 border-2 hover:bg-red-50 dark:hover:bg-red-950/
          -20"
      442 +                    className="rounded-lg py-5 px-6 border-2 border-primary hover:bg-primary/5"
      443                    />
      444                  </div>                                                                                             445
                                                                                                                        ● Read 1 file (ctrl+o to expand)

● Let me update the wholesale price display to use the design system colors.

● Update(components\wholesale\wholesale-price-display.tsx)
  ⎿  Added 8 lines, removed 8 lines
      27          return (
      28              <Link
      29                  href="/wholesale/register"
      30 -                className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/10
         - flex items-center justify-between group cursor-pointer hover:bg-primary/10 hover:border-primary/30
         - transition-all duration-200"
      30 +                className="mt-2 p-3 bg-accent/10 rounded-lg border border-accent/30
         + flex items-center justify-between group cursor-pointer hover:bg-accent/15 hover:border-accent/50                      + transition-all duration-200"
      31              >                                                                                                       32                  <div className="flex items-center gap-2">
      33 -                    <Building2 className="w-5 h-5 text-primary" />
      33 +                    <Building2 className="w-5 h-5 text-accent" />
      34                      <div className="flex flex-col">
      35 -                        <span className="text-xs font-bold text-primary
         - uppercase tracking-wider">Business Pricing Available</span>
      35 +                        <span className="text-xs font-bold text-accent
         + uppercase tracking-wider">Business Pricing Available</span>
      36                          <span className="text-[11px] text-muted-foreground">Register for wholesale
          rates & credit terms</span>
      37                      </div>
      38                  </div>
      39 -                <ChevronRight className="w-4 h-4 text-primary
         - group-hover:translate-x-1 transition-transform" />
      39 +                <ChevronRight className="w-4 h-4 text-accent
         + group-hover:translate-x-1 transition-transform" />
      40              </Link>
      41          );
      42      }
     ...
      46          return (
      47              <Link
      48                  href="/wholesale/register"
      49 -                className="mt-2 p-3 bg-gradient-to-r from-primary/5 to-primary/10
         - rounded-lg border border-primary/20 flex items-center justify-between group cursor-pointer hover:from-
         -primary/10 hover:to-primary/15 transition-all duration-200"
      49 +                className="mt-2 p-3 bg-gradient-to-r from-accent/5 to-accent/15
         + rounded-lg border border-accent/30 flex items-center justify-between group cursor-pointer hover:from-
         +accent/10 hover:to-accent/20 transition-all duration-200"
      50              >
      51                  <div className="flex items-center gap-2">
      52 -                    <Building2 className="w-5 h-5 text-primary" />
      52 +                    <Building2 className="w-5 h-5 text-accent" />
      53                      <div className="flex flex-col">
      54 -                        <span className="text-xs font-bold text-primary
         - uppercase tracking-wider">Upgrade to Business Account</span>
      54 +                        <span className="text-xs font-bold text-accent
         + uppercase tracking-wider">Upgrade to Business Account</span>
      55                          <span className="text-[11px] text-muted-foreground">Get up to 20% off with
          volume pricing</span>
      56                      </div>
      57                  </div>
      58 -                <ChevronRight className="w-4 h-4 text-primary
         - group-hover:translate-x-1 transition-transform" />
      58 +                <ChevronRight className="w-4 h-4 text-accent
         + group-hover:translate-x-1 transition-transform" />
      59              </Link>
      60          );
      61      }

● Update(components\wholesale\wholesale-price-display.tsx)
  ⎿  Added 9 lines, removed 9 lines
      63      // Pending wholesale approval
      64      if (isPendingWholesale) {
      65          return (
      66 -            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-
         -yellow-200 dark:border-yellow-800">
      66 +            <div className="mt-2 p-3 bg-warning/10 rounded-lg border border-warning/30">
      67                  <div className="flex items-center gap-2">
      68 -                    <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />                              68 +                    <Clock className="w-4 h-4 text-warning" />
      69                      <div className="flex flex-col">                                                                 70 -                        <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400
         -uppercase tracking-wider">Verification Pending</span>
      71 -                        <span className="text-[11px] text-yellow-600 dark:text-yellow-500
         -">Your business account is being verified. Wholesale pricing will be enabled shortly.</span>
      70 +                        <span className="text-xs font-bold text-warning
         +uppercase tracking-wider">Verification Pending</span>
      71 +                        <span className="text-[11px] text-warning/80
         +">Your business account is being verified. Wholesale pricing will be enabled shortly.</span>
      72                      </div>
      73                  </div>
      74                  {/* Show preview of pricing tiers */}
      75 -                <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-800">
      76 -                    <span className="text-[10px] text-yellow-600 dark:text-yellow-500
         -uppercase font-medium">Preview: Pricing after approval</span>
      75 +                <div className="mt-3 pt-3 border-t border-warning/30">
      76 +                    <span className="text-[10px] text-warning/80
         +uppercase font-medium">Preview: Pricing after approval</span>
      77                      <div className="grid grid-cols-3 gap-1 mt-2 opacity-60">
      78                          {WHOLESALE_TIERS.map((tier) => {
      79                              const discountedPrice = basePrice * (1 - tier.discount);
      80                              return (
      81 -                                <div key={tier.minQuantity} className="flex flex-col items-center p-1
         -rounded bg-yellow-100/50 dark:bg-yellow-900/30 border border-yellow-200/50 dark:border-yellow-800/50">
      82 -                                    <span className="text-[9px] text-yellow-700 dark:text-yellow-500
         -font-bold">{tier.minQuantity}+ qty</span>
      83 -                                    <span className="text-[10px] font-bold text-
         -yellow-800 dark:text-yellow-400">{formatCurrency(discountedPrice)}</span>
      81 +                                <div key={tier.minQuantity} className="flex flex-col items-center p-1
         +rounded bg-warning/10 border border-warning/20">
      82 +                                    <span className="text-[9px] text-warning
         +font-bold">{tier.minQuantity}+ qty</span>
      83 +                                    <span className="text-[10px] font-bold text-warning
         +">{formatCurrency(discountedPrice)}</span>
      84                                  </div>
      85                              );
      86                          })}