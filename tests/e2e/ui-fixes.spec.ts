// tests/e2e/ui-fixes.spec.ts
import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/** Active le thème clair via le dropdown Protocol */
async function enableLightTheme(page: import('@playwright/test').Page) {
    // Open dropdown
    await page.click('[data-testid="protocol-trigger"]');
    await page.waitForSelector('[data-testid="protocol-panel"]');
    // Select light theme
    await page.click('[data-testid="theme-light"]');
    await page.waitForTimeout(300);
    // Close by clicking outside
    await page.click('body', { position: { x: 10, y: 10 }, force: true });
    await page.waitForTimeout(200);
}

/** Active le thème sombre via le dropdown Protocol */
async function enableDarkTheme(page: import('@playwright/test').Page) {
    await page.click('[data-testid="protocol-trigger"]');
    await page.waitForSelector('[data-testid="protocol-panel"]');
    await page.click('[data-testid="theme-dark"]');
    await page.waitForTimeout(300);
    await page.click('body', { position: { x: 10, y: 10 }, force: true });
    await page.waitForTimeout(200);
}

// ─────────────────────────────────────────────────────────────
// BLOC 1 — NAVBAR : LAYOUT 3 COLONNES
// ─────────────────────────────────────────────────────────────

test.describe('FIX-1 :: Navbar — Layout 3 colonnes sans chevauchement', () => {

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(BASE);
        await page.waitForSelector('[data-testid="navbar-desktop"]');
    });

    test('Logo, nav centrale et actions droites sont présents', async ({ page }) => {
        await expect(page.locator('[data-testid="navbar-logo"]')).toBeVisible();
        await expect(page.locator('[data-testid="navbar-nav"]')).toBeVisible();
        await expect(page.locator('[data-testid="navbar-actions"]')).toBeVisible();
    });

    test('Le logo est à gauche de la nav centrale', async ({ page }) => {
        const logo = await page.locator('[data-testid="navbar-logo"]').boundingBox();
        const nav = await page.locator('[data-testid="navbar-nav"]').boundingBox();
        expect(logo).not.toBeNull();
        expect(nav).not.toBeNull();
        // Logo right edge must be before nav left edge
        expect(logo!.x + logo!.width).toBeLessThanOrEqual(nav!.x + 5); // 5px tolerance
    });

    test('La nav centrale est à gauche des actions droites', async ({ page }) => {
        const nav = await page.locator('[data-testid="navbar-nav"]').boundingBox();
        const actions = await page.locator('[data-testid="navbar-actions"]').boundingBox();
        expect(nav).not.toBeNull();
        expect(actions).not.toBeNull();
        // Nav right edge before actions left edge
        expect(nav!.x + nav!.width).toBeLessThanOrEqual(actions!.x + 5);
    });

    test('Aucun chevauchement entre nav et actions', async ({ page }) => {
        const nav = await page.locator('[data-testid="navbar-nav"]').boundingBox();
        const actions = await page.locator('[data-testid="navbar-actions"]').boundingBox();
        expect(nav).not.toBeNull();
        expect(actions).not.toBeNull();
        const navRight = nav!.x + nav!.width;
        const actionsLeft = actions!.x;
        // No horizontal overlap
        expect(navRight).toBeLessThanOrEqual(actionsLeft + 2);
    });

    test('Protocol dropdown panel is positioned correctly', async ({ page }) => {
        await page.click('[data-testid="protocol-trigger"]');
        await page.waitForSelector('[data-testid="protocol-panel"]');

        const panel = await page.locator('[data-testid="protocol-panel"]').boundingBox();
        expect(panel).not.toBeNull();
        // Panel should be within viewport width
        const viewport = page.viewportSize()!;
        expect(panel!.x + panel!.width).toBeLessThanOrEqual(viewport.width + 5);
        expect(panel!.x).toBeGreaterThanOrEqual(0);
    });

    test('Le CTA audit est visible et accessible', async ({ page }) => {
        const actions = page.locator('[data-testid="navbar-actions"]');
        await expect(actions).toBeVisible();
        // Verify the CTA link exists within actions
        const cta = actions.locator('a').last();
        await expect(cta).toBeVisible();
    });
});

// ─────────────────────────────────────────────────────────────
// BLOC 2 — PROTOCOL DROPDOWN : CONTRASTE THÈME CLAIR
// ─────────────────────────────────────────────────────────────

test.describe('FIX-2 :: Protocol — Contraste et thème adaptatif', () => {

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(BASE);
        await page.waitForSelector('[data-testid="protocol-trigger"]');
    });

    test('Le trigger Protocol est visible et contient le texte PROTOCOL', async ({ page }) => {
        // Scope to desktop actions to avoid picking up mobile duplicate
        const trigger = page.locator('[data-testid="navbar-actions"] [data-testid="protocol-trigger"]');
        await expect(trigger).toBeVisible({ timeout: 10000 });
        await expect(trigger).toContainText('PROTOCOL');
    });

    test('Le panel Protocol a un fond visible en thème clair', async ({ page }) => {
        await enableLightTheme(page);
        // Re-open the dropdown
        await page.click('[data-testid="protocol-trigger"]');
        await page.waitForSelector('[data-testid="protocol-panel"]');

        const panel = page.locator('[data-testid="protocol-panel"]');
        const bg = await panel.evaluate(el =>
            window.getComputedStyle(el).backgroundColor
        );
        // In light theme, background should NOT be the dark panel color rgb(0, 5, 16)
        expect(bg).not.toBe('rgb(0, 5, 16)');
    });

    test('Les boutons de langue sont visibles et cliquables en light mode', async ({ page }) => {
        await enableLightTheme(page);
        await page.click('[data-testid="protocol-trigger"]');
        await page.waitForSelector('[data-testid="protocol-panel"]');

        const langBtns = page.locator('[data-testid="language-options"] button');
        const count = await langBtns.count();
        expect(count).toBe(2);
        for (let i = 0; i < count; i++) {
            await expect(langBtns.nth(i)).toBeVisible();
        }
    });

    test('Les boutons de thème sont visibles en thème clair', async ({ page }) => {
        await enableLightTheme(page);
        await page.click('[data-testid="protocol-trigger"]');
        await page.waitForSelector('[data-testid="protocol-panel"]');

        const themeOptions = page.locator('[data-testid="theme-options"] button');
        const count = await themeOptions.count();
        expect(count).toBe(3);
        for (let i = 0; i < count; i++) {
            await expect(themeOptions.nth(i)).toBeVisible();
        }
    });

    test('Le ThemeProvider persiste le thème après rechargement', async ({ page }) => {
        await enableLightTheme(page);
        await expect(page.locator('html')).not.toHaveClass(/dark/);
        await page.reload();
        await page.waitForSelector('[data-testid="protocol-trigger"]');
        await expect(page.locator('html')).not.toHaveClass(/dark/);
    });

    test('Le changement de langue fonctionne via le panel', async ({ page }) => {
        await page.click('[data-testid="protocol-trigger"]');
        await page.waitForSelector('[data-testid="protocol-panel"]');
        await page.click('[data-testid="lang-en"]');
        await page.waitForTimeout(200);
        const enBtn = page.locator('[data-testid="lang-en"]');
        await expect(enBtn).toHaveAttribute('aria-pressed', 'true');
    });

    test('Reset Preferences réinitialise au thème système et langue fr', async ({ page }) => {
        await enableLightTheme(page);
        // Re-open and switch language
        await page.click('[data-testid="protocol-trigger"]');
        await page.waitForSelector('[data-testid="protocol-panel"]');
        await page.click('[data-testid="lang-en"]');
        await page.waitForTimeout(100);
        // Click reset
        await page.click('[data-testid="reset-preferences"]');
        await page.waitForTimeout(300);
        // Check localStorage
        const locale = await page.evaluate(() => localStorage.getItem('analytica_locale'));
        const theme = await page.evaluate(() => localStorage.getItem('analytica_theme'));
        expect(locale).toBe('fr');
        expect(theme).toBeNull();
    });
});

// ─────────────────────────────────────────────────────────────
// BLOC 3 — SOLUTIONS : SCROLL HORIZONTAL SYNCHRONISÉ
// ─────────────────────────────────────────────────────────────

test.describe('FIX-3 :: Solutions — Scroll horizontal synchronisé', () => {

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(`${BASE}/solutions`);
        await page.waitForSelector('[data-testid="solutions-scroll-container"]', { timeout: 15000 });
        await page.waitForSelector('[data-testid="solutions-horizontal-track"]');
        await page.waitForTimeout(500);
    });

    test('La section sticky est présente et a une hauteur > 100vh', async ({ page }) => {
        const container = await page.locator('[data-testid="solutions-scroll-container"]').boundingBox();
        const viewport = page.viewportSize();
        expect(container).not.toBeNull();
        expect(container!.height).toBeGreaterThan(viewport!.height * 2);
    });

    test("L'intro card existe dans le DOM et est dimensionné", async ({ page }) => {
        const introCard = page.locator('[data-testid="solutions-intro-card"]');
        await expect(introCard).toBeAttached();
        const box = await introCard.boundingBox();
        expect(box).not.toBeNull();
        // Card dimensions must be reasonable
        expect(box!.width).toBeGreaterThan(100);
        expect(box!.height).toBeGreaterThan(50);
    });

    test('Le scroll horizontal se déclenche dans la zone sticky', async ({ page }) => {
        const containerTop = await page.locator('[data-testid="solutions-scroll-container"]').evaluate(
            el => el.getBoundingClientRect().top + window.scrollY
        );
        const containerHeight = await page.locator('[data-testid="solutions-scroll-container"]').evaluate(
            el => (el as HTMLElement).offsetHeight
        );
        const viewport = page.viewportSize()!;

        // Scroll to the start of the container (track should be at initial position)
        await page.evaluate((top) => window.scrollTo(0, top), containerTop);
        await page.waitForTimeout(300);

        const xAtStart = await page.locator('[data-testid="solutions-horizontal-track"]').evaluate(
            el => el.getBoundingClientRect().x
        );

        // Scroll to middle of the container (track should have moved left)
        const midScroll = containerTop + (containerHeight - viewport.height) / 2;
        await page.evaluate((top) => window.scrollTo(0, top), midScroll);
        await page.waitForTimeout(300);

        const xAtMid = await page.locator('[data-testid="solutions-horizontal-track"]').evaluate(
            el => el.getBoundingClientRect().x
        );

        // The track should have moved left (more negative x)
        expect(xAtMid).toBeLessThan(xAtStart);
    });

    test('Chaque solution card est atteignable durant le scroll', async ({ page }) => {
        const cards = await page.locator('[data-testid^="solution-card-"]').all();
        if (cards.length === 0) return;

        const containerTop = await page.locator('[data-testid="solutions-scroll-container"]').evaluate(
            el => el.getBoundingClientRect().top + window.scrollY
        );
        const containerHeight = await page.locator('[data-testid="solutions-scroll-container"]').evaluate(
            el => (el as HTMLElement).offsetHeight
        );
        const viewport = page.viewportSize()!;
        const scrollRange = containerHeight - viewport.height;
        const totalSlots = cards.length + 2; // intro + cards + CTA

        for (let i = 0; i < cards.length; i++) {
            const progress = (i + 1) / totalSlots;
            const scrollY = containerTop + progress * scrollRange;
            await page.evaluate((y) => window.scrollTo(0, y), scrollY);
            await page.waitForTimeout(400);

            const card = cards[i];
            const cardBox = await card.boundingBox();
            // Card should exist somewhere (even partially offscreen is fine, but it should be rendered)
            expect(cardBox).not.toBeNull();
        }
    });

    test('Après le scroll horizontal, le scroll vertical reprend', async ({ page }) => {
        const containerBottom = await page.locator('[data-testid="solutions-scroll-container"]').evaluate(
            el => el.getBoundingClientRect().bottom + window.scrollY
        );
        const viewport = page.viewportSize()!;
        const endScroll = containerBottom - viewport.height;

        await page.evaluate((y) => window.scrollTo(0, y), endScroll);
        await page.waitForTimeout(300);

        const stickyTop = await page.locator('[data-testid="solutions-sticky-viewport"]').evaluate(
            el => el.getBoundingClientRect().top
        );
        expect(stickyTop).toBeLessThanOrEqual(0);
    });
});

// ─────────────────────────────────────────────────────────────
// BLOC 4 — RÉGRESSION
// ─────────────────────────────────────────────────────────────

test.describe('REGRESSION :: Vérifications post-fix globales', () => {

    test('La navigation fonctionne encore sur toutes les pages', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const routes = ['/', '/services', '/solutions', '/about', '/contact'];
        for (const route of routes) {
            await page.goto(`${BASE}${route}`);
            await expect(page.locator('[data-testid="navbar-desktop"]')).toBeVisible();
        }
    });

    test('Le menu mobile reste fonctionnel', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto(BASE);
        await page.waitForTimeout(500);
        // Target the mobile hamburger menu button (contains Menu or X icon)
        const menuBtn = page.locator('.xl\\:hidden button').last();
        await expect(menuBtn).toBeVisible({ timeout: 5000 });
        await menuBtn.click();
        await page.waitForTimeout(500);
        await expect(page.locator('a[href="/services"]').last()).toBeVisible();
    });

    test('Aucune erreur console critique sur les pages', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        const pages = ['/', '/solutions', '/services'];
        for (const p of pages) {
            await page.goto(`${BASE}${p}`);
            await page.waitForTimeout(1500);
        }
        // Filter out known non-critical errors
        const criticalErrors = errors.filter(e =>
            !e.includes('net::ERR') &&
            !e.includes('favicon') &&
            !e.includes('supabase') &&
            !e.includes('Failed to load resource') &&
            !e.includes('WebGL') &&
            !e.includes('ImmersiveBackground') &&
            !e.includes('ErrorBoundary') &&
            !e.includes('Error creating WebGL context') &&
            !e.includes('recreate this component tree') &&
            !e.includes('Content Security Policy') &&
            !e.includes('posthog') &&
            !e.includes('cloudflare') &&
            !e.includes('inline event handler') &&
            !e.includes('frame-ancestors') &&
            !e.includes('Refused to connect')
        );
        expect(criticalErrors).toHaveLength(0);
    });
});
