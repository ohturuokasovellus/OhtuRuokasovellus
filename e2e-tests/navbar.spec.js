import { sql, insertUser } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    const user = 'test';
    const password = hash('Test123!');
    const email = 'test@test.com';
    insertUser(user, password, email);
};

test.describe('registration page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/');
    });

    test('navbar login button keeps user in login page', async ({ page }) => {
        await page.locator('#navbar_login_button').click();
        await expect(page).toHaveURL(/\/login$/);
    });

    test('navbar register button takes to register', async ({ page }) => {
        await page.locator('#navbar_register_button').click();
        await expect(page).toHaveURL(/\/register$/);
    });
});
