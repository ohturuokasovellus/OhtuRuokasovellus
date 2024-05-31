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
        },
        {
            username: 'test2',
            password: 'Best456@',
            email: 'test2@test.com',
            restaurantId: null
        }
    ];

    for (const user of users) {
        // eslint-disable-next-line id-length
        const pw = hash(user.password);
        await insertUser(user.username, pw, user.email, user.restaurantId);
    }
};

test.describe('home page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/');
        await page.locator('#english_button').click();
    });

    test('redirects to login if not currently logged in',
        async ({ page }) => {
            await expect(page).toHaveURL(/\/login$/);
        });

    test('displays regular user page correctly',
        async ({ page }) => {
            await page.locator('#username_input').click();
            await page.locator('#username_input').fill('test2');
            await page.locator('#password_input').click();
            await page.locator('#password_input').fill('Best456@');
            await page.locator('#log_user_in_button').click();
            await page.waitForURL('/');
            await expect(page).toHaveURL('/');
            await expect(page.locator('#root'))
                .toContainText('Welcome, test2');
        });

    test('displays restaurant user page correctly',
        async ({ page }) => {
            await page.goto('/login');
            await page.locator('#username_input').click();
            await page.locator('#username_input').fill('test');
            await page.locator('#password_input').click();
            await page.locator('#password_input').fill('Test123!');
            await page.locator('#log_user_in_button').click();
            await page.waitForURL('/');
            await expect(page).toHaveURL('/');
            await expect(page.locator('#root'))
                .toContainText('Welcome, test');
            await expect(page.locator('#root'))
                .toContainText('You are logged-in as a restaurant user');
            await expect(page.getByText('add user')).toBeVisible();
            await expect(page.getByText('restaurant page')).toBeVisible();
        });

    test('restaurant user view navigation works',
        async ({ page }) => {
            await page.goto('/login');
            await page.locator('#username_input').click();
            await page.locator('#username_input').fill('test');
            await page.locator('#password_input').click();
            await page.locator('#password_input').fill('Test123!');
            await page.locator('#log_user_in_button').click();
            await page.waitForURL('/');
            await page.getByText('add user').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await page.getByRole('link', { name: 'back to home' }).click();
            await page.waitForURL('/');
            await page.getByText('restaurant page').click();
            await expect(page).toHaveURL('/restaurant/1');
        });
});
