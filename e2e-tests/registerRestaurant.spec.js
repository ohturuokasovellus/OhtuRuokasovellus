import { sql, insertRestaurant, insertUser } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;
    const restaurant = 'testaurant';
    const user = 'test';
    // eslint-disable-next-line id-length
    const pw = hash('Test123!');
    const email = 'test@test.com';
    const restaurantId = await insertRestaurant(restaurant);
    insertUser(user, pw, email, restaurantId);
};

test.describe('restaurant registration page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/register-restaurant');
        await page.locator('#language-toggle').click();
    });

    test('redirects to login page if already registered', async ({ page }) => {
        await page.getByRole('link', { name: 'login' }).click();
        await expect(page).toHaveURL(/\/login$/);
    });

    test('registers user with correct details', async ({ page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('bestaurant');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('best');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('best@test.com');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/login$/);
    });

    test('cannot register with a duplicate restaurant name', async (
        { page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('testaurant');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test2');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.fi');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
        await expect(page.locator('#root'))
            .toContainText('restaurant already exists');
    });

    test('cannot register with an invalid restaurant name', async (
        { page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('be');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test2');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.fi');
        await expect(page.locator('#root'))
            .toContainText('Restaurant name must be at least 3 characters');
        await page.locator('#email-input').click();
        await page.locator('#restaurant-name-input')
            .fill('123456789012345678901234567890123');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
        await expect(page.locator('#root'))
            .toContainText('Restaurant name cannot exceed 32 characters');
    });

    test('cannot register without restaurant name', async ({ page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('best');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('best@test.com');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
        await expect(page.locator('#root'))
            .toContainText('Restaurant name is required');
    });

    test('cannot register with a duplicate username', async ({ page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('bestaurant');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.fi');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
        await expect(page.locator('#root'))
            .toContainText('username already exists');
    });

    test('cannot register without a username', async ({ page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('bestaurant');
        await page.locator('#username-input').click();
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.fi');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
        await expect(page.locator('#root'))
            .toContainText('Username is required');
    });

    test('cannot register with an invalid username', async ({ page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('bestaurant');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('te');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.fi');
        await expect(page.locator('#root'))
            .toContainText('Username must be at least 3 characters');
        await page.locator('#email-input').click();
        await page.locator('#username-input')
            .fill('123456789012345678901234567890123');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
        await expect(page.locator('#root'))
            .toContainText('Username cannot exceed 32 characters');
    });

    test('cannot register with a duplicate email', async ({ page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('bestaurant');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test2');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.com');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
        await expect(page.locator('#root'))
            .toContainText('email already exists');
    });

    test('cannot register without an email', async ({ page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('bestaurant');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test2');
        await page.locator('#email-input').click();
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
        await expect(page.locator('#root')).toContainText('Email is required');
    });

    test('cannot register with an invalid email', async ({ page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('bestaurant');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test2');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test');
        await page.locator('#username-input').click();
        await expect(page.locator('#root')).toContainText('Invalid email');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.com');
        await page.locator('#email-input').fill('test@test');
        await page.locator('#username-input').click();
        await expect(page.locator('#root')).toContainText('Invalid email');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
    });

    test('cannot register without a password', async ({ page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('bestaurant');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test2');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.fi');
        await page.locator('#password-input').click();
        await page.locator('#confirm-password-input').click();
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
        await expect(page.locator('#root'))
            .toContainText('Password is required');
        await expect(page.locator('#root'))
            .toContainText('Password confirmation is required');
    });

    test('cannot register with an invalid password', async ({ page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('bestaurant');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test2');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.fi');
        await page.locator('#password-input').click();
        await page.locator('#password-input').fill('test');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText('Password must be at least 8 characters');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('123456789012345678901234567890123');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText('Password cannot exceed 32 characters');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('TESTTEST');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText(
                'Password must contain at least one lowercase letter'
            );
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('testtest');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText(
                'Password must contain at least one uppercase letter'
            );
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('testTEST');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText('Password must contain at least one number');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('test123A');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText(
                'Password must contain at least one special character'
            );
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('test123A!');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
    });

    test('cannot register if the passwords do not match', async ({ page }) => {
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('bestaurant');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test2');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.fi');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register-restaurant$/);
        await expect(page.locator('#root'))
            .toContainText('Passwords must match');
    });
});
