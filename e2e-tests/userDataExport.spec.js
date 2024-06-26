import { test, expect } from '@playwright/test';
import { sql, setEvaluationMetric } from '../backend/database';
import { insertRestaurant} from '../backend/databaseUtils/restaurant';
import { addPurchase} from '../backend/databaseUtils/purchase';
import { insertUser } from '../backend/databaseUtils/user';
import { hash } from '../backend/services/hash';

const initDb = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE meals RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE purchases RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE evaluations RESTART IDENTITY CASCADE`;
    await insertUser('test', hash('Test123!'), 'test@test.com', '2000',
        'other', 'primary', 'below 1500'
    );
    const restaurantId = await insertRestaurant('Good restaurant');
    await sql`INSERT INTO meals (
        name, restaurant_id, purchase_code, meal_description, co2_emissions,
        meal_allergens, carbohydrates, protein, fat, fiber, sugar, salt,
        saturated_fat, energy, vegetable_percent, price)
        VALUES ('Kana bolognese', ${restaurantId}, '12345678',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        50, 'gluteeni, selleri', 1.3, 11.7, 8.2, 0.1, 0.1, 654.7,
        1.9, 523, 0, 100)`;
    await addPurchase(1, '12345678');
    await setEvaluationMetric(1, 1, 5); // climate
    await setEvaluationMetric(1, 2, 3); // nutrition
};

/** @param {import('@playwright/test').Page} page */
const logIn = async page => {
    await page.goto('/login');
    await page.fill('input[id="username-input"]', 'test');
    await page.fill('input[id="password-input"]', 'Test123!');
    await page.locator('#login-button').click();
    await page.waitForURL('/home');
};

/**
 * @param {import('stream').Readable} stream
 * @return {Promise<string>}
 */
const streamToString = stream => {
    return new Promise((resolve, reject) => {
        let string = '';
        stream.on('data', chunk => { string += chunk; });
        stream.on('end', () => resolve(string));
        stream.on('error', err => reject(err));
    });
};

test.describe('user data export', () => {
    test.beforeEach(async () => {
        await initDb();
    });

    test('user can export their data', async ({ page }) => {
        await logIn(page);
        await page.goto('/home');

        await page.click('#settings-button');
        await expect(page).toHaveURL('/settings');

        // https://playwright.dev/docs/downloads
        const downloadPromise = page.waitForEvent('download');
        await page.click('#export-user-data');
        const download = await downloadPromise;
        const downloadStream = await download.createReadStream();
        const downloadString = await streamToString(downloadStream);
        const downloadContent = JSON.parse(downloadString);

        expect(downloadContent.userInfo.username).toBe('test');
        expect(downloadContent.purchases[0].meal).toBe('Kana bolognese');
        expect(downloadContent.selfEvaluations.climate).toBe(5);
    });
});
