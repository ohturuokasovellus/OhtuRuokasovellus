import { test, expect } from '@playwright/test';
import {
    sql, insertUser,
    insertRestaurant,
    updateUserRestaurantByEmail
} from '../backend/database';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;

    const restaurant = 'testaurant';
    const user = 'test';
    const password = hash('Test123!');
    const email = 'test@test.com';
    const birthYear = '2000';
    const gender = 'other';
    const education = 'primary';
    const income = 'below 1500';
    await insertUser(user, password, email, birthYear,
        gender, education, income
    );
    const restaurantId = await insertRestaurant(restaurant);

    await updateUserRestaurantByEmail('test@test.com', restaurantId);
};

test.describe('menu qr page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
        await page.locator('#language-toggle').click();
        await page.locator('#username-input').fill('test');
        await page.locator('#password-input').fill('Test123!');
        await page.locator('#login-button').click();
        await page.waitForURL('/');
    });

    test('displays restaurant menu QR code correctly',
        async ({ page }) => {
            await expect(page.locator('#root'))
                .toContainText('Welcome, test');
            await expect(page.locator('#root'))
                .toContainText('You are logged in as a restaurant user');
            await page.locator('#restaurant-menu-button').click();
            await expect(page.locator('#QR-code')).toBeVisible();
        });
});
