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

    test('page elements are displayed correctly', async ({ page }) => {
        //fields
        await expect(page.locator('#username-input')).toBeVisible();
        await expect(page.locator('#password-input')).toBeVisible();

        // registration link
        await page.locator('#register-link').click();
        await expect(page).toHaveURL(/\/register$/);

        // redirects to home if logged in
        await page.goto('/login');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('testi');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Testi123!');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL(/\/$/);
        await page.goto('/register');
        await expect(page).toHaveURL(/\/$/);
    });

    test('logs in succesfully with correct credentials', async ({page}) => {
        await page.fill('input[id="username-input"]', 'testi');
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL('/');
    });

    test('does not log in with incorrect credentials', async ({page}) => {
        // username is missing
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();

        // password is missing
        await page.fill('input[id="password-input"]', '');
        await page.fill('input[id="username-input"]', 'testi');
        await page.locator('#login-button').click();
        await page.waitForSelector('text="Password is required"');

        // incorrect username
        await page.fill('input[id="username-input"]', 'testi2');
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();
        await page.waitForSelector('text="Incorrect username or/and password"');

        // incorrect password
        await page.goto('/login');
        await page.fill('input[id="username-input"]', 'testi');
        await page.fill('input[id="password-input"]', 'Testi1234!');
        await page.locator('#login-button').click();
        await page.waitForSelector('text="Incorrect username or/and password"');
    });

    test(
        'redirects to login after pressing logout button',
        async ({page}) => {
        await page.fill('input[id="username-input"]', 'testi');
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();
        await page.locator('#navigation-logout').click();
        await expect(page).toHaveURL(/\/login$/);
    });
});
