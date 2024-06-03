import { test, expect } from '@playwright/test';
import path from 'node:path';
import { sql, insertUser, insertRestaurant} from '../backend/database';
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
        const password = hash(user.password);
        await insertUser(user.username, password, 
            user.email, user.restaurantId);
    }
};

test.describe('meal creation page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();

        await page.goto('/login');
        await page.getByPlaceholder('Username').click();
        await page.getByPlaceholder('Username').fill('test');
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill('Test123!');
        await page.locator('#log_user_in_button').click();
        await page.waitForURL('/');

        await page.goto('/create-meal');
        await page.locator('#language-toggle').click();
    });

    test('redirects to login if not currently logged in',
        async ({ page }) => {
            await page.click('text=Logout');
            await expect(page).toHaveURL(/\/login$/);

            await page.goto('/create-meal');
            await page.waitForURL(/\/create-meal$/);
            await expect(page).toHaveURL(/\/login$/);
        });

    test('does not create a meal without name', async ({page}) => {
        await page.locator('#create-meal-button').click();
        await expect(page).toHaveURL('/create-meal');
        await expect(page.locator('#root'))
            .toContainText('Name for the meal is required');
    });

    test('does not create a meal without image selected', async ({page}) => {
        await page.fill('input[id="meal-name-input"]', 'ruoka');
        await page.locator('#create-meal-button').click();
        await expect(page).toHaveURL('/create-meal');
        await expect(page.locator('#root'))
            .toContainText('Image of the meal is required');
    });

    test('creating a meal works with name and a image', async ({ page}) => {
        await page.fill('input[id="meal-name-input"]', 'ruoka');
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('#image-picker-button').click();
        const fileChooser = await fileChooserPromise;
        const filePath = path.join(__dirname, 'assets', 'image.png');
        await fileChooser.setFiles(filePath);
        expect(page.getByRole('img')).toBeDefined();
    });
});
