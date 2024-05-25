import { test, expect } from '@playwright/test';
import {
    sql, insertUser,
    insertRestaurant,
    updateUserRestaurantByEmail,
    getUser
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
        },
        {
            username: 'test3',
            password: 'Rest789+',
            email: 'test3@test.com',
            restaurantId: null
        }
    ];

    for (const user of users) {
        // eslint-disable-next-line id-length
        const pw = hash(user.password);
        await insertUser(user.username, pw, user.email, user.restaurantId);
        const userCheck = await getUser(user.username, pw);
        console.log(userCheck);
    }
};

test.describe('adding restaurant users: unauthorised', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
    });

    test('redirects to home if a normal user tries to access the page',
        async ({ page }) => {
            await page.goto('/login');
            await page.getByPlaceholder('Username').click();
            await page.getByPlaceholder('Username').fill('test2');
            await page.getByPlaceholder('Password').click();
            await page.getByPlaceholder('Password').fill('Best456@');
            await page.getByText('login').click();
            await page.goto('/add-users');
            await expect(page).toHaveURL('/');
        });

    test('redirects to login if user is not logged in',
        async ({ page }) => {
            await page.goto('/add-users');
            await expect(page).toHaveURL(/\/login$/);
        });
});

test.describe('adding restaurant users: authorised', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
        await page.getByPlaceholder('Username').click();
        await page.getByPlaceholder('Username').fill('test');
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill('Test123!');
        await page.getByText('login').click();
        await page.getByText('add user').click();
    });

    test('user can go back to home page', async ({ page }) => {
        await page.getByRole('link', { name: 'back to home' }).click();
        await expect(page).toHaveURL('/');
    });

    test('restaurant user can add one user to their restaurant',
        async ({ page }) => {
            await page.getByPlaceholder('email').click();
            await page.getByPlaceholder('email').fill('test2@test.com');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('Test123!');
            await page.getByText('add users').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('users have been successfully processed!');
            await expect(page.locator('#root'))
                .toContainText('test2@test.com: user added successfully');
        });

    test('restaurant user can add multiple users to their restaurant',
        async ({ page }) => {
            await page.getByPlaceholder('email').click();
            await page.getByPlaceholder('email').fill('test2@test.com');
            await page.getByText('+').click();
            await page.getByPlaceholder('email').nth(1).click();
            await page.getByPlaceholder('email').nth(1).fill('test3@test.com');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('Test123!');
            await page.getByText('add users').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('users have been successfully processed!');
            await expect(page.locator('#root'))
                .toContainText('test2@test.com: user added successfully');
            await expect(page.locator('#root'))
                .toContainText('test3@test.com: user added successfully');
        });

    test('restaurant user can remove an email from the users-to-add listing',
        async ({ page }) => {
            await page.getByText('+').click();
            await expect(page.getByPlaceholder('email').nth(1)).toBeVisible();
            await page.getByText('–').nth(1).click();
            await expect(page.getByPlaceholder('email').nth(1))
                .toBeVisible(false);
        });

    test('users are not added if the emails do not exist',
        async ({ page }) => {
            await page.goto('http://localhost:19006/login');
            await page.getByPlaceholder('email').click();
            await page.getByPlaceholder('email').fill('does@not.exist');
            await page.getByText('+').click();
            await page.getByPlaceholder('email').nth(1).click();
            await page.getByPlaceholder('email').nth(1).fill('not an email');
            await page.getByText('+').nth(1).click();
            await page.getByPlaceholder('email').nth(2).click();
            await page.getByPlaceholder('email').nth(2).fill('');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('Test123!');
            await page.getByText('add users').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('users have been successfully processed!');
            await expect(page.locator('#root'))
                .toContainText('does@not.exist: email does not exist');
            await expect(page.locator('#root'))
                .toContainText('not an email: email does not exist');
            await expect(page.locator('#root'))
                .toContainText(' : email does not exist');
        });

    test('users are not added if they are already part of a restaurant',
        async ({ page }) => {
            await updateUserRestaurantByEmail('test2@test.com', 1);
            await page.getByPlaceholder('email').click();
            await page.getByPlaceholder('email').fill('test2@test.com');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('Test123!');
            await page.getByText('add users').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('users have been successfully processed!');
            await expect(page.locator('#root'))
                .toContainText(
                    // eslint-disable-next-line @stylistic/js/max-len
                    'test2@test.com: user is already associated with a restaurant'
                );
        });

    test('users are not added without password validation',
        async ({ page }) => {
            await page.getByPlaceholder('email').click();
            await page.getByPlaceholder('email').fill('test2@test.com');
            await page.getByText('add users').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('invalid password');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('incorrect');
            await page.getByText('add users').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('invalid password');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('Test123!');
            await page.getByText('add users').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('users have been successfully processed!');
            await expect(page.locator('#root'))
                .toContainText('test2@test.com: user added successfully');
        });
});
