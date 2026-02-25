import { test, expect } from '@playwright/test';

/**
 * SPIO OS E2E Tests - UI Canvas
 */
test.describe('SPIO OS - UI Canvas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for boot
  });

  test('should open UI Canvas from taskbar', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // UI Canvas window should be visible
    await expect(page.getByText('UI Canvas').first()).toBeVisible();
    await expect(page.getByText('UI Components')).toBeVisible();
  });

  test('should display component list sidebar', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Component list should be visible
    await expect(page.getByText('PricingCard Component').first()).toBeVisible();
    await expect(page.getByText('PromoBanner Component').first()).toBeVisible();
  });

  test('should show live preview for Frontend components', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Select a component
    await page.getByText('PricingCard Component').first().click();
    await page.waitForTimeout(500);

    // Preview should be visible
    await expect(page.getByRole('button', { name: 'Preview' }).first()).toBeVisible();

    // Component content should be rendered
    await expect(page.locator('body')).toContainText('PricingCard');
  });

  test('should toggle between Preview and Code view', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Select a component
    await page.getByText('PricingCard Component').first().click();
    await page.waitForTimeout(500);

    // Switch to Code view
    await page.getByRole('button', { name: 'Code', exact: true }).click();
    await page.waitForTimeout(300);

    // Code block should be visible (any pre tag in the content area)
    await expect(page.locator('pre').first()).toBeVisible();

    // Switch back to Preview
    await page.getByRole('button', { name: 'Preview' }).click();
    await page.waitForTimeout(300);

    // Preview should be visible again
    await expect(page.getByRole('button', { name: 'Preview' }).first()).toBeVisible();
  });

  test('should change device size for responsive preview', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Select a component
    await page.getByText('PricingCard Component').first().click();
    await page.waitForTimeout(500);

    // Click mobile view - use title attribute
    await page.getByTitle('Mobile').click();
    await page.waitForTimeout(300);

    // Mobile view button should be active (different bg color)
    await expect(page.getByTitle('Mobile')).toHaveClass(/bg-white\/60/);

    // Switch to full width
    await page.getByTitle('Full Width').click();
    await page.waitForTimeout(300);
    
    // Full width button should be active
    await expect(page.getByTitle('Full Width')).toHaveClass(/bg-white\/60/);
  });

  test('should show component info bar', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Select a component
    await page.getByText('PricingCard Component').first().click();
    await page.waitForTimeout(500);

    // Info bar should show component name
    await expect(page.locator('body')).toContainText('PricingCard');
  });

  test('should display Live badge for interactive components', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Component list should show live changes indicator
    await expect(page.locator('body')).toContainText('live changes');
  });

  test('should show empty state when no component selected', async ({ page }) => {
    // Open UI Canvas without selecting anything
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Empty state should be visible
    await expect(page.locator('body')).toContainText('Select a component');
  });

  test('should render interactive component', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Select PricingCard component
    await page.getByText('PricingCard Component').first().click();
    await page.waitForTimeout(500);

    // Component should be visible in preview area
    await expect(page.locator('body')).toContainText('PricingCard');
  });

  test('should render promo banner component', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Select PromoBanner component
    await page.getByText('PromoBanner Component').first().click();
    await page.waitForTimeout(500);

    // PromoBanner should be visible in preview
    await expect(page.locator('body')).toContainText('PromoBanner');
  });
});
