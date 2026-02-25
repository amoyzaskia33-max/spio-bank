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
    // Open SPIO Explorer
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(1500);

    // Should show vault stats
    await expect(page.getByText('Frontend')).toBeVisible();
  });

  test('should display Pricing Card from vault', async ({ page }) => {
    // Open SPIO Explorer
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(1500);

    // Pricing Card should be visible
    await expect(page.getByText('Pricing Card').first()).toBeVisible();
  });

  test('should open Pricing Card in Code Terminal', async ({ page }) => {
    // Open SPIO Explorer
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(1500);

    // Click on Pricing Card
    await page.getByText('Pricing Card').first().click();
    await page.waitForTimeout(1000);

    // Code Terminal should open
    await expect(page.getByText('Code Terminal').first()).toBeVisible();
  });

  test('should show vault API response', async ({ page }) => {
    // Direct API test
    const response = await page.request.get('/api/vault');
    expect(response.ok()).toBe(true);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.stats).toBeDefined();
  });
});
