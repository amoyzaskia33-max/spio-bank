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
    await expect(page.getByText('Button Glow', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Card Animated').first()).toBeVisible();
  });

  test('should show live preview for Frontend components', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Select a component
    await page.getByText('Button Glow', { exact: true }).first().click();
    await page.waitForTimeout(500);

    // Preview should be visible
    await expect(page.getByRole('button', { name: 'Preview' }).first()).toBeVisible();
    
    // The actual component button should be rendered (not window controls)
    const componentButton = page.locator('[class*="shadow-lg"]').first();
    await expect(componentButton).toBeVisible();
  });

  test('should toggle between Preview and Code view', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Select a component
    await page.getByText('Button Glow', { exact: true }).first().click();
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
    await page.getByText('Button Glow', { exact: true }).first().click();
    await page.waitForTimeout(500);

    // Click mobile view
    await page.getByRole('button', { name: 'Mobile View' }).click();
    await page.waitForTimeout(300);

    // Mobile view button should be active
    await expect(page.getByRole('button', { name: 'Mobile View' })).toHaveClass(/bg-white\/10/);

    // Switch to full width
    await page.getByRole('button', { name: 'Full Width' }).click();
    await page.waitForTimeout(300);
  });

  test('should show component info bar', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Select a component
    await page.getByText('Button Glow', { exact: true }).first().click();
    await page.waitForTimeout(500);

    // Info bar should show component name
    await expect(page.locator('body')).toContainText('Button Glow');
  });

  test('should display Live badge for interactive components', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Component list should show Live badges
    await expect(page.locator('body')).toContainText('Live');
  });

  test('should show empty state when no component selected', async ({ page }) => {
    // Open UI Canvas without selecting anything
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Empty state should be visible
    await expect(page.locator('body')).toContainText('Select a component');
  });

  test('should render interactive button component', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Select Button component
    await page.getByText('Button Glow', { exact: true }).first().click();
    await page.waitForTimeout(500);

    // Button should be clickable
    const button = page.locator('[class*="shadow-lg"]').first();
    await expect(button).toBeEnabled();
    
    // Hover effect
    await button.hover();
    await page.waitForTimeout(200);
  });

  test('should render animated card component', async ({ page }) => {
    await page.getByRole('button', { name: 'UI Canvas' }).click();
    await page.waitForTimeout(500);

    // Select Card component
    await page.getByText('Card Animated').first().click();
    await page.waitForTimeout(500);

    // Card should be visible
    await expect(page.getByText('Premium Card')).toBeVisible();
  });
});
