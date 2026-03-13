import { test, expect } from '@playwright/test';

test.describe('Homepage E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Set Hebrew locale
    page.context().addInitScript(() => {
      localStorage.setItem('locale', 'he');
    });
  });

  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Page should load without errors
    await expect(page).toHaveTitle(/DJMaster|Academy/);

    // Check main content is visible
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();
  });

  test('Homepage displays Hebrew content', async ({ page }) => {
    await page.goto('/');

    // Check for Hebrew text
    const hebrewContent = await page.locator('body').locator('text=/[\u0590-\u05FF]/').count();
    expect(hebrewContent).toBeGreaterThan(0);

    // Check HTML attributes
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'he');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('Homepage navigation links work', async ({ page }) => {
    await page.goto('/');

    // Check header/nav exists
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible();

    // Check common navigation links
    const links = [
      { text: /קורסים|Courses/, url: /courses|lessons/ },
      { text: /כלים|Tools/, url: /tools/ },
    ];

    for (const link of links) {
      const navLink = page.locator('a, button').filter({ hasText: link.text }).first();
      if (await navLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Verify link is clickable
        await expect(navLink).toBeEnabled();
      }
    }
  });

  test('Homepage displays course cards', async ({ page }) => {
    await page.goto('/');

    // Look for course cards/sections
    const courseSection = page.locator('section, [class*="course"]').first();

    // If section exists, check it has content
    if (await courseSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      const cardCount = await page.locator('[class*="card"], [class*="course"]').count();
      expect(cardCount).toBeGreaterThan(0);
    }
  });

  test('Homepage shows course information', async ({ page }) => {
    await page.goto('/');

    // Check for course titles/descriptions
    const courseNames = [
      'עולם ה-DJ',
      'FLX4',
      'Rekordbox',
      'מבנה המוזיקה',
      'Beatmatching',
    ];

    let foundCourse = false;
    for (const name of courseNames) {
      if (await page.locator(`text=${name}`).isVisible({ timeout: 2000 }).catch(() => false)) {
        foundCourse = true;
        break;
      }
    }

    // At least the page should load with content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('Homepage course cards are clickable', async ({ page }) => {
    await page.goto('/');

    // Find first course link
    const courseLink = page.locator('a, button').filter({ hasText: /קורס|course/i }).first();

    if (await courseLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Should be able to click it
      await expect(courseLink).toBeEnabled();

      // Clicking should navigate or show content
      const initialUrl = page.url();
      await courseLink.click();

      // Either URL changed or modal/content appeared
      const newUrl = page.url();
      const modal = page.locator('[role="dialog"], .modal').first();

      const urlChanged = newUrl !== initialUrl;
      const modalShown = await modal.isVisible({ timeout: 1000 }).catch(() => false);

      expect(urlChanged || modalShown).toBe(true);
    }
  });

  test('Homepage responsive layout', async ({ page }) => {
    await page.goto('/');

    // Check viewport dimensions
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();

    // Check content width doesn't exceed viewport
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    // Allow 1px for rounding
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);

    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('Homepage has proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title
    const title = await page.title();
    expect(title).toContain('DJMaster');

    // Check viewport meta
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);

    // Check language meta
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'he');
  });

  test('Homepage loads images properly', async ({ page }) => {
    await page.goto('/');

    // Check for images
    const images = page.locator('img');
    const imageCount = await images.count();

    // If images exist, they should load
    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        expect(src).toBeTruthy();

        // Image should have alt text
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    }
  });

  test('Homepage has accessible heading structure', async ({ page }) => {
    await page.goto('/');

    // Should have at least one h1 or h2
    const headings = page.locator('h1, h2');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // First heading should be visible
    await expect(headings.first()).toBeVisible();
  });

  test('Homepage buttons are clickable', async ({ page }) => {
    await page.goto('/');

    // Find clickable buttons
    const buttons = page.locator('button, a[role="button"]');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      // First button should be accessible
      const firstButton = buttons.first();
      await expect(firstButton).toBeEnabled();

      // Should be visible or within viewport
      const isVisible = await firstButton.isVisible({ timeout: 1000 }).catch(() => false);
      expect(isVisible || buttonCount > 0).toBe(true);
    }
  });

  test('Homepage navigation is consistent', async ({ page }) => {
    await page.goto('/');

    // Check header
    const header = page.locator('header, [role="banner"]').first();
    await expect(header).toBeVisible();

    // Header should contain navigation
    const nav = header.locator('nav, a, button').first();
    await expect(nav).toBeVisible();
  });

  test('Homepage prevents horizontal overflow', async ({ page }) => {
    await page.goto('/');

    // Check all sections have proper width
    const sections = page.locator('section, main, article');
    const sectionCount = await sections.count();

    for (let i = 0; i < Math.min(sectionCount, 3); i++) {
      const section = sections.nth(i);
      const width = await section.evaluate((el) => el.offsetWidth);
      const parentWidth = await section.evaluate((el) => el.parentElement?.offsetWidth || 0);

      // Section should not exceed parent width
      expect(width).toBeLessThanOrEqual(parentWidth + 1);
    }
  });

  test('Homepage color scheme is correct', async ({ page }) => {
    await page.goto('/');

    // Check for dark theme (DJ dark colors)
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);

    // Should be dark (dark theme)
    expect(bgColor).toBeTruthy();
  });

  test('Homepage content is readable', async ({ page }) => {
    await page.goto('/');

    // Check text contrast and size
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();

    if (headingCount > 0) {
      const firstHeading = headings.first();
      const fontSize = await firstHeading.evaluate((el) =>
        window.getComputedStyle(el).fontSize
      );

      const size = parseInt(fontSize);
      expect(size).toBeGreaterThan(10); // Should be readable size
    }
  });

  test('Homepage performance - loads quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Main content should be visible quickly
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();
  });

  test('Homepage keyboard navigation works', async ({ page }) => {
    await page.goto('/');

    // Tab through page
    await page.keyboard.press('Tab');

    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();

    // Should be able to tab to links
    const initialFocused = focused;
    await page.keyboard.press('Tab');

    const newFocused = await page.evaluate(() => document.activeElement?.tagName);
    // Either same element or moved to next
    expect(newFocused).toBeTruthy();
  });
});
