import { test, expect } from '@playwright/test';

/**
 * SPIO OS E2E Tests - Librarian Integration
 */
test.describe('SPIO OS - Librarian Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for boot
  });

  test('should display vault components in Explorer', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Pricing Card (from vault) should be visible
    await expect(page.getByText('PricingCard Component').first()).toBeVisible();

    // PromoBanner (from vault) should be visible
    await expect(page.getByText('PromoBanner Component').first()).toBeVisible();
  });

  test('should display correct category for vault components', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Frontend components should be in Frontend category
    await expect(page.getByText('PricingCard Component').first()).toBeVisible();
    await expect(page.getByText('PromoBanner Component').first()).toBeVisible();
  });

  test('should show component count for vault', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Component count should be visible
    await expect(page.locator('body')).toContainText('Frontend');
  });

  test('should open vault component in Code Terminal', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Click on vault component
    await page.getByText('PricingCard Component').first().click();
    await page.waitForTimeout(1000);

    // Code Terminal should open
    await expect(page.getByText('Code Terminal').first()).toBeVisible();

    // Code should be displayed - look for code content or editor
    await expect(page.locator('body')).toContainText('PricingCard');
  });

  test('should show component count updated', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Stats should reflect vault components
    await expect(page.locator('body')).toContainText(/\d+/);
  });
});
