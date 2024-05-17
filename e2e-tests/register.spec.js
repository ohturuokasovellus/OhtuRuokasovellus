import { test, expect } from '@playwright/test';

test('user can be redirected to login page if already registered', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('link', { name: 'login' }).click();
    await expect(page).toHaveURL(/\/login$/)
});