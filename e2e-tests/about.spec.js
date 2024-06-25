/* eslint-disable @stylistic/js/indent */
import { test, expect } from '@playwright/test';

test.describe('about page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.locator('#language-toggle').click();
    });

    test('about page is displayed correctly',
        async ({ page }) => {
            await expect(page.locator('#root'))
                .toContainText('With this application you can track');
            await expect(page.locator('#login-link'))
                .toBeVisible();
            await expect(page.locator('#register-link'))
                .toBeVisible();
        });
});