import { NextRequest, NextResponse } from 'next/server';

/**
 * VAT Validation API Endpoint
 * Validates EU VAT numbers using the VIES (VAT Information Exchange System) service
 */

interface VIESResponse {
  valid: boolean;
  name?: string;
  address?: string;
  countryCode: string;
  vatNumber: string;
  requestDate: string;
}

// VIES SOAP endpoint
const VIES_URL = 'https://ec.europa.eu/taxation_customs/vies/services/checkVatService';

/**
 * Build SOAP request for VIES
 */
function buildSOAPRequest(countryCode: string, vatNumber: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:checkVat>
         <urn:countryCode>${countryCode}</urn:countryCode>
         <urn:vatNumber>${vatNumber}</urn:vatNumber>
      </urn:checkVat>
   </soapenv:Body>
</soapenv:Envelope>`;
}

/**
 * Parse VIES SOAP response
 */
function parseSOAPResponse(xml: string): VIESResponse | null {
  try {
    // Extract values using regex (simple parsing for SOAP response)
    const validMatch = xml.match(/<valid>(true|false)<\/valid>/);
    const nameMatch = xml.match(/<name>([^<]*)<\/name>/);
    const addressMatch = xml.match(/<address>([^<]*)<\/address>/);
    const countryCodeMatch = xml.match(/<countryCode>([^<]*)<\/countryCode>/);
    const vatNumberMatch = xml.match(/<vatNumber>([^<]*)<\/vatNumber>/);
    const requestDateMatch = xml.match(/<requestDate>([^<]*)<\/requestDate>/);

    if (!validMatch || !countryCodeMatch || !vatNumberMatch) {
      return null;
    }

    return {
      valid: validMatch[1] === 'true',
      name: nameMatch ? nameMatch[1].trim() : undefined,
      address: addressMatch ? addressMatch[1].trim().replace(/\n/g, ', ') : undefined,
      countryCode: countryCodeMatch[1],
      vatNumber: vatNumberMatch[1],
      requestDate: requestDateMatch ? requestDateMatch[1] : new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error parsing VIES response:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { countryCode, vatNumber } = body;

    if (!countryCode || !vatNumber) {
      return NextResponse.json(
        { error: 'Country code and VAT number are required' },
        { status: 400 }
      );
    }

    // Normalize inputs
    const normalizedCountry = countryCode.toUpperCase().trim();
    const normalizedVAT = vatNumber.replace(/[\s.-]/g, '').toUpperCase();

    // Validate country code
    const euCountries = [
      'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES',
      'FI', 'FR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
      'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK', 'XI'
    ];

    if (!euCountries.includes(normalizedCountry)) {
      return NextResponse.json(
        {
          valid: false,
          error: 'VIES only validates EU VAT numbers',
          countryCode: normalizedCountry,
          vatNumber: normalizedVAT,
        },
        { status: 400 }
      );
    }

    // Build and send SOAP request
    const soapRequest = buildSOAPRequest(normalizedCountry, normalizedVAT);

    const response = await fetch(VIES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': '',
      },
      body: soapRequest,
    });

    if (!response.ok) {
      // VIES service might be temporarily unavailable
      console.error('VIES service error:', response.status, response.statusText);
      return NextResponse.json(
        {
          valid: false,
          error: 'VAT validation service temporarily unavailable. Please try again later.',
          serviceUnavailable: true,
        },
        { status: 503 }
      );
    }

    const xmlResponse = await response.text();
    const result = parseSOAPResponse(xmlResponse);

    if (!result) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Unable to parse validation response',
        },
        { status: 500 }
      );
    }

    // Return validation result
    return NextResponse.json({
      valid: result.valid,
      countryCode: result.countryCode,
      vatNumber: result.vatNumber,
      name: result.name || null,
      address: result.address || null,
      requestDate: result.requestDate,
    });

  } catch (error) {
    console.error('VAT validation error:', error);
    return NextResponse.json(
      {
        valid: false,
        error: 'An error occurred while validating VAT number',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'VAT Validation API',
      usage: 'POST with { countryCode: "SE", vatNumber: "123456789001" }',
      supportedCountries: [
        'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES',
        'FI', 'FR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
        'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK', 'XI'
      ],
    },
    { status: 200 }
  );
}
