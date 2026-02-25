import { test, expect } from '@playwright/test';

/**
 * SPIO OS E2E Tests - Vault Auto-Discovery
 * Tests for dynamic vault component loading
 */
test.describe('SPIO OS - Vault Auto-Discovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for boot
  });

  test('should load vault components via API', async ({ page }) => {
    // Direct API test
    const response = await page.request.get('/api/vault');
    expect(response.ok()).toBe(true);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.stats).toBeDefined();
  });

  test('should open SPIO Explorer and display vault components', async ({ page }) => {
    // Open SPIO Explorer
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(1500);

    // Should show vault stats
    await expect(page.getByText('Frontend', { exact: true }).first()).toBeVisible();
  });

  test('should display PricingCard from vault', async ({ page }) => {
    // Open SPIO Explorer
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(1500);

    // PricingCard should be visible
    await expect(page.getByText('PricingCard').first()).toBeVisible();
  });

  test('should open PricingCard in Code Terminal', async ({ page }) => {
    // Open SPIO Explorer
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(1500);

    // Click on PricingCard
    await page.getByText('PricingCard').first().click();
    await page.waitForTimeout(2000);

    // Code Terminal should open
    await expect(page.getByText('Code Terminal').first()).toBeVisible();
    
    // Verify Code Library sidebar is visible
    await expect(page.getByText('Code Library').first()).toBeVisible();
  });
});
