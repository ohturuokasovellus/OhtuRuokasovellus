import { test, expect } from '@playwright/test';
import { sql, insertUser } from '../backend/database';
import {  addMealImage } from '../backend/databaseUtils/meal';
import { hash } from '../backend/services/hash';

/**
 * Logs user into the system.
 * @param {import('@playwright/test').Page} page 
 */
const logIn = async page => {
    await page.goto('/login');
    await page.fill('input[id="username-input"]', 'test');
    await page.fill('input[id="password-input"]', 'Test123!');
    await page.locator('#login-button').click();
    await page.waitForURL('/home');
};

test.describe('purchase', () => {
    test.beforeEach(async () => {
        await sql`SET client_min_messages TO WARNING`;
        await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
        await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;
        await sql`TRUNCATE TABLE meals RESTART IDENTITY CASCADE`;
        await sql`TRUNCATE TABLE purchases RESTART IDENTITY CASCADE`;
        await insertUser('test', hash('Test123!'), 'test@test.com', '2000',
            'other', 'primary', 'below 1500'
        );
        await sql`
            INSERT INTO meals (
                name, restaurant_id, purchase_code, meal_description,
                co2_emissions, meal_allergens, carbohydrates, protein,
                fat, fiber, sugar, salt, saturated_fat, energy
            )
            VALUES (
                'Meatballs', 1, 'testabc1', 'a great meal!',
                1, 'none', 100, 15, 4, 2, 1, 10, 3, 100
            );
        `;
        // eslint-disable-next-line @stylistic/js/max-len, no-undef
        await addMealImage(1, Buffer.from('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAktJREFUOE91k19IU3EUx7+32px6EYoKiUijyAYRYfS4YRGhhUbEInrQ/hCoQQVSo5FZPowsIhSiB0lYQTOVCpO0EUHMhxI0InG0FNesbczQsrm23fLGOdff5S7pvJxzfueczzm/87tXisWTKgAk5hVSusj5piz/fzkSATLKQlay2bSMfYISqNzxCKlkIivH9/QE+9L45A+egER0FdOYzctRdaybY2drtLS6cz2sN26tQF9XNXiCZ50eVB6t4UD13p24/3JY7/a8r1O3Z/vdur2ywgX77sOQ2tvuqt+no9hTdQSXTjmQazZh9uc8OgZGcGZ/EUrWyegJnURkopmLbzk2s27oHkcsntQA20p38eH7d0H0e64zoMv/AWUH7mFfQQsDGkofwjWwBe7yIOeSPfTmAaSbjVf4cr9SaQy+6OUJ2M8oCOfUsz03M80Ao3yeScHlDWoAUUwJqXSG8yw5ZgZY8mTEv0wuAfhGv8HzOgKp1X1DVZQFDA++wtfwhLbxphZcvh3VQHkyPo2Nof44kB7x8plvzompUBhXa3MhNV9wqjS66E7FJASgYhL7ikYUrbKANh8IBBj0MZJAbVMHJHvJJv07MN4xXnCeAaI4VnwIVquVUwgihAGia9s1px4gAMnp4lbWRoBI8vv9kNrveFXl9x+sXWPhc4LQAkloiZVlYRSGnmBUtsFms+kNxBQ8gSgQUXpK8YwX6/J55Le9j3Fwu2S8Jegp9R2sLtzAQdPijxSdCrFPRZRIS/xXsgBLoosHO9an2TICBJD0X0ZyBqmExE9fAAAAAElFTkSuQmCC'));
    });

    test('users that are not logged in are redirected to login',
        async ({ page }) => {
        // redirected from purchase confirmation
            await page.goto('/purchase/testabc1');
            await expect(page).toHaveURL(/\/login$/);

            // redirected from history
            await page.goto('/history');
            await expect(page).toHaveURL(/\/login$/);
        });

    test('logged-in user can purchase meal and see history',
        async ({ page }) => {
        // purchase a meal
            await logIn(page);
            await page.goto('/purchase/testabc1');
            await expect(page.getByText('Meatballs')).toBeVisible();
            await page.click('#purchase_button');

            // go to home page and click meal history button
            await page.goto('/home');
            await page.click('#history-button');
            await expect(page).toHaveURL(/\/history$/);

            // expect the meal to appear in the history
            await expect(page.getByText('Meatballs')).toBeVisible();
        });
});
