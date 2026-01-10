import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

/**
 * Currency Exchange Rates API
 * Fetches real-time rates from European Central Bank (ECB)
 * Base currency: EUR
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch latest rates from ECB
    const response = await fetch(
      'https://api.exchangerate.host/latest?base=SEK&symbols=EUR,NOK,DKK',
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('Exchange rate API returned error');
    }

    // Format rates for our application
    const rates = {
      SEK: 1.0,
      EUR: data.rates.EUR || 0.089,
      NOK: data.rates.NOK || 1.03,
      DKK: data.rates.DKK || 0.67,
      lastUpdated: data.date || new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      rates,
      base: 'SEK',
      lastUpdated: rates.lastUpdated,
    });
  } catch (error: any) {
    console.error('Currency API error:', error);

    // Return fallback rates if API fails
    return NextResponse.json(
      {
        success: true,
        rates: {
          SEK: 1.0,
          EUR: 0.089,
          NOK: 1.03,
          DKK: 0.67,
          lastUpdated: new Date().toISOString().split('T')[0],
        },
        base: 'SEK',
        fallback: true,
        message: 'Using fallback rates due to API error',
      },
      { status: 200 }
    );
  }
}
