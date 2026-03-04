import { chromium, devices } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const URL = 'https://owmora.com/en/';
const OUT_DIR = path.resolve(process.cwd(), 'playwright-artifacts', 'mobile-projects');

function safeFile(s) {
  return s.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const device = devices['iPhone 12'];
  if (!device) throw new Error('Playwright device preset not found: iPhone 12');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...device,
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
  });

  const page = await context.newPage();

  const logs = [];
  page.on('console', (msg) => logs.push(`[console.${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => logs.push(`[pageerror] ${err?.message ?? String(err)}`));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Scroll to Projects section
  await page.locator('section#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT_DIR, '01-projects-section.png'), fullPage: false });

  const projectsSection = page.locator('section#projects');
  const cards = projectsSection.locator('button:has(h3)');
  const cardCount = await cards.count();
  if (cardCount < 2) throw new Error(`Expected at least 2 project cards, found ${cardCount}`);

  async function openCardAt(index, label) {
    const card = cards.nth(index);
    const title = (await card.locator('h3').first().innerText()).trim();

    const beforeScrollY = await page.evaluate(() => window.scrollY);
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);

    await card.click();
    const modal = page.locator('div.fixed.inset-0').first();
    await modal.waitFor({ state: 'visible', timeout: 5000 });
    // Wait for the slide-up animation to finish on mobile.
    await page.waitForTimeout(700);

    const afterOpenScrollY = await page.evaluate(() => window.scrollY);

    // Try to scroll the background while modal is open.
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(200);
    const afterWheelScrollY = await page.evaluate(() => window.scrollY);

    await page.screenshot({
      path: path.join(OUT_DIR, `02-open-${label}-${safeFile(title)}.png`),
      fullPage: false,
    });

    // Try to scroll inside the modal sheet.
    const mobileSheet = page.locator('div.sm\\:hidden').filter({ has: page.getByRole('heading', { level: 3 }) }).first();
    const sheetScroll = await mobileSheet.evaluate((el) => {
      if (!(el instanceof HTMLElement)) return null;
      const before = el.scrollTop;
      el.scrollTop = before + 600;
      return { before, after: el.scrollTop, max: el.scrollHeight - el.clientHeight };
    }).catch(() => null);

    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(OUT_DIR, `02b-open-scrolled-${label}-${safeFile(title)}.png`),
      fullPage: false,
    });

    // Close by tapping backdrop near top-left.
    await page.mouse.click(10, 10);
    const backdropCloseWorked = await modal
      .waitFor({ state: 'hidden', timeout: 2000 })
      .then(() => true)
      .catch(() => false);

    if (!backdropCloseWorked) {
      // If backdrop tap doesn't close (or animation never completes), close via the X button.
      const closeX = modal.locator('button').filter({ has: page.locator('svg') }).first();
      await closeX.click({ timeout: 2000 }).catch(() => {});
      await modal.waitFor({ state: 'hidden', timeout: 4000 }).catch(() => {});
    }

    const afterCloseScrollY = await page.evaluate(() => window.scrollY);
    await page.screenshot({
      path: path.join(OUT_DIR, `03-closed-${label}-${safeFile(title)}.png`),
      fullPage: false,
    });

    return {
      title,
      scrollY: { beforeScrollY, afterOpenScrollY, afterWheelScrollY, afterCloseScrollY },
      sheetScroll,
      backdropCloseWorked,
    };
  }

  const first = await openCardAt(0, 'first');
  const second = await openCardAt(1, 'second');

  fs.writeFileSync(
    path.join(OUT_DIR, 'results.json'),
    JSON.stringify({ url: URL, first, second, logs }, null, 2)
  );

  await browser.close();
  console.log(`Saved screenshots + results to: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

