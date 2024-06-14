import { sql, insertRestaurant,
    insertUser, updateUserRestaurantByEmail } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE meals RESTART IDENTITY CASCADE`;

    const restaurant = 'testaurant';
    const user = 'test';
    const password = hash('Test123!');
    const email = 'test@test.com';
    const birthYear = '2000';
    const gender = 'other';
    const education = 'primary';
    const income = 'below 1500';
    await insertUser(user, password, email, birthYear,
        gender, education, income
    );
    const restaurantId = await insertRestaurant(restaurant);

    await updateUserRestaurantByEmail('test@test.com', restaurantId);
    await sql`INSERT INTO meals (
        name, restaurant_id, purchase_code, meal_description, co2_emissions,
        meal_allergens, carbohydrates, protein, fat, fiber, sugar, salt,
        saturated_fat, energy, vegetable_percent, price
        )
        VALUES 
        ('Kana bolognese', ${restaurantId}, '12345678',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        50, 'gluteeni, selleri', 1.3, 11.7, 8.2, 0.1, 0.1, 654.7, 1.9, 523,
        0, 1200),
        ('Pannacotta', ${restaurantId}, 'abcdefgh',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit
        esse cillum dolore eu fugiat nulla pariatur.', 2,
        'maito, kananmuna', 27.4, 2.9, 16.3, 0, 27.4, 78.5, 10.9, 1119, 0, 500)`
    ;
};

test.describe('meal management page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
        await page.fill('input[id="username-input"]', 'test');
        await page.fill('input[id="password-input"]', 'Test123!');
        await page.locator('#login-button').click();
        await page.waitForURL('/');
        await page.locator('#language-toggle').click();
    });

    test('lists all restaurant meals and their delete buttons',
        async ({ page }) => {
            await expect(page.locator('text=Kana bolognese')).toBeVisible();
            await expect(page.locator('text=Pannacotta')).toBeVisible;

            const deleteButtonCount = await page.locator('text=DELETE').count();
            expect(deleteButtonCount).toBe(2);
        });

    test('asks for confirmation after pressing delete',
        async ({ page }) => {
            await page.locator('#delete-meal-button-0').click();
            await expect(page.locator('#confirm-delete-button')).toBeVisible();
            await expect(page.locator('#cancel-button')).toBeVisible();
        });

    test('cancel button at confirmation cancels meal deletion',
        async ({ page }) => {
            await page.locator('#delete-meal-button-0').click();
            await page.locator('#cancel-button').click;

            await expect(page.locator('text=Kana bolognese')).toBeVisible();
        });

    test('delete button at confirmation deletes meal',
        async ({ page }) => {
            await page.locator('#delete-meal-button-0').click();
            await page.locator('#confirm-delete-button').click();

            await expect(page.locator('text=Kana bolognese')).toBeHidden();
        });
    
    test('gives message if no meals found',
        async ({ page }) => {
            await page.locator('#delete-meal-button-1').click();
            await page.locator('#confirm-delete-button').click();
            await page.locator('#delete-meal-button-0').click();
            await page.locator('#confirm-delete-button').click();

            await expect(page.locator('text=Kana bolognese')).toBeHidden();
            await expect(page.locator('text=Pannacotta')).toBeHidden();
            await expect(page.locator('text=No meals.')).toBeVisible();
        });
    
    test('deleted meals do not show on the restaurant page',
        async ({ page }) => {
            await page.locator('#delete-meal-button-1').click();
            await page.locator('#confirm-delete-button').click();
            await page.locator('#delete-meal-button-0').click();
            await page.locator('#confirm-delete-button').click();

            await page.locator('#restaurant-page-button').click();
            await page.waitForURL('/restaurant/1');

            await expect(page.locator('text=Kana bolognese')).toBeHidden();
            await expect(page.locator('text=Pannacotta')).toBeHidden();
        });
});
