import { test, expect } from '@playwright/test';

/**
 * SPIO OS E2E Tests - Window Manager
 */
test.describe('SPIO OS - Window Manager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for boot
  });

  test('should open window when clicking taskbar icon', async ({ page }) => {
    // Click SPIO Explorer icon
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Window title bar should be visible
    await expect(page.getByText('SPIO Explorer').first()).toBeVisible();
  });

  test('should close window when clicking close button', async ({ page }) => {
    // Open window
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Window should be visible
    await expect(page.getByText('SPIO Explorer').first()).toBeVisible();

    // Click close button
    await page.getByRole('button', { name: 'Close' }).first().click();
    await page.waitForTimeout(500);

    // Window should be hidden
    await expect(page.getByText('SPIO Explorer').first()).not.toBeVisible();
  });

  test('should minimize window when clicking minimize button', async ({ page }) => {
    // Open window
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Click minimize button
    await page.getByRole('button', { name: 'Minimize' }).first().click();
    await page.waitForTimeout(300);

    // Window content should be hidden
    await expect(page.getByText('SPIO Explorer').nth(1)).not.toBeVisible();
  });

  test('should maximize and restore window', async ({ page }) => {
    // Open window
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Get initial window position
    const windowElement = page.locator('[draggable="false"]').first();
    const initialBox = await windowElement.boundingBox();
    expect(initialBox).toBeTruthy();

    // Click maximize button
    await page.getByRole('button', { name: 'Maximize' }).first().click();
    await page.waitForTimeout(300);

    // Click restore button
    await page.getByRole('button', { name: 'Restore' }).first().click();
    await page.waitForTimeout(300);

    // Window should still be visible after restore
    await expect(page.getByText('SPIO Explorer').first()).toBeVisible();
  });

  test('should drag window by title bar', async ({ page }) => {
    // Open window
    await page.getByRole('button', { name: 'SPIO Explorer' }).click();
    await page.waitForTimeout(500);

    // Get initial position
    const windowElement = page.locator('[draggable="false"]').first();
    const initialBox = await windowElement.boundingBox();
    expect(initialBox).toBeTruthy();

    // Drag the window by title bar
    const titleBar = page.locator('[class*="cursor-move"]').first();
    await titleBar.dragTo(page.locator('body'), {
      targetPosition: { x: 300, y: 300 }
    });
    await page.waitForTimeout(500);

    // Window should still be visible
    await expect(windowElement).toBeVisible();
  });
});
