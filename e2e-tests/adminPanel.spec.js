/* eslint-disable @stylistic/js/indent */
import { sql, insertUser, insertRestaurant } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';
import { addUserToRestaurant } from '../backend/databaseUtils/adminPanel';
import { getUrl } from '../backend/databaseUtils/url';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;

    let user = 'adminTest';
    let password = hash('Testi123!');
    let email = 'test@test.com';
    let birthYear = '2000';
    let gender = 'other';
    let education = 'primary';
    let income = 'below 1500';
    await insertUser(user, password, email, birthYear,
        gender, education, income
    );
    await sql`UPDATE users SET is_admin = TRUE;`;

    user = 'test';
    password = hash('Testi123!');
    email = 'test1@test.com';
    birthYear = '2000',
    gender = 'other';
    education = 'primary';
    income = 'below 1500';
    await insertUser(user, password, email, birthYear,
        gender, education, income
    );
    const restaurantId = await insertRestaurant('testaurant');
    await addUserToRestaurant(restaurantId, user);
};

test.describe('admin panel', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
        await page.locator('#language-toggle').click();
        await page.fill('input[id="username-input"]', 'adminTest');
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();
        await page.waitForURL('/home');
        await page.locator('#admin-panel-button').click();
        await page.waitForURL('/admin-panel');
    });

    test('admin user has admin panel button that takes to admin page',
        async ({ page }) => {
        await page.goto('/home');
        await page.waitForURL('/home');
        await expect(page.locator('#admin-panel-button')).toBeVisible();
        await page.locator('#admin-panel-button').click();
        await page.waitForURL('/admin-panel');

        // await page.waitForSelector('text=testaurant');
        await expect(page.locator('text=Admin panel')).toBeVisible();
        await expect(page.locator('text=Manage restaurants')).toBeVisible();
        await expect(page.locator('text=testaurant')).toBeVisible();
    });

    test('admin user can delete existing restaurant', async ({ page }) => {
        await page.waitForSelector('text=testaurant');
        await expect(page.locator('text=testaurant')).toBeVisible();
        await page.locator('#delete-restaurant-button-0').click();
        await page.locator('#confirm-delete-button').click();
        await expect(page.locator('text=testaurant')).toBeHidden();
        const result = await sql`SELECT is_active FROM restaurants
            WHERE name = 'testaurant';`;
        expect(result.at(0).is_active).toBe(false);
    });

    test('system lists users of restaurant',
        async ({ page }) => {
        await page.waitForSelector('text=testaurant');
        await page.locator('#edit-button-0').click();
        await page.waitForSelector('text=test');
        await expect(page.getByText('test', { exact: true })).toBeVisible();
    });

    test('admin user can attach existing users to restaurant',
        async ({ page }) => {
        await page.waitForSelector('text=testaurant');
        await page.locator('#edit-button-0').click();
        await page.waitForSelector('text=test');
        await page.locator('#username-input').fill('adminTest');
        await page.locator('#attach-user-button').click();
        await page.locator('#confirm-button').click();
        await expect(page.locator('text=User added')).toBeVisible();
        await expect(page.getByText('test', { exact: true })).toBeVisible();
        await expect(page.getByText('adminTest', { exact: true }))
            .toBeVisible();
        const result = await sql`SELECT restaurant_id FROM users
            WHERE user_id = 1;`;
        expect(result.at(0).restaurant_id).not.toBe(null);
    });

    test('admin user can not attach user if username is invalid',
        async ({ page }) => {
        await page.waitForSelector('text=testaurant');
        await page.locator('#edit-button-0').click();
        await page.waitForSelector('text=test');
        await page.locator('#username-input').fill('invalidUsername');
        await page.locator('#attach-user-button').click();
        await page.locator('#confirm-button').click();
        await expect(page.locator('text=User not added')).toBeVisible();
        await expect(page.locator('text=invalidUsername')).toBeHidden();
    });

    test('non admin user can not access admin panel',
        async ({ page }) => {
        await page.locator('#navigation-logout').click();
        await page.fill('input[id="username-input"]', 'test');
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();
        await page.waitForURL('/home');
        await expect(page.locator('#admin-panel-button')).toBeHidden();

        await page.goto('/admin-panel');
        await expect(page).toHaveURL(/\/$/);
        await expect(page.locator('text=Admin panel')).toBeHidden();
        await expect(page.locator('text=Manage restaurants')).toBeHidden();
    });
});