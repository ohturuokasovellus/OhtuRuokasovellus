/* eslint-disable @stylistic/js/indent */
import { sql, insertUser, insertRestaurant } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;

    let user = 'admin';
    let password = hash('Testi123!');
    let email = 'test@test.com';
    let birthYear = '2000';
    let gender = 'other';
    let education = 'primary';
    let income = 'below 1500';
    insertUser(user, password, email, birthYear,
        gender, education, income
    );
    await sql `UPDATE users SET is_admin = TRUE;`;

    user = 'test';
    password = hash('Testi123!');
    email = 'test1@test.com';
    birthYear = '2000',
    gender = 'other';
    education = 'primary';
    income = 'below 1500';
    insertUser(user, password, email, birthYear,
        gender, education, income
    );
    insertRestaurant('testaurant');
};

test.describe('admin panel', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
        await page.fill('input[id="username-input"]', 'admin');
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();
        await page.waitForURL('/');
        await page.locator('#language-toggle').click();
        await page.locator('#admin-panel-button').click();
        await page.waitForURL('/');
    });

    test('admin user has admin panel button that takes to admin page',
        async ({ page }) => {
        await expect(page.locator('#admin-panel-button')).toBeVisible();
        await page.locator('#admin-panel-button').click();
        
        await expect(page.locator('text=Self evaluation')).toBeVisible();
        await expect(
            page.locator('text=How important climate friendliness is to you?'))
            .toBeVisible();
        await expect(
            page.locator('text=How important nutritional values are to you?'))
            .toBeVisible();

        await expect(page.locator('text=SUBMIT')).toBeVisible();
    });

    test('user can submit self evaluation', async ({ page }) => {
        await page.locator('text=SUBMIT').click();
        await expect(page.locator('text=Evaluation sent')).toBeVisible();
    });

    test('self evaluation is saved in database', async ({ page }) => {
        await page.locator('text=SUBMIT').click();
        await page.waitForSelector('text=Evaluation sent');
        const result = await sql `SELECT eval_value FROM evaluations
            WHERE user_id = 1;`;
        expect(result.at(0).eval_value).toBe(3);
        expect(result.at(1).eval_value).toBe(3);
    });

    // possible TODO: try testing slider value changing
});