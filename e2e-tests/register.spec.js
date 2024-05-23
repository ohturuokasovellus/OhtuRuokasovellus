import { sql } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    const user = 'test';
    // eslint-disable-next-line id-length
    const pw = hash('Test123!');
    const email = 'test@test.com';
    await sql`
    INSERT INTO users (username, password, email)
    VALUES (${user}, ${pw}, ${email})
    `;
};

test.describe('registration page', () => {
    test.beforeEach(async ({ page }) => {
        console.log('b4 initDB;');
        await initTestDB();
        await page.goto('/register');
    });

    test('redirects to login page if already registered', async ({ page }) => {
        await page.getByRole('link', { name: 'login' }).click();
        await expect(page).toHaveURL(/\/login$/);
    });

    test('registers user with correct details', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('best');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('best@test.com');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/login$/);
    });

    test('cannot register with a duplicate username', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('test');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test@test.fi');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/);
        await expect(page.locator('#root'))
            .toContainText('username already exists');
    });

    test('cannot register without a username', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test@test.fi');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/);
        await expect(page.locator('#root'))
            .toContainText('username is required');
    });

    test('cannot register with an invalid username', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('te');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test@test.fi');
        await expect(page.locator('#root'))
            .toContainText('username must be at least 3 characters');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('username')
            .fill('123456789012345678901234567890123');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/);
        await expect(page.locator('#root'))
            .toContainText('username cannot exceed 32 characters');
    });

    test('cannot register with a duplicate email', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('test2');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test@test.com');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/);
        await expect(page.locator('#root'))
            .toContainText('email already exists');
    });

    test('cannot register without an email', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('test2');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/);
        await expect(page.locator('#root')).toContainText('email is required');
    });

    test('cannot register with an invalid email', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('test2');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test');
        await page.getByPlaceholder('username').click();
        await expect(page.locator('#root')).toContainText('invalid email');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test@test.com');
        await page.getByPlaceholder('email').fill('test@test');
        await page.getByPlaceholder('username').click();
        await expect(page.locator('#root')).toContainText('invalid email');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/);
    });

    test('cannot register without a password', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('test2');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test@test.fi');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('confirm password').click();
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/);
        await expect(page.locator('#root'))
            .toContainText('password is required');
        await expect(page.locator('#root'))
            .toContainText('password confirmation is required');
    });

    test('cannot register with an invalid password', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('test2');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test@test.fi');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true }).fill('test');
        await page.getByPlaceholder('confirm password').click();
        await expect(page.locator('#root'))
            .toContainText('password must be at least 8 characters');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('123456789012345678901234567890123');
        await page.getByPlaceholder('confirm password').click();
        await expect(page.locator('#root'))
            .toContainText('password cannot exceed 32 characters');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('TESTTEST');
        await page.getByPlaceholder('confirm password').click();
        await expect(page.locator('#root'))
            .toContainText(
                'password must contain at least one lowercase letter'
            );
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('testtest');
        await page.getByPlaceholder('confirm password').click();
        await expect(page.locator('#root'))
            .toContainText(
                'password must contain at least one uppercase letter'
            );
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('testTEST');
        await page.getByPlaceholder('confirm password').click();
        await expect(page.locator('#root'))
            .toContainText('password must contain at least one number');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('test123A');
        await page.getByPlaceholder('confirm password').click();
        await expect(page.locator('#root'))
            .toContainText(
                'password must contain at least one special character'
            );
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('test123A!');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/);
    });

    test('cannot register if the passwords do not match', async ({ page }) => {
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('test2');
        await page.getByPlaceholder('email').click();
        await page.getByPlaceholder('email').fill('test@test.fi');
        await page.getByPlaceholder('password', { exact: true }).click();
        await page.getByPlaceholder('password', { exact: true })
            .fill('Test123!');
        await page.getByPlaceholder('confirm password').click();
        await page.getByPlaceholder('confirm password').fill('Test123');
        await page.getByText('register', { exact: true }).click();
        await expect(page).toHaveURL(/\/register$/);
        await expect(page.locator('#root'))
            .toContainText('passwords must match');
    });
});
