/* eslint-disable @stylistic/js/indent */
import { sql, insertUser } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    const user = 'testi';
    const password = hash('Testi123!');
    const email = 'test@test.com';
    const birthYear = '2000';
    const gender = 'other';
    const education = 'primary';
    const income = 'below 1500';
    insertUser(user, password, email, birthYear,
        gender, education, income
    );
};

test.describe('login page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
        await page.locator('#language-toggle').click();
    });

    test('logins succesfully with correct credentials', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[id="username-input"]', 'testi');
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL('/');
    });

    test('does not login with incorrect credentials', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[id="username-input"]', 'testi');
        await page.fill('input[id="password-input"]', 'Testi123!!!');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL('/login');
    });


    test('redirects to registration page', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login$/);
        await page.locator('#register-link').click();
        await expect(page).toHaveURL('/register');
    });

    test('warns if password is missing', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[id="username-input"]', 'testi');
        await page.locator('#login-button').click();
        await page.waitForSelector('text="Password is required"');
    });

    test('warns if username is missing', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();
        await page.waitForSelector('text="Username is required"');
    });

    test(
        'redirects to login page after pressing logout button',
        async ({page}) => {
        await page.goto('/');
        await page.fill('input[id="username-input"]', 'testi');
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();
        await page.locator('#navigation-logout').click();
        await expect(page).toHaveURL('/login');
    });
});
