/* eslint-disable @stylistic/js/indent */
import { sql, insertUser } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    const user = 'testi';
    // eslint-disable-next-line id-length
    const pw = hash('Testi123@');
    const email = 'testi@test.com';
    await insertUser(user, pw, email);
};

test.describe('login page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
    });

    test('logins succesfully with correct credentials', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[placeholder="Username"]', 'testi');
        await page.fill('input[placeholder="Password"]', 'Testi123@');
        await page.locator('#log_user_in_button').click();
        await expect(page).toHaveURL('/');
    });

    test('does not login with incorrect credentials', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[placeholder="Username"]', 'Testi');
        await page.fill('input[placeholder="Password"]', 'Testi123!!!');
        await page.locator('#log_user_in_button').click();
        await expect(page).toHaveURL('/login');
    });


    test('redirects to registration page', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login$/);
        await page.click('text=register');
        await expect(page).toHaveURL('/register');
    });

    test('warns if password is missing', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[placeholder="Username"]', 'testi');
        await page.locator('#log_user_in_button').click();
        await page.waitForSelector('text="Password is required"');
    });

    test('warns if username is missing', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[placeholder="Password"]', 'Testi123@');
        await page.locator('#log_user_in_button').click();
        await page.waitForSelector('text="Username is required"');
    });

    test(
        'redirects to login page after pressing logout button',
        async ({page}) => {
        await page.goto('/');
        await page.fill('input[placeholder="Username"]', 'testi');
        await page.fill('input[placeholder="Password"]', 'Testi123@');
        await page.locator('#log_user_in_button').click();
        await page.click('text=Logout');
        await expect(page).toHaveURL('/login');
    });
});
