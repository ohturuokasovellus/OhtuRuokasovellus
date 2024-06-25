import { sql, insertUser,
    updateUserRestaurantByEmail } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    const user = 'testi';
    const password = hash('Testi123!');
    const email = 'test@test.com';
    const birthYear = '2000';
    const gender = 'other';
    const education = 'primary';
    const income = 'below 1500';
    await insertUser(user, password, email, birthYear,
        gender, education, income
    );
};

const createRestaurantUser = async () => {
    const user = 'testaurante';
    const password = hash('Testaurante123!');
    const email = 'testaurante@test.com';
    const birthYear = '2000';
    const gender = 'other';
    const education = 'primary';
    const income = 'below 1500';
    await insertUser(user, password, email, birthYear,
        gender, education, income
    );
    await updateUserRestaurantByEmail('testaurante@test.com', 1);
};

test.describe('navbar', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await createRestaurantUser();
        await page.goto('/');
    });

    test('navbar is displayed and redirects users correctly',
        async ({ page }) => {
            await expect(page.locator('#theme-toggle'))
                .toBeVisible();
            await expect(page.locator('#language-toggle'))
                .toContainText('In English');
            await page.locator('#language-toggle').click();
            await expect(page.locator('#language-toggle'))
                .toContainText('Suomeksi');

            // not logged in
            await expect(page.locator('#navigation-add-meal'))
                .not.toBeVisible();
            await expect(page.locator('#navigation-logout'))
                .not.toBeVisible();
            await expect(page.locator('#navigation-home'))
                .not.toBeVisible();
            await page.locator('#navigation-register').click();
            await expect(page).toHaveURL(/\/register$/);
            await page.locator('#navigation-about').click();
            await expect(page).toHaveURL(/\/$/);
            await page.locator('#navigation-login').click();
            await expect(page).toHaveURL(/\/login$/);

            // logged in
            await page.fill('input[id="username-input"]', 'testi');
            await page.fill('input[id="password-input"]', 'Testi123!');
            await page.locator('#login-button').click();
            await page.waitForURL('/home');
            await expect(page.locator('#navigation-add-meal'))
                .not.toBeVisible();
            await expect(page.locator('#navigation-login'))
                .not.toBeVisible();
            await expect(page.locator('#navigation-register'))
                .not.toBeVisible();
            await page.locator('#navigation-home').click();
            await expect(page).toHaveURL(/\/home$/);
            await page.locator('#navigation-logout').click();
            await expect(page).toHaveURL(/\/login$/);

            //logged in as a restaurant
            await page.fill('input[id="username-input"]', 'testaurante');
            await page.fill('input[id="password-input"]', 'Testaurante123!');
            await page.locator('#login-button').click();
            await page.waitForURL('/home');
            await page.locator('#navigation-add-meal').click();
            await expect(page).toHaveURL(/\/create-meal$/);
        });
});
