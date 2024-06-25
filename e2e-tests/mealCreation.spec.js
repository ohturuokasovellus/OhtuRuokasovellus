import { test, expect } from '@playwright/test';
import path from 'node:path';
import { sql, insertUser,
    insertRestaurant, updateUserRestaurantByEmail} from '../backend/database';
import { hash } from '../backend/services/hash';

let restaurantId;

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE meals RESTART IDENTITY CASCADE`;

    restaurantId = await insertRestaurant('testaurant');

    const users = [
        {
            username: 'test',
            password: 'Test123!',
            email: 'test@test.com',
            birthYear: '2000',
            gender: 'other',
            education: 'primary',
            income: 'below 1500',
        },
        {
            username: 'test2',
            password: 'Best456@',
            email: 'test2@test.com',
            birthYear: '2000',
            gender: 'other',
            education: 'primary',
            income: 'below 1500',
        }
    ];

    for (const user of users) {
        const password = hash(user.password);
        await insertUser(user.username, password, user.email, 
            user.birthYear, user.gender, user.education, user.income);
    }

    await updateUserRestaurantByEmail('test@test.com', restaurantId);
};

test.describe('meal creation page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();

        await page.goto('/login');
        await page.fill('input[id="username-input"]', 'test');
        await page.fill('input[id="password-input"]', 'Test123!');
        await page.locator('#login-button').click();
        await page.waitForURL('/');

        await page.goto('/create-meal');
        await page.locator('#language-toggle').click();
    });

    test('redirects to login if not currently logged in',
        async ({ page }) => {
            await page.click('text=Logout');
            await expect(page).toHaveURL(/\/login$/);

            await page.goto('/create-meal');
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

    test('does not create a meal without ingredient',
        async ({page}) => {
            await page.fill('input[id="meal-name-input"]', 'ruoka');
            await page.locator('#price-input').fill('12,30');
            const fileChooserPromise = page.waitForEvent('filechooser');
            await page.locator('#image-picker-button').click();
            const fileChooser = await fileChooserPromise;
            const filePath = path.join(__dirname, 'assets', 'image.png');
            await fileChooser.setFiles(filePath);

            await page.locator('#create-meal-button').click();
            await expect(page).toHaveURL('/create-meal');
            await expect(page.locator('#root'))
                .toContainText('At least one ingredient with weight required');
        });
    
    test('does not create a meal without meal price',async ({page}) => {
        await page.fill('input[id="meal-name-input"]', 'ruoka');
        await page.getByText('Ingredient').click();
        await page.getByText('Banaani kuorittu').click();
        await page.fill('input[id="weight-input-0"]', '100');
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('#image-picker-button').click();
        const fileChooser = await fileChooserPromise;
        const filePath = path.join(__dirname, 'assets', 'image.png');
        await fileChooser.setFiles(filePath);

        await page.locator('#create-meal-button').click();
        await expect(page).toHaveURL('/create-meal');
        await expect(page.locator('#root'))
            .toContainText('Price is required');
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

    test('creating a meal works with meal description, \
        ingredients and their weight, allergens and price',
    async ({ page }) => {
        await page.fill('input[id="meal-name-input"]', 'ruoka');
        await page.locator('#description-input').fill('description');
        // await page.locator('#ingredient-dropdown-0').click();
        await page.getByText('Ingredient').click();
        await page.getByText('Banaani kuorittu').click();
        await page.fill('input[id="weight-input-0"]', '100');
        await page.locator('#checkbox-grains').click();
        await page.locator('#price-input').fill('12,30');
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('#image-picker-button').click();
        const fileChooser = await fileChooserPromise;
        const filePath = path.join(__dirname, 'assets', 'image.png');
        await fileChooser.setFiles(filePath);
        expect(page.getByRole('img')).toBeDefined();
    });

    test('restaurant user can add ingredient', async ({ page }) => {
        await page.getByText('+').click();
        await expect((page.getByText('Food group'))).toHaveCount(2);
        await expect((page.getByText('Ingredient'))).toHaveCount(2);
        await expect((page.getByPlaceholder('Weight (g)'))).toHaveCount(2);
    });

    test('restaurant user can delete ingredient', async ({ page }) => {
        await page.getByText('+').click();
        await expect((page.getByText('Food group'))).toHaveCount(2);
        await expect((page.getByText('Ingredient'))).toHaveCount(2);
        await expect((page.getByPlaceholder('Weight (g)'))).toHaveCount(2);
        await page.getByText('–').nth(1).click();
        await expect((page.getByText('Food group'))).toHaveCount(1);
        await expect((page.getByText('Ingredient'))).toHaveCount(1);
        await expect((page.getByPlaceholder('Weight (g)'))).toHaveCount(1);
    });
});
