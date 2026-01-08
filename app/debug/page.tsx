'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container, Section } from '@/components/craft';
import { testWooCommerceConnection } from '@/app/actions/debug';

export default function DebugPage() {
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const runTests = async () => {
        setLoading(true);
        try {
            const data = await testWooCommerceConnection();
            setResults(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Section>
            <Container>
                <div className="space-y-6 py-8">
                    <h1 className="text-3xl font-bold">WooCommerce API Debug Tool</h1>
                    <p className="text-muted-foreground">This tool tests your WooCommerce REST API connection and displays the raw responses.</p>

                    <Button onClick={runTests} disabled={loading} size="lg">
                        {loading ? 'Running Tests...' : 'Run Connection Tests'}
                    </Button>

                    {results && (
                        <div className="space-y-4">
                            {/* Configuration */}
                            <Card className="p-6">
                                <h2 className="font-bold text-lg mb-3">Configuration</h2>
                                <div className="grid gap-2 text-sm font-mono">
                                    <div className="flex gap-2"><span className="font-semibold w-48">WordPress URL:</span> <span className="text-blue-600 dark:text-blue-400">{results.config.wordpressUrl}</span></div>
                                    <div className="flex gap-2"><span className="font-semibold w-48">API URL:</span> <span className="text-blue-600 dark:text-blue-400">{results.config.apiUrl}</span></div>
                                    <div className="flex gap-2"><span className="font-semibold w-48">Consumer Key Set:</span> <span className={results.config.hasConsumerKey ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{results.config.hasConsumerKey ? '✓ Yes' : '✗ No'}</span></div>
                                    <div className="flex gap-2"><span className="font-semibold w-48">Consumer Secret Set:</span> <span className={results.config.hasConsumerSecret ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{results.config.hasConsumerSecret ? '✓ Yes' : '✗ No'}</span></div>
                                    {results.config.error && (
                                        <div className="text-red-600 dark:text-red-400 mt-2"><strong>Error:</strong> {results.config.error}</div>
                                    )}
                                </div>
                            </Card>

                            {/* Tests */}
                            <div className="grid gap-4">
                                {/* Auth Test */}
                                <Card className="p-4">
                                    <h2 className="font-bold mb-2">Auth Test (Settings Endpoint)</h2>
                                    <div className={`p-3 rounded text-sm ${results.auth.success ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200'}`}>
                                        {results.auth.message}
                                    </div>
                                    {results.auth.responseText && (
                                        <details className="mt-3">
                                            <summary className="cursor-pointer text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">View Raw Response</summary>
                                            <pre className="text-xs mt-2 bg-neutral-100 dark:bg-neutral-900 p-3 rounded overflow-auto max-h-48 font-mono border">
                                                {results.auth.responseText}
                                            </pre>
                                        </details>
                                    )}
                                </Card>

                                {/* Shipping Zones Test */}
                                <Card className="p-4">
                                    <h2 className="font-bold mb-2">Shipping Zones Test</h2>
                                    {results.zones.success ? (
                                        <div className="space-y-2">
                                            <div className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 p-3 rounded text-sm">
                                                ✓ Success - Found {results.zones.data?.length || 0} zone(s)
                                            </div>
                                            {results.zones.data && results.zones.data.length > 0 && (
                                                <div className="text-sm">
                                                    <strong>Zones:</strong> {results.zones.data.map((z: any) => z.name).join(', ')}
                                                </div>
                                            )}
                                            <details>
                                                <summary className="cursor-pointer text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">View Zones Data</summary>
                                                <pre className="text-xs mt-2 bg-neutral-100 dark:bg-neutral-900 p-3 rounded overflow-auto max-h-48 font-mono border">
                                                    {JSON.stringify(results.zones.data, null, 2)}
                                                </pre>
                                            </details>
                                            {results.zones.firstZoneMethods && (
                                                <details>
                                                    <summary className="cursor-pointer text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">First Zone Shipping Methods</summary>
                                                    <pre className="text-xs mt-2 bg-neutral-100 dark:bg-neutral-900 p-3 rounded overflow-auto max-h-48 font-mono border">
                                                        {JSON.stringify(results.zones.firstZoneMethods, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                            {results.zones.methodsResponseText && (
                                                <details>
                                                    <summary className="cursor-pointer text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline">Methods Raw Response (Error)</summary>
                                                    <pre className="text-xs mt-2 bg-neutral-100 dark:bg-neutral-900 p-3 rounded overflow-auto max-h-48 font-mono border">
                                                        {results.zones.methodsResponseText}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 p-3 rounded text-sm">
                                                ✗ {results.zones.error}
                                            </div>
                                            {results.zones.responseText && (
                                                <details className="mt-3">
                                                    <summary className="cursor-pointer text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">View Raw Response</summary>
                                                    <pre className="text-xs mt-2 bg-neutral-100 dark:bg-neutral-900 p-3 rounded overflow-auto max-h-48 font-mono border">
                                                        {results.zones.responseText}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    )}
                                </Card>

                                {/* Payment Gateways Test */}
                                <Card className="p-4">
                                    <h2 className="font-bold mb-2">Payment Gateways Test</h2>
                                    {results.gateways.success ? (
                                        <div className="space-y-2">
                                            <div className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 p-3 rounded text-sm">
                                                ✓ Success - Found {results.gateways.data?.length || 0} gateway(s)
                                            </div>
                                            <details>
                                                <summary className="cursor-pointer text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">View Gateways Data</summary>
                                                <pre className="text-xs mt-2 bg-neutral-100 dark:bg-neutral-900 p-3 rounded overflow-auto max-h-48 font-mono border">
                                                    {JSON.stringify(results.gateways.data, null, 2)}
                                                </pre>
                                            </details>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 p-3 rounded text-sm">
                                                ✗ {results.gateways.error}
                                            </div>
                                            {results.gateways.responseText && (
                                                <details className="mt-3">
                                                    <summary className="cursor-pointer text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">View Raw Response</summary>
                                                    <pre className="text-xs mt-2 bg-neutral-100 dark:bg-neutral-900 p-3 rounded overflow-auto max-h-48 font-mono border">
                                                        {results.gateways.responseText}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </Section>
    );
}
