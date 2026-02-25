/**
 * SPIO Vault Data Index
 * Auto-generated from /src/vault-data/ folder
 * DO NOT EDIT MANUALLY - Run 'npm run sync-vault' to regenerate
 * Generated at: 2026-02-25T14:35:38.213Z
 */

import type { SpioComponent } from '@/data/spio-registry';

import PricingCard from '@/vault-data/frontend/PricingCard';

export const vaultComponents: SpioComponent[] = [
  {
    id: 'vault-pricing-card',
    title: 'Pricing Card',
    category: 'Frontend',
    description: 'const PricingCard',
    codeSnippet: `import PricingCard from '@/vault-data/frontend/PricingCard';

<PricingCard
  /* Add props based on component interface */
/>`,
    componentType: PricingCard,
    isLive: true,
    tags: ['pricingcard', 'frontend'],
  }
];

/**
 * Get all vault components
 */
export function getVaultComponents(): SpioComponent[] {
  return vaultComponents;
}

/**
 * Get component by ID from vault
 */
export function getVaultComponentById(id: string): SpioComponent | undefined {
  return vaultComponents.find(comp => comp.id === id);
}
