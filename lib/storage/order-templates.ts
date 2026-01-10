/**
 * Order Template Storage
 * Save and load frequently used order templates to LocalStorage
 */

export interface OrderTemplate {
  id: string;
  name: string;
  items: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'anmol_order_templates';

/**
 * Get all saved templates
 */
export function getOrderTemplates(): OrderTemplate[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load templates:', error);
    return [];
  }
}

/**
 * Save a new template
 */
export function saveOrderTemplate(
  name: string,
  items: OrderTemplate['items']
): OrderTemplate {
  const templates = getOrderTemplates();

  const newTemplate: OrderTemplate = {
    id: crypto.randomUUID(),
    name,
    items,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  templates.push(newTemplate);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));

  return newTemplate;
}

/**
 * Update existing template
 */
export function updateOrderTemplate(
  id: string,
  updates: Partial<Pick<OrderTemplate, 'name' | 'items'>>
): OrderTemplate | null {
  const templates = getOrderTemplates();
  const index = templates.findIndex((t) => t.id === id);

  if (index === -1) return null;

  templates[index] = {
    ...templates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  return templates[index];
}

/**
 * Delete a template
 */
export function deleteOrderTemplate(id: string): boolean {
  const templates = getOrderTemplates();
  const filtered = templates.filter((t) => t.id !== id);

  if (filtered.length === templates.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Get template by ID
 */
export function getOrderTemplate(id: string): OrderTemplate | null {
  const templates = getOrderTemplates();
  return templates.find((t) => t.id === id) || null;
}

/**
 * Clear all templates
 */
export function clearAllTemplates(): void {
  localStorage.removeItem(STORAGE_KEY);
}
