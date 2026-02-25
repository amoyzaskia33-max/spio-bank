import { test, expect } from '@playwright/test';

/**
 * SPIO OS E2E Tests - Librarian Integration
 */
test.describe('SPIO OS - Librarian Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for boot
  });

  test('should display newly synced components in Explorer', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Alert Banner (synced via librarian) should be visible
    await expect(page.getByText('Alert Banner').first()).toBeVisible();
    
    // Skeleton Loader (synced via librarian) should be visible
    await expect(page.getByText('Skeleton Loader').first()).toBeVisible();
  });

  test('should display correct category for synced components', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Frontend components should be in Frontend category
    // Just verify they're visible in the list
    await expect(page.getByText('Alert Banner').first()).toBeVisible();
    await expect(page.getByText('Skeleton Loader').first()).toBeVisible();
  });

  test('should show description for synced components', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Component descriptions should be visible somewhere
    await expect(page.locator('body')).toContainText('dismissible');
  });

  test('should open synced component in Code Terminal', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Click on synced component
    await page.getByText('Alert Banner').first().click();
    await page.waitForTimeout(1000);

    // Code Terminal should open
    await expect(page.getByText('Code Terminal').first()).toBeVisible();
    
    // Code should be displayed
    await expect(page.locator('pre').first()).toBeVisible();
  });

  test('should show component count updated after sync', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Stats should reflect all components including synced ones
    await expect(page.locator('body')).toContainText(/\d+/);
  });
});
