import {
    sql, insertRestaurant, insertUser, addPurchase
} from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE purchases RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE meals RESTART IDENTITY CASCADE`;

    const restaurantId = await insertRestaurant('testaurant');

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
            birthYear: '1978',
            gender: 'man',
            education: 'primary',
            income: 'below 1500',
        }
    ];

    for (const user of users) {
        const password = hash(user.password);
        await insertUser(user.username, password, user.email, 
            user.birthYear, user.gender, user.education, user.income);
    }

    await sql`INSERT INTO meals (
        name, restaurant_id, purchase_code, meal_description, co2_emissions,
        meal_allergens, carbohydrates, protein, fat, fiber, sugar, salt,
        saturated_fat, energy, vegetable_percent, price
        )
        VALUES 
        ('Kana bolognese', ${restaurantId}, '12345678',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        50, 'gluteeni, selleri', 1.3, 11.7, 8.2, 0.1, 0.1, 654.7, 1.9,
        523, 0, 1230),
        ('Pannacotta', ${restaurantId}, 'abcdefgh',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit
        esse cillum dolore eu fugiat nulla pariatur.', 2,
        'maito, kananmuna', 27.4, 2.9, 16.3, 0, 27.4, 78.5, 10.9,
        1119, 0, 950)`;

    await addPurchase(1, '12345678');
    await addPurchase(2, 'abcdefgh');
};

test.describe('user dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/');
    });

    test('users that are not logged in cannot see dashboard',
        async ({ page }) => {
            await expect(page.locator('#user-dashboard'))
                .not.toBeVisible();
        });

    test('logged in users can see their dashboard', async ({ page }) => {
        await page.locator('#language-toggle').click();
        await page.locator('#navigation-login').click();
        await page.fill('input[id="username-input"]', 'test');
        await page.fill('input[id="password-input"]', 'Test123!');
        await page.locator('#login-button').click();
        await page.waitForURL('/');

        await expect(page.locator('text=Dashboard')).toBeVisible();

        await expect(page.locator('#avg-co2 rect').nth(1)).toBeVisible();
        await expect(page.locator('#avg-co2 rect').nth(2)).toBeVisible();
        await expect(page.locator('#avg-co2 rect').nth(3)).toBeVisible();
        await expect(page.locator('#avg-co2 rect').nth(4)).toBeVisible();

        await expect(page.locator('#avg-carbs rect').nth(1)).toBeVisible();
        await expect(page.locator('#avg-carbs rect').nth(2)).toBeVisible();
        await expect(page.locator('#avg-carbs rect').nth(3)).toBeVisible();
        await expect(page.locator('#avg-carbs rect').nth(4)).toBeVisible();
        
        await expect(page.locator('#avg-fat rect').nth(1)).toBeVisible();
        await expect(page.locator('#avg-fat rect').nth(2)).toBeVisible();
        await expect(page.locator('#avg-fat rect').nth(3)).toBeVisible();
        await expect(page.locator('#avg-fat rect').nth(4)).toBeVisible();

        await expect(page.locator('#avg-fat rect').nth(1)).toBeVisible();
        await expect(page.locator('#avg-fat rect').nth(2)).toBeVisible();
        await expect(page.locator('#avg-fat rect').nth(3)).toBeVisible();
        await expect(page.locator('#avg-fat rect').nth(4)).toBeVisible();
    });

});
