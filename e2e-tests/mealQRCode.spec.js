import { test, expect } from '@playwright/test';
import {
    sql, insertUser,
    insertRestaurant, updateUserRestaurantByEmail
} from '../backend/database';
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
        50, 'gluteeni, selleri', 1.3, 11.7, 8.2, 0.1, 
        0.1, 654.7, 1.9, 523, 0, 1230)`;
};

test.describe('menu qr page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/');
        await page.locator('#language-toggle').click();
        await page.locator('#username-input').fill('test');
        await page.locator('#password-input').fill('Test123!');
        await page.locator('#login-button').click();
        await page.waitForURL('/');
    });

    test('displays meal QR code correctly',
        async ({ page }) => {
            await expect(page.locator('#root'))
                .toContainText('Welcome, test');
            await expect(page.locator('#root'))
                .toContainText('You are logged in as a restaurant user');
            await page.locator('#export-meal-qr-button-0').click();
            await expect(page.locator('#meal-qr-code')).toBeVisible();
        });
});
