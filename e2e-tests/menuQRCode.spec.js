import { test, expect } from '@playwright/test';
import {
    sql, insertUser,
    insertRestaurant,
} from '../backend/database';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;

    await insertRestaurant('testaurant');

    const users = [
        {
            username: 'test',
            password: 'Test123!',
            email: 'test@test.com',
            restaurantId: 1
        }
    ];

    for (const user of users) {
        const password = hash(user.password);
        await insertUser(user.username, password, 
            user.email, user.restaurantId);
    }
};

test.describe('menu qr page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/');
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
