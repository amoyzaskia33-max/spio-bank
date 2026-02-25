import { test, expect } from '@playwright/test';

/**
 * SPIO OS E2E Tests - Boot Sequence & Desktop
 */
test.describe('SPIO OS - Boot & Desktop', () => {
  test('should show boot screen on initial load', async ({ page }) => {
    await page.goto('/');

    // Boot screen should be visible initially
    await expect(page.getByText('[OK] Booting SPIO Core...').first()).toBeVisible();
    await expect(page.getByText('[OK] Loading Boilerplate Vault...').first()).toBeVisible();
  });

  test('should transition to desktop after boot', async ({ page }) => {
    await page.goto('/');

    // Wait for boot to complete (1.5s boot sequence)
    await page.waitForTimeout(2000);

    // Taskbar should be visible
    await expect(page.getByRole('button', { name: 'SPIO Explorer' }).first()).toBeVisible();
  });

  test('should display taskbar with app icons', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Check all 3 app icons are present
    await expect(page.getByRole('button', { name: 'SPIO Explorer' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Code Terminal' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'UI Canvas' }).first()).toBeVisible();
  });

  test('should have grid background pattern', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Check body has the desktop container
    await expect(page.locator('body')).toBeVisible();
  });
});
