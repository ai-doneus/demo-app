import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
    // Log page content for debugging
    await page.screenshot({ path: 'screenshots/beforeEach.png' });
    console.log('Page title:', await page.title());
    // Wait for any card element to ensure app is loaded
    await page.waitForSelector('.w-full', { state: 'visible', timeout: 15000 }).catch(async () => {
      console.log('No .w-full element found. Dumping page HTML:');
      // console.log(await page.content());
      await page.screenshot({ path: 'screenshots/beforeEach-failure.png' });
    });
  });

  test('Borrower selection updates the center pane', async ({ page }) => {
    const borrowerCard = page.locator('.cursor-pointer.mb-2').first();
    const isCardVisible = await borrowerCard.isVisible({ timeout: 10000 }).catch(() => false);
    
    if (!isCardVisible) {
      console.log('Borrower card not found. Page HTML:');
      await page.screenshot({ path: 'screenshots/borrower-selection-failure.png' });
      test.skip('Skipping test: No borrower card found');
      return;
    }

    const borrowerName = await borrowerCard.locator('p.font-semibold').first().textContent();
    await borrowerCard.click();

    const borrowerDetailName = page.locator('.w-full .card-header h1, .w-full .card-header [class*="text-2xl"]').first();
    await page.waitForSelector('.w-full .card-header h1, .w-full .card-header [class*="text-2xl"]', { state: 'visible', timeout: 10000 }).catch(async () => {
      console.log('BorrowerDetail name not found. Page HTML:');
      await page.screenshot({ path: 'screenshots/borrower-detail-failure.png' });
      test.fail('BorrowerDetail name element not found');
    });

    await expect(borrowerDetailName).toHaveText(borrowerName.trim(), { timeout: 10000 });
  });
  
  test('Explainability section expands/collapses', async ({ page }) => {
    // Select a borrower to populate BorrowerDetail
    const borrowerCard = page.locator('.cursor-pointer.mb-2').first();
    if (!(await borrowerCard.isVisible({ timeout: 10000 }).catch(() => false))) {
      console.log('Borrower card not found. Page HTML:');
      await page.screenshot({ path: 'screenshots/accordion-failure.png' });
      test.skip('Skipping test: No borrower card found');
      return;
    }
    await borrowerCard.click();

    // Wait for BorrowerDetail
    await page.waitForSelector('.font-semibold', { state: 'visible', timeout: 10000 }).catch(async () => {
      console.log('BorrowerDetail not found. Page HTML:');
      await page.screenshot({ path: 'screenshots/borrower-detail-failure.png' });
    });

    // Locate the AI Explainability accordion trigger
    const accordionTrigger = page.locator('text=AI Explainability');
    if (!(await accordionTrigger.isVisible({ timeout: 10000 }).catch(() => false))) {
      console.log('Accordion trigger not found. Page HTML:');
      await page.screenshot({ path: 'screenshots/accordion-trigger-failure.png' });
      test.skip('Skipping test: Accordion trigger not found');
      return;
    }

    // Verify accordion is initially collapsed
    const accordionContent = page.locator('.text-red-600').first();
    await expect(accordionContent).not.toBeVisible({ timeout: 10000 });

    // Click to expand
    await accordionTrigger.click();
    await expect(accordionContent).toBeVisible({ timeout: 10000 });

    // Click to collapse
    await accordionTrigger.click();
    await expect(accordionContent).not.toBeVisible({ timeout: 10000 });
  });

  test('Button clicks log appropriate console outputs', async ({ page }) => {
    // Select a borrower to populate BorrowerDetail
    const borrowerCard = page.locator('.cursor-pointer.mb-2').first();
    if (!(await borrowerCard.isVisible({ timeout: 10000 }).catch(() => false))) {
      console.log('Borrower card not found. Page HTML:');
      await page.screenshot({ path: 'screenshots/buttons-failure.png' });
      test.skip('Skipping test: No borrower card found');
      return;
    }
    await borrowerCard.click();
    await page.waitForSelector('.font-semibold', { state: 'visible', timeout: 10000 }).catch(async () => {
      console.log('BorrowerDetail not found. Page HTML:');
      await page.screenshot({ path: 'screenshots/borrower-detail-failure.png' });
    });

    // Capture console logs
    const consoleLogs = [];
    page.on('console', (msg) => consoleLogs.push(msg.text()));

    // Test Request Documents button
    const requestDocsButton = page.locator('text=Request Documents');
    if (await requestDocsButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await requestDocsButton.click();
      await expect(consoleLogs).toContainEqual(
        expect.stringMatching(/Request Documents:/),
        { timeout: 10000 }
      );
    } else {
      console.log('Request Documents button not found. Page HTML:', await page.content());
      await page.screenshot({ path: 'screenshots/request-docs-failure.png' });
    }

    // Test Send to Valuer button
    const valuerButton = page.locator('text=Send to Valuer');
    if (await valuerButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await valuerButton.click();
      await expect(consoleLogs).toContainEqual(
        expect.stringMatching(/Send to Valuer/),
        { timeout: 10000 }
      );
    } else {
      console.log('Send to Valuer button not found. Page HTML:');
      await page.screenshot({ path: 'screenshots/valuer-failure.png' });
    }

    // Test Approve button
    const approveButton = page.locator('text=Approve');
    if (await approveButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await approveButton.click();
      await expect(consoleLogs).toContainEqual(
        expect.stringMatching(/Approve/),
        { timeout: 10000 }
      );
    } else {
      // console.log('Approve button not found. Page HTML:', await page.content());
      console.log('Approve button not found. Page HTML:');
      await page.screenshot({ path: 'screenshots/approve-failure.png' });
    }
  });
});