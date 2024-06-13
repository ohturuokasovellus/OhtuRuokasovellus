import { sql, insertUser } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    const user = 'testi';
    const password = hash('Testi123!');
    const email = 'test@test.com';
    await insertUser(user, password, email);
};

const createRestaurantUser = async () => {
    const user = 'testaurante';
    const password = hash('Testaurante123!');
    const email = 'testaurante@test.com';
    await insertUser(user, password, email, 1);
};

test.describe('navbar', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/');
        await page.locator('#language-toggle').click();
    });

    test('navbar login button keeps user in login page', async ({ page }) => {
        await page.locator('#navigation-login').click();
        await expect(page).toHaveURL(/\/login$/);
    });

    test('navbar register button takes to register', async ({ page }) => {
        await page.locator('#navigation-register').click();
        await expect(page).toHaveURL(/\/register$/);
    });
    
    test('logged in user can use navbar home button', async ({ page }) => {
        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[id="username-input"]', 'testi');
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();
        await page.waitForURL('/');
        await page.locator('#history-button').click();
        await expect(page).toHaveURL('/history');
        await page.locator('#navigation-home').click();
        await expect(page).toHaveURL('/');
    });

    test('logged restaurant user use navbar create meal', async ({ page }) => {
        await createRestaurantUser();
        
        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[id="username-input"]', 'testaurante');
        await page.fill('input[id="password-input"]', 'Testaurante123!');
        await page.locator('#login-button').click();
        await page.waitForURL('/');
        await page.locator('#navigation-add-meal').click();
        await expect(page).toHaveURL('/create-meal');
    });
});
