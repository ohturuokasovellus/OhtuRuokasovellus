import { test, expect } from '@playwright/test';
import { sql, insertUser, insertRestaurant } from '../backend/database';
import { hash } from '../backend/services/hash';

const initDb = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE meals RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE purchases RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;
    await insertUser('test', hash('Test123!'), 'tester@example.com', null);
    const restaurantId = await insertRestaurant('Good restaurant');
    await sql`INSERT INTO meals
        (name, restaurant_id, purchase_code, meal_description, co2_emissions,
        meal_allergens, carbohydrates, protein, fat, fiber, sugar, salt,
        saturated_fat, energy, mass, vegetable_percent)
        VALUES ('Kana bolognese', ${restaurantId}, '12345678',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 50,
        'gluteeni, selleri', 1.3, 11.7, 8.2, 0.1, 0.1, 654.7, 1.9, 523, 50, 0)`;
};

/** @param {import('@playwright/test').Page} page */
const logIn = async page => {
    await page.goto('/login');
    await page.fill('input[id="username-input"]', 'test');
    await page.fill('input[id="password-input"]', 'Test123!');
    await page.locator('#login-button').click();
    await page.waitForURL('/');
};

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} purchaseCode
 */
const purchaseMeal = async (page, purchaseCode) => {
    await page.goto(`/purchase/${purchaseCode}`);
    await page.click('#purchase_button');
};

test.describe('user removal', () => {
    test.beforeEach(async () => {
        await initDb();
    });

    test('user removal works as expected', async ({ page }) => {
        await logIn(page);
        await page.goto('/');
        await purchaseMeal(page, '12345678');

        // password is required
        await page.goto('/');
        await page.click('#settings-button');
        await expect(page).toHaveURL('/settings');
        await page.click('#account_removal_button');
        await expect(page.getByText('Syötä salasana', { exact: true })).toBeVisible();

        // password is checked to be correct
        await page.fill('#account_removal_password', '!nC0rrect');
        await expect(page.getByText('Syötä salasana', { exact: true })).not.toBeVisible();
        await page.click('#account_removal_button');
        await expect(page.getByText('Tietojen poisto epäonnistui')).toBeVisible();

        // account is removed with corrct password
        await page.fill('#account_removal_password', 'Test123!');
        await page.click('#account_removal_button');
        await expect(page).toHaveURL('/register');

        // user can no longer access pages that require being logged in
        await page.goto('/history');
        await expect(page).toHaveURL('/login');

        // database still contains purchases for this user
        const purchases = await sql`SELECT * FROM purchases;`;
        expect(purchases.length).toBe(1);
    });
});
