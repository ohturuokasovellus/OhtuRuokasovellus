/* eslint-disable @stylistic/js/indent */
import { test, expect } from '@playwright/test';
import { sql } from '../backend/database';
import { insertUser } from '../backend/databaseUtils/user';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE evaluations RESTART IDENTITY CASCADE`;

    const user = 'test';
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

test.describe('self evaluation', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
        await page.fill('input[id="username-input"]', 'test');
        await page.fill('input[id="password-input"]', 'Testi123!');
        await page.locator('#login-button').click();
        await page.waitForURL('/home');
        await page.locator('#language-toggle').click();
        await page.locator('#settings-button').click();
        await page.waitForURL('/settings');
    });

    test('self evaluation segment is visible', async ({ page }) => {
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