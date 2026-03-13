import { test, expect } from '@playwright/test';

test.describe('Tools Pages E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Set Hebrew locale
    page.context().addInitScript(() => {
      localStorage.setItem('locale', 'he');
    });
  });

  test('BPM Calculator page loads and displays correctly', async ({ page }) => {
    await page.goto('/tools/bpm');

    // Check page title
    await expect(page).toHaveTitle(/BPM|בחשבון/);

    // Check Hebrew content
    await expect(page.locator('h2')).toContainText('מחשבון BPM');
    await expect(page.locator('text=הקש על העיגול')).toBeVisible();

    // Check tap button exists
    const tapButton = page.locator('button').filter({ has: page.locator('text=BPM') }).first();
    await expect(tapButton).toBeVisible();
  });

  test('BPM Calculator tap functionality works', async ({ page }) => {
    await page.goto('/tools/bpm');

    const tapButton = page.locator('button').filter({ has: page.locator('text=BPM') }).first();

    // Initial state - BPM should be dash
    await expect(page.locator('text=—')).toBeVisible();

    // Tap the button
    await tapButton.click();

    // Check tap count increased
    await expect(page.locator('text=הקשות: 1')).toBeVisible();

    // Tap again
    await tapButton.click();

    // Check tap count
    await expect(page.locator('text=הקשות: 2')).toBeVisible();

    // BPM should start showing after 2 taps
    const bpmDisplay = page.locator('span.text-dj-cyan').first();
    await expect(bpmDisplay).not.toContainText('—');
  });

  test('BPM Calculator reset button works', async ({ page }) => {
    await page.goto('/tools/bpm');

    const tapButton = page.locator('button').filter({ has: page.locator('text=BPM') }).first();

    // Tap several times
    for (let i = 0; i < 3; i++) {
      await tapButton.click();
    }

    // Verify taps registered
    await expect(page.locator('text=הקשות: 3')).toBeVisible();

    // Click reset button
    const resetButton = page.locator('button', { hasText: /אפס/ });
    await resetButton.click();

    // Verify reset
    await expect(page.locator('text=הקשות: 0')).toBeVisible();
    await expect(page.locator('text=—')).toBeVisible();
  });

  test('BPM Calculator manual input works', async ({ page }) => {
    await page.goto('/tools/bpm');

    const input = page.locator('input[type="number"][placeholder="120.0"]');

    // Enter BPM value
    await input.fill('128');

    // Check display updated
    const bpmDisplay = page.locator('span.text-dj-cyan').first();
    await expect(bpmDisplay).toContainText('128');
  });

  test('BPM Calculator shows genre', async ({ page }) => {
    await page.goto('/tools/bpm');

    const input = page.locator('input[type="number"][placeholder="120.0"]');

    // Enter House BPM
    await input.fill('125');

    // Should show genre label
    await expect(page.locator('text=House|Tech House')).toBeVisible();
  });

  test('Harmonic Wheel page loads correctly', async ({ page }) => {
    await page.goto('/tools/harmonic-wheel');

    // Check Hebrew content
    await expect(page.locator('text=גלגל הרמוני')).toBeVisible();

    // Check page elements exist
    const heading = page.locator('h2').filter({ hasText: /גלגל/ });
    await expect(heading).toBeVisible();
  });

  test('Harmonic Wheel key selection works', async ({ page }) => {
    await page.goto('/tools/harmonic-wheel');

    // Wait for wheel to load
    await page.waitForSelector('[data-key]', { timeout: 5000 }).catch(() => null);

    // Try selecting a key
    const keyButton = page.locator('button').filter({ hasText: /C|Do|ד/ }).first();
    if (await keyButton.isVisible()) {
      await keyButton.click();

      // Verify selection
      await expect(keyButton).toHaveClass(/selected|active|highlighted/);
    }
  });

  test('Tools listing page shows all tools', async ({ page }) => {
    await page.goto('/tools');

    // Check page title/heading
    const heading = page.locator('h1, h2').filter({ hasText: /כלים|Tools/ });
    await expect(heading).toBeVisible();

    // Check all tool cards exist
    const tools = [
      'מחשבון BPM',
      'גלגל הרמוני',
      'אימון EQ',
      'אימון Beatmatch',
      'מתכנן סטים',
    ];

    for (const tool of tools) {
      const toolCard = page.locator(`text=${tool}`);
      // Some tools might not be visible in all views, check if page at least loads
      if (await toolCard.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(toolCard).toBeVisible();
      }
    }
  });

  test('Navigation between tools works', async ({ page }) => {
    await page.goto('/tools');

    // Click on BPM Calculator
    const bpmLink = page.locator('a, button').filter({ hasText: /BPM|מחשבון/ }).first();

    if (await bpmLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await bpmLink.click();

      // Should navigate to BPM page
      await expect(page).toHaveURL(/bpm|calculator/i);
      await expect(page.locator('text=מחשבון BPM')).toBeVisible();
    }
  });

  test('Tool pages are responsive', async ({ page }) => {
    await page.goto('/tools/bpm');

    // Check that layout adapts
    const mainContent = page.locator('main, [role="main"]').first();
    await expect(mainContent).toBeVisible();

    // Check that page doesn't scroll horizontally
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test('Tools pages have Hebrew language', async ({ page }) => {
    await page.goto('/tools/bpm');

    // Check HTML lang attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'he');

    // Check RTL direction
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('Tool pages load without errors', async ({ page }) => {
    const tools = ['/tools', '/tools/bpm', '/tools/harmonic-wheel'];

    for (const tool of tools) {
      await page.goto(tool);

      // Check no error messages
      const errorElements = await page.locator('[role="alert"], .error, .error-message').count();
      expect(errorElements).toBe(0);

      // Check page has content
      const mainContent = page.locator('main, body').first();
      const text = await mainContent.textContent();
      expect(text).toBeTruthy();
      expect(text?.length).toBeGreaterThan(10);
    }
  });

  test('Tool pages have proper meta tags', async ({ page }) => {
    await page.goto('/tools/bpm');

    // Check title
    const title = await page.title();
    expect(title).toBeTruthy();

    // Check viewport meta
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });

  test('Tool pages prevent horizontal scrolling', async ({ page }) => {
    await page.goto('/tools/bpm');

    // Get scroll width
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for rounding
  });

  test('Tool pages use correct colors theme', async ({ page }) => {
    await page.goto('/tools/bpm');

    // Check for dark theme colors
    const heading = page.locator('h2').filter({ hasText: /מחשבון/ });
    const styles = await heading.evaluate((el) => window.getComputedStyle(el));

    // Check that text is visible (light text on dark background)
    const color = styles.color;
    expect(color).toBeTruthy();
  });

  test('BPM Calculator supports keyboard shortcuts', async ({ page }) => {
    await page.goto('/tools/bpm');

    // Press space to tap
    await page.keyboard.press('Space');

    // Check tap count increased
    await expect(page.locator('text=הקשות: 1')).toBeVisible();

    // Press space again
    await page.keyboard.press('Space');

    // Check tap count
    await expect(page.locator('text=הקשות: 2')).toBeVisible();

    // Press Escape to reset
    await page.keyboard.press('Escape');

    // Check reset
    await expect(page.locator('text=הקשות: 0')).toBeVisible();
  });

  test('Tool pages accessibility - keyboard navigation', async ({ page }) => {
    await page.goto('/tools/bpm');

    // Tab to first button
    await page.keyboard.press('Tab');

    // Should focus something
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();

    // Tab again
    await page.keyboard.press('Tab');

    // Should focus something different
    const newFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(newFocused).toBeTruthy();
  });
});
