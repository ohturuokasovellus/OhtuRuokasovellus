import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

// FIXME: move this to somewhere more appropriate, e.g. global setup?
// the only reason this is here is me needing a magic fix to get the test db running
// im just dumb and have zero idea how to config this TT___TT /meri
require('dotenv').config();
const postgres = require('postgres')
const sql = postgres(process.env.E2ETEST_POSTGRES_URL)

const initTestDB = async () => {
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    const user = 'test';
    const pw= hash('Test123!');
    const email = 'test@test.com';
    await sql`
    INSERT INTO users (user_name, password_hash, email)
    VALUES (${user}, ${pw}, ${email})
    `;
};

test.describe('registration page', () => {
    test.beforeEach(async ({ page }) => {
        initTestDB();
        await page.goto('/register')
    });

    test('user can be redirected to login page if already registered', async ({ page }) => {
        await page.getByRole('link', { name: 'login' }).click();
        await expect(page).toHaveURL(/\/login$/);
    });

    test('user can register with correct details', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('best');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('best@test.com');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true }).fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/login$/);
    });

    test('user cannot register with a duplicate username', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('test');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test@test.fi');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true }).fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/)
        await expect(page.locator('#root')).toContainText('username already exists');
    });

    test('user cannot register without a username', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test@test.fi');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true }).fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/)
        await expect(page.locator('#root')).toContainText('username is required');
    });

    test('user cannot register with a duplicate email', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('test2');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test@test.com');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true }).fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/)
        await expect(page.locator('#root')).toContainText('email already exists');
    });

    test('user cannot register without an email', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('test2');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true }).fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/)
        await expect(page.locator('#root')).toContainText('email is required');
    });

        // test('user cannot register with an invalid email', async ({ page }) => {
        // await page.getByPlaceholder('username').click();
        // await page.getByPlaceholder('username').fill('test2');
        // await page.getByPlaceholder('email').click();
        // await page.getByPlaceholder('email').fill('test');
        // await page.getByPlaceholder('email').fill('test');
        // await page.getByPlaceholder('password', { exact: true }).click();
        // await page.getByPlaceholder('password', { exact: true }).fill('Test123!');
        // await page.getByPlaceholder('confirm password').click();
        // await page.getByPlaceholder('confirm password').fill('Test123!');
        // await page.getByText('register', { exact: true }).click();
        // await expect(page).toHaveURL(/\/register$/)
        // await expect(page.locator('#root')).toContainText('email already exists');
    // });

    // test('user cannot register with an invalid password', async ({ page }) => {
    // });

    // test('user cannot register if the passwords do not match', async ({ page }) => {
    // });
});



