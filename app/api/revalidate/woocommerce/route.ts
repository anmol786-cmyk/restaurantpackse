import { createHmac, timingSafeEqual } from "crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { CATALOG_CACHE_TAG } from "@/lib/woocommerce/api";

/**
 * WooCommerce webhook receiver (Product created / updated / deleted / restored).
 * Purges the cached catalogue so price and stock edits show up immediately
 * instead of after the 5-minute cache window.
 *
 * Setup: WooCommerce → Settings → Advanced → Webhooks, delivery URL
 * https://restaurantpack.se/api/revalidate/woocommerce, secret = WOOCOMMERCE_WEBHOOK_SECRET.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-wc-webhook-signature") || "";
  const expected = createHmac("sha256", secret).update(rawBody).digest("base64");

  const valid =
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!valid) {
    // WooCommerce sends an unsigned ping ("webhook_id=…") when the webhook is saved
    if (rawBody.startsWith("webhook_id=")) {
      return NextResponse.json({ message: "pong" });
    }
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  revalidateTag(CATALOG_CACHE_TAG);

  return NextResponse.json({
    revalidated: true,
    topic: request.headers.get("x-wc-webhook-topic"),
    timestamp: new Date().toISOString(),
  });
}
