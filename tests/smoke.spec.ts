import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Bullwaves - Trading Platform/i);
});
