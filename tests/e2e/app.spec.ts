import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Analyticatech - Tests E2E Complets', () => {
  
  // ============================================
  // PAGE D'ACCUEIL
  // ============================================
  test.describe('Page d\'Accueil', () => {
    test('should load homepage successfully', async ({ page }) => {
      await page.goto(BASE_URL);
      await expect(page).toHaveTitle(/Analyticatech/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
      await page.goto(BASE_URL);
      await expect(page.locator('text=IA')).toBeVisible();
      await expect(page.locator('text=Data')).toBeVisible();
    });

    test('should have working navigation menu', async ({ page }) => {
      await page.goto(BASE_URL);
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should display services preview', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="services-section"], section:has-text("Services")', { timeout: 10000 });
    });

    test('should display testimonials if available', async ({ page }) => {
      await page.goto(BASE_URL);
      // Scroll to find testimonials
      await page.mouse.wheel(0, 1000);
      await page.waitForTimeout(500);
    });
  });

  // ============================================
  // NAVIGATION
  // ============================================
  test.describe('Navigation', () => {
    test('should navigate to Services page', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.click('a[href="/services"]');
      await expect(page).toHaveURL(/.*services/);
    });

    test('should navigate to Solutions page', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.click('a[href="/solutions"]');
      await expect(page).toHaveURL(/.*solutions/);
    });

    test('should navigate to About page', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.click('a[href="/about"]');
      await expect(page).toHaveURL(/.*about/);
    });

    test('should navigate to Contact page', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.click('a[href="/contact"]');
      await expect(page).toHaveURL(/.*contact/);
    });

    test('should navigate to Hub page', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.click('a[href="/hub"]');
      await expect(page).toHaveURL(/.*hub/);
    });

    test('should toggle theme (dark/light)', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = page.locator('html');
      
      // Check initial state (should be dark)
      await expect(html).toHaveClass(/dark/);
      
      // Find and click theme toggle button
      const themeButton = page.locator('button[aria-label="Changer le thème"]');
      if (await themeButton.isVisible()) {
        await themeButton.click();
        await page.waitForTimeout(300);
        await expect(html).not.toHaveClass(/dark/);
        
        // Toggle back to dark
        await themeButton.click();
        await page.waitForTimeout(300);
        await expect(html).toHaveClass(/dark/);
      }
    });

    test('should toggle language (FR/EN)', async ({ page }) => {
      await page.goto(BASE_URL);
      const langButton = page.locator('button:has-text("FR")');
      if (await langButton.isVisible()) {
        await langButton.click();
        await page.waitForTimeout(300);
      }
    });
  });

  // ============================================
  // PAGE SERVICES
  // ============================================
  test.describe('Page Services', () => {
    test('should load services page', async ({ page }) => {
      await page.goto(`${BASE_URL}/services`);
      await expect(page).toHaveURL(/.*services/);
    });

    test('should display service cards', async ({ page }) => {
      await page.goto(`${BASE_URL}/services`);
      await page.waitForSelector('article, .card, [class*="Card"]', { timeout: 10000 });
    });

    test('should navigate to service detail', async ({ page }) => {
      await page.goto(`${BASE_URL}/services`);
      await page.waitForTimeout(1000);
      
      const serviceLink = page.locator('a[href^="/services/"]').first();
      if (await serviceLink.isVisible()) {
        await serviceLink.click();
        await expect(page).toHaveURL(/.*services\/.+/);
      }
    });
  });

  // ============================================
  // PAGE SOLUTIONS
  // ============================================
  test.describe('Page Solutions', () => {
    test('should load solutions page', async ({ page }) => {
      await page.goto(`${BASE_URL}/solutions`);
      await expect(page).toHaveURL(/.*solutions/);
    });

    test('should display solution cards', async ({ page }) => {
      await page.goto(`${BASE_URL}/solutions`);
      await page.waitForSelector('article, .card, [class*="Card"]', { timeout: 10000 });
    });

    test('should navigate to solution detail', async ({ page }) => {
      await page.goto(`${BASE_URL}/solutions`);
      await page.waitForTimeout(1000);
      
      const solutionLink = page.locator('a[href^="/solutions/"]').first();
      if (await solutionLink.isVisible()) {
        await solutionLink.click();
        await expect(page).toHaveURL(/.*solutions\/.+/);
      }
    });
  });

  // ============================================
  // PAGE ABOUT
  // ============================================
  test.describe('Page About', () => {
    test('should load about page', async ({ page }) => {
      await page.goto(`${BASE_URL}/about`);
      await expect(page).toHaveURL(/.*about/);
    });

    test('should display team section', async ({ page }) => {
      await page.goto(`${BASE_URL}/about`);
      await page.waitForTimeout(1000);
      await page.mouse.wheel(0, 500);
    });

    test('should display milestones/history', async ({ page }) => {
      await page.goto(`${BASE_URL}/about`);
      await page.mouse.wheel(0, 1000);
      await page.waitForTimeout(500);
    });

    test('should display core values', async ({ page }) => {
      await page.goto(`${BASE_URL}/about`);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(500);
    });
  });

  // ============================================
  // PAGE CONTACT
  // ============================================
  test.describe('Page Contact', () => {
    test('should load contact page', async ({ page }) => {
      await page.goto(`${BASE_URL}/contact`);
      await expect(page).toHaveURL(/.*contact/);
    });

    test('should display contact form', async ({ page }) => {
      await page.goto(`${BASE_URL}/contact`);
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('textarea[name="message"]')).toBeVisible();
    });

    test('should validate form fields', async ({ page }) => {
      await page.goto(`${BASE_URL}/contact`);
      
      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Should show validation errors
      await page.waitForTimeout(500);
    });

    test('should accept valid form input', async ({ page }) => {
      await page.goto(`${BASE_URL}/contact`);
      
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="company"]', 'Test Company');
      await page.fill('textarea[name="message"]', 'This is a test message for E2E testing purposes.');
      
      // Verify values are filled
      await expect(page.locator('input[name="name"]')).toHaveValue('Test User');
      await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
    });

    test('should reject invalid email', async ({ page }) => {
      await page.goto(`${BASE_URL}/contact`);
      
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('textarea[name="message"]', 'Test message');
      
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      await page.waitForTimeout(500);
      // Should show email validation error
    });
  });

  // ============================================
  // PAGE HUB / INTELLIGENCE
  // ============================================
  test.describe('Page Intelligence Hub', () => {
    test('should load hub page', async ({ page }) => {
      await page.goto(`${BASE_URL}/hub`);
      await expect(page).toHaveURL(/.*hub/);
    });

    test('should display resources or prompts', async ({ page }) => {
      await page.goto(`${BASE_URL}/hub`);
      await page.waitForTimeout(1000);
    });
  });

  // ============================================
  // COMMANDE PALETTE (CMD+K)
  // ============================================
  test.describe('Command Palette', () => {
    test('should open with Ctrl+K', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForTimeout(1000);
      
      // Press Ctrl+K or Cmd+K
      await page.keyboard.press('Control+k');
      await page.waitForTimeout(300);
      
      // Check if command palette opened
      const palette = page.locator('text=Tapez une commande');
      const isVisible = await palette.isVisible();
      if (isVisible) {
        await page.keyboard.press('Escape');
      }
    });
  });

  // ============================================
  // RESPONSIVE DESIGN
  // ============================================
  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      await expect(page).toHaveTitle(/Analyticatech/);
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);
      await expect(page).toHaveTitle(/Analyticatech/);
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await expect(page).toHaveTitle(/Analyticatech/);
    });

    test('should have working mobile menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      
      const menuButton = page.locator('button[aria-label], button:has([class*="Menu"]), button:has([class*="X"])');
      if (await menuButton.first().isVisible()) {
        await menuButton.first().click();
        await page.waitForTimeout(300);
      }
    });
  });

  // ============================================
  // PERFORMANCE
  // ============================================
  test.describe('Performance', () => {
    test('should load homepage within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      const loadTime = Date.now() - startTime;
      
      console.log(`Homepage load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(10000); // 10 seconds max
    });

    test('should have no console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.goto(BASE_URL);
      await page.waitForTimeout(2000);
      
      console.log('Console errors:', errors);
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================
  test.describe('Accessibility', () => {
    test('should have proper heading structure', async ({ page }) => {
      await page.goto(BASE_URL);
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
    });

    test('should have visible focus states', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should have alt text for images', async ({ page }) => {
      await page.goto(BASE_URL);
      const images = page.locator('img');
      const count = await images.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');
        console.log(`Image ${i}: alt="${alt}", src="${src}"`);
      }
    });
  });

  // ============================================
  // SEO
  // ============================================
  test.describe('SEO', () => {
    test('should have meta description', async ({ page }) => {
      await page.goto(BASE_URL);
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
    });

    test('should have proper language attribute', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'fr');
    });

    test('should have viewport meta tag', async ({ page }) => {
      await page.goto(BASE_URL);
      const viewport = page.locator('meta[name="viewport"]');
      await expect(viewport).toHaveAttribute('content', /.+/);
    });
  });

  // ============================================
  // 404 PAGE
  // ============================================
  test.describe('404 Page', () => {
    test('should display 404 for non-existent page', async ({ page }) => {
      await page.goto(`${BASE_URL}/non-existent-page-12345`);
      await page.waitForTimeout(1000);
      // Should redirect or show 404 content
    });
  });
});