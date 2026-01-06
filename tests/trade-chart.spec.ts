import { test, expect } from '@playwright/test';

test('trade chart stays visible after BUY/SELL (desktop)', async ({ page }) => {
  await page.addInitScript(() => {
    const u = { id: 'TEST-1', name: 'Test User', email: 'test@example.com' };
    window.localStorage.setItem('bw_user', JSON.stringify(u));
  });

  for (const width of [1280, 900, 820]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/trade', { waitUntil: 'domcontentloaded' });

    const chart = page.locator('.chart-container').first();
    await expect(chart).toBeVisible();

    // Click a SELL on the first instrument row
    await page.getByTitle(/Sell /).first().click();

    // Trading panel should open, but chart should remain visible
    await expect(page.locator('[data-tour="trading-panel"]')).toBeVisible();
    await expect(chart).toBeVisible();

    const box = await chart.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(80);
    expect(box!.height).toBeGreaterThan(80);

    // Also verify the SVG is still visible (chart rendered)
    await expect(chart.locator('svg')).toBeVisible();
  }
});
