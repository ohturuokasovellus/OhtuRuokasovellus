import { test, expect } from '@playwright/test';

test('user can be redirected to login page if already registered', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('link', { name: 'login' }).click();
    await expect(page).toHaveURL(/\/login$/)
});

test('user can register with correct details', async ({ page }) => {
    await page.goto('/register')
});

test('user cannot register with a duplicate username', async ({ page }) => {
    await page.goto('/register')
});

test('user cannot register without a username', async ({ page }) => {
    await page.goto('/register')
});

test('user cannot register with a duplicate email', async ({ page }) => {
    await page.goto('/register')
});

test('user cannot register with an invalid email', async ({ page }) => {
    await page.goto('/register')
});

test('user cannot register without an email', async ({ page }) => {
    await page.goto('/register')
});

test('user cannot register with an invalid password', async ({ page }) => {
    await page.goto('/register')
});

test('user cannot register if the passwords do not match', async ({ page }) => {
    await page.goto('/register')
});
