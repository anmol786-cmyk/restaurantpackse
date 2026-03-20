/**
 * Order Template Sync
 *
 * Hybrid persistence layer for order templates:
 * - When logged in:  read from server (WooCommerce customer meta), write to
 *                    both server and localStorage cache.
 * - When not logged in: read/write localStorage only.
 *
 * The server is the source of truth for authenticated users; localStorage
 * acts as an instant-access cache and offline fallback.
 */

import {
  getOrderTemplates,
  saveOrderTemplate,
  deleteOrderTemplate,
  type OrderTemplate,
} from '@/lib/storage/order-templates';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const raw = document.cookie
      .split('; ')
      .find((c) => c.startsWith('auth-storage='))
      ?.split('=')
      .slice(1)
      .join('=');

    if (!raw) return false;

    const authData = JSON.parse(decodeURIComponent(raw));
    return !!authData?.state?.token;
  } catch {
    return false;
  }
}

/**
 * Merge server templates with local templates.
 * Server wins on conflict (same id) — server is source of truth.
 * Local-only templates (not yet synced) are appended.
 */
function mergeTemplates(
  serverTemplates: OrderTemplate[],
  localTemplates: OrderTemplate[]
): OrderTemplate[] {
  const serverIds = new Set(serverTemplates.map((t) => t.id));
  const localOnly = localTemplates.filter((t) => !serverIds.has(t.id));
  return [...serverTemplates, ...localOnly];
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get all templates.
 *
 * If authenticated: fetches from server, merges with local cache, updates
 * localStorage, and returns the merged list.
 * If not authenticated: returns localStorage templates only.
 */
export async function getTemplatesWithSync(): Promise<OrderTemplate[]> {
  const local = getOrderTemplates();

  if (!isLoggedIn()) {
    return local;
  }

  try {
    const response = await fetch('/api/templates', { method: 'GET' });

    if (!response.ok) {
      // Server error — fall back to local cache silently
      return local;
    }

    const data = await response.json();
    const serverTemplates: OrderTemplate[] = data.templates ?? [];

    const merged = mergeTemplates(serverTemplates, local);

    // Update local cache with the merged result
    if (typeof window !== 'undefined') {
      localStorage.setItem('anmol_order_templates', JSON.stringify(merged));
    }

    return merged;
  } catch (error) {
    console.warn('[order-templates-sync] Failed to fetch from server, using local cache:', error);
    return local;
  }
}

/**
 * Save a new template.
 *
 * Always saves to localStorage immediately (instant UI feedback).
 * If authenticated, also POSTs to the server.
 *
 * Returns the newly created template.
 */
export async function saveTemplateWithSync(
  name: string,
  items: OrderTemplate['items']
): Promise<OrderTemplate> {
  // Persist locally first — this is instant and also the fallback
  const newTemplate = saveOrderTemplate(name, items);

  if (!isLoggedIn()) {
    return newTemplate;
  }

  try {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: newTemplate }),
    });

    if (!response.ok) {
      console.warn('[order-templates-sync] Server save failed — template kept locally only');
    }
  } catch (error) {
    console.warn('[order-templates-sync] Network error saving template to server:', error);
  }

  return newTemplate;
}

/**
 * Delete a template by id.
 *
 * Removes from localStorage immediately.
 * If authenticated, also sends DELETE to the server.
 *
 * Returns true if the template was found locally, false otherwise.
 */
export async function deleteTemplateWithSync(id: string): Promise<boolean> {
  const removed = deleteOrderTemplate(id);

  if (!isLoggedIn()) {
    return removed;
  }

  try {
    const response = await fetch(`/api/templates?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.warn('[order-templates-sync] Server delete failed — template already removed locally');
    }
  } catch (error) {
    console.warn('[order-templates-sync] Network error deleting template from server:', error);
  }

  return removed;
}
