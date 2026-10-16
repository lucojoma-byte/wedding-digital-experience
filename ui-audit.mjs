import { chromium } from 'playwright';

const baseUrl = process.env.UI_AUDIT_URL || 'http://127.0.0.1:4175/';
const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'desktop-1440', width: 1440, height: 960 },
];

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
});
const results = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `artifacts/ui-audit-${viewport.name}-cover.png`, fullPage: true });

    const openButton = page.locator('#open-invitation, #openInvitation');
    await openButton.click();
    await page.locator('#invitation').waitFor({ state: 'visible' });
    await page.screenshot({ path: `artifacts/ui-audit-${viewport.name}-invitation.png`, fullPage: true });

    const audit = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const overflow = [...document.querySelectorAll('body *')]
        .map(node => {
          const rect = node.getBoundingClientRect();
          return { tag: node.tagName, id: node.id || null, className: typeof node.className === 'string' ? node.className : '', left: rect.left, right: rect.right };
        })
        .filter(item => item.left < -1 || item.right > window.innerWidth + 1)
        .slice(0, 20);
      const clippedText = [...document.querySelectorAll('body *')]
        .filter(node => {
          const style = getComputedStyle(node);
          if (style.position === 'absolute' || style.position === 'fixed' || node.classList.contains('sr-only')) return false;
          return node.children.length === 0 && style.overflow !== 'visible' && node.scrollWidth > node.clientWidth + 1 && node.textContent.trim().length > 0;
        })
        .map(node => ({ tag: node.tagName, id: node.id || null, className: typeof node.className === 'string' ? node.className : '', text: node.textContent.trim().slice(0, 80) }))
        .slice(0, 20);
      return {
        documentWidth: doc.scrollWidth,
        bodyWidth: body.scrollWidth,
        viewportWidth: window.innerWidth,
        overflow,
        clippedText,
      };
    });

    results.push({ viewport: viewport.name, ...audit, consoleErrors, pageErrors });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
const failures = results.filter(result =>
  result.documentWidth > result.viewportWidth + 1 ||
  result.bodyWidth > result.viewportWidth + 1 ||
  result.overflow.length ||
  result.clippedText.length ||
  result.consoleErrors.length ||
  result.pageErrors.length
);
if (failures.length) process.exitCode = 1;
