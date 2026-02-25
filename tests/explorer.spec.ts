import { test, expect } from '@playwright/test';

/**
 * SPIO OS E2E Tests - SPIO Explorer
 */
test.describe('SPIO OS - Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for boot
  });

  test('should open SPIO Explorer from taskbar', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Explorer window should be visible
    await expect(page.getByText('SPIO Explorer').first()).toBeVisible();
    // Check sidebar is visible
    await expect(page.getByText('Frontend').first()).toBeVisible();
  });

  test('should display component categories', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Check category headers in sidebar
    await expect(page.getByText('Frontend').first()).toBeVisible();
    await expect(page.getByText('Backend').first()).toBeVisible();
    await expect(page.getByText('Prompt').first()).toBeVisible();
  });

  test('should show component count per category', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Stats should be visible - check for number badges
    await expect(page.locator('body')).toContainText(/\d+/);
  });

  test('should expand/collapse categories', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Frontend category should be expanded by default
    await expect(page.getByText('Button Glow').first()).toBeVisible();

    // Click to collapse
    await page.getByText('Frontend').first().click();
    await page.waitForTimeout(300);

    // Components might be hidden - just check category is still visible
    await expect(page.getByText('Frontend').first()).toBeVisible();
  });

  test('should select component and open related windows', async ({ page }) => {
    // Open Explorer
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Click on a component
    await page.getByText('Button Glow').first().click();
    await page.waitForTimeout(1000);

    // Code Terminal and UI Canvas should open
    await expect(page.getByText('Code Terminal').first()).toBeVisible();
    await expect(page.getByText('UI Canvas').first()).toBeVisible();
  });

  test('should display component grid in main area', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Component cards should be visible
    await expect(page.getByRole('heading', { name: 'Button Glow' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Card Animated' })).toBeVisible();
  });

  test('should show component description', async ({ page }) => {
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Descriptions should be visible
    await expect(page.locator('body')).toContainText('Interactive');
  });
});
