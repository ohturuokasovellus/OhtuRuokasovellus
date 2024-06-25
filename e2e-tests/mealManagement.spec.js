/* eslint-disable @stylistic/js/max-len */
import { sql, insertRestaurant,
    insertUser, updateUserRestaurantByEmail, addMealImage
} from '../backend/database';
import { test, expect } from '@playwright/test';
import path from 'node:path';
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
    const ingredients = JSON.stringify([
        {
            ingredientId: '11049',
            category: '',
            ingredient: 'Banaani kuorittu',
            weight: '150'
        },
        {
            ingredientId: '30572',
            category: '',
            ingredient: 'Grillimakkara tuotekeskiarvo',
            weight: '100'
        }
    ]);


    await sql`INSERT INTO meals (
        name, restaurant_id, purchase_code, meal_description, co2_emissions,
        meal_allergens, carbohydrates, protein, fat, fiber, sugar, salt,
        saturated_fat, energy, vegetable_percent, price, ingredients
        )
        VALUES 
        ('Kana bolognese', ${restaurantId}, '12345678',
        'Lorem ipsum',
        50, 'gluteeni, selleri', 1.3, 11.7, 8.2, 0.1, 0.1, 654.7, 1.9, 523,
        0, 1200, ${ingredients}),
        ('Pannacotta', ${restaurantId}, 'abcdefgh',
        'Ut enim ad minim veniam', 2,
        'maito, kananmuna', 27.4, 2.9, 16.3, 0, 27.4, 78.5, 10.9, 1119, 0, 500,
        ${ingredients})`
    ;
    await addMealImage(1, Buffer.from('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAktJREFUOE91k19IU3EUx7+32px6EYoKiUijyAYRYfS4YRGhhUbEInrQ/hCoQQVSo5FZPowsIhSiB0lYQTOVCpO0EUHMhxI0InG0FNesbczQsrm23fLGOdff5S7pvJxzfueczzm/87tXisWTKgAk5hVSusj5piz/fzkSATLKQlay2bSMfYISqNzxCKlkIivH9/QE+9L45A+egER0FdOYzctRdaybY2drtLS6cz2sN26tQF9XNXiCZ50eVB6t4UD13p24/3JY7/a8r1O3Z/vdur2ywgX77sOQ2tvuqt+no9hTdQSXTjmQazZh9uc8OgZGcGZ/EUrWyegJnURkopmLbzk2s27oHkcsntQA20p38eH7d0H0e64zoMv/AWUH7mFfQQsDGkofwjWwBe7yIOeSPfTmAaSbjVf4cr9SaQy+6OUJ2M8oCOfUsz03M80Ao3yeScHlDWoAUUwJqXSG8yw5ZgZY8mTEv0wuAfhGv8HzOgKp1X1DVZQFDA++wtfwhLbxphZcvh3VQHkyPo2Nof44kB7x8plvzompUBhXa3MhNV9wqjS66E7FJASgYhL7ikYUrbKANh8IBBj0MZJAbVMHJHvJJv07MN4xXnCeAaI4VnwIVquVUwgihAGia9s1px4gAMnp4lbWRoBI8vv9kNrveFXl9x+sXWPhc4LQAkloiZVlYRSGnmBUtsFms+kNxBQ8gSgQUXpK8YwX6/J55Le9j3Fwu2S8Jegp9R2sLtzAQdPijxSdCrFPRZRIS/xXsgBLoosHO9an2TICBJD0X0ZyBqmExE9fAAAAAElFTkSuQmCC'));
    await addMealImage(2, Buffer.from('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAktJREFUOE91k19IU3EUx7+32px6EYoKiUijyAYRYfS4YRGhhUbEInrQ/hCoQQVSo5FZPowsIhSiB0lYQTOVCpO0EUHMhxI0InG0FNesbczQsrm23fLGOdff5S7pvJxzfueczzm/87tXisWTKgAk5hVSusj5piz/fzkSATLKQlay2bSMfYISqNzxCKlkIivH9/QE+9L45A+egER0FdOYzctRdaybY2drtLS6cz2sN26tQF9XNXiCZ50eVB6t4UD13p24/3JY7/a8r1O3Z/vdur2ywgX77sOQ2tvuqt+no9hTdQSXTjmQazZh9uc8OgZGcGZ/EUrWyegJnURkopmLbzk2s27oHkcsntQA20p38eH7d0H0e64zoMv/AWUH7mFfQQsDGkofwjWwBe7yIOeSPfTmAaSbjVf4cr9SaQy+6OUJ2M8oCOfUsz03M80Ao3yeScHlDWoAUUwJqXSG8yw5ZgZY8mTEv0wuAfhGv8HzOgKp1X1DVZQFDA++wtfwhLbxphZcvh3VQHkyPo2Nof44kB7x8plvzompUBhXa3MhNV9wqjS66E7FJASgYhL7ikYUrbKANh8IBBj0MZJAbVMHJHvJJv07MN4xXnCeAaI4VnwIVquVUwgihAGia9s1px4gAMnp4lbWRoBI8vv9kNrveFXl9x+sXWPhc4LQAkloiZVlYRSGnmBUtsFms+kNxBQ8gSgQUXpK8YwX6/J55Le9j3Fwu2S8Jegp9R2sLtzAQdPijxSdCrFPRZRIS/xXsgBLoosHO9an2TICBJD0X0ZyBqmExE9fAAAAAElFTkSuQmCC'));

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
            await expect(page.locator('text=Pannacotta')).toBeVisible();

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
            await page.locator('#cancel-button').click();

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
    
    test('takes to meal editing page after clicking meals edit button',
        async ({ page }) => {
            await page.locator('#edit-button-0').click();

            await page.waitForURL('/edit-meal/1');

            await expect(page.getByText('Edit meal').first()).toBeVisible();
        });
    
    test('displays meals previous information correctly',
        async ({ page }) => {
            await page.locator('#edit-button-0').click();

            await page.waitForURL('/edit-meal/1');
            
            await expect(page.locator('img[src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAktJREFUOE91k19IU3EUx7+32px6EYoKiUijyAYRYfS4YRGhhUbEInrQ/hCoQQVSo5FZPowsIhSiB0lYQTOVCpO0EUHMhxI0InG0FNesbczQsrm23fLGOdff5S7pvJxzfueczzm/87tXisWTKgAk5hVSusj5piz/fzkSATLKQlay2bSMfYISqNzxCKlkIivH9/QE+9L45A+egER0FdOYzctRdaybY2drtLS6cz2sN26tQF9XNXiCZ50eVB6t4UD13p24/3JY7/a8r1O3Z/vdur2ywgX77sOQ2tvuqt+no9hTdQSXTjmQazZh9uc8OgZGcGZ/EUrWyegJnURkopmLbzk2s27oHkcsntQA20p38eH7d0H0e64zoMv/AWUH7mFfQQsDGkofwjWwBe7yIOeSPfTmAaSbjVf4cr9SaQy+6OUJ2M8oCOfUsz03M80Ao3yeScHlDWoAUUwJqXSG8yw5ZgZY8mTEv0wuAfhGv8HzOgKp1X1DVZQFDA++wtfwhLbxphZcvh3VQHkyPo2Nof44kB7x8plvzompUBhXa3MhNV9wqjS66E7FJASgYhL7ikYUrbKANh8IBBj0MZJAbVMHJHvJJv07MN4xXnCeAaI4VnwIVquVUwgihAGia9s1px4gAMnp4lbWRoBI8vv9kNrveFXl9x+sXWPhc4LQAkloiZVlYRSGnmBUtsFms+kNxBQ8gSgQUXpK8YwX6/J55Le9j3Fwu2S8Jegp9R2sLtzAQdPijxSdCrFPRZRIS/xXsgBLoosHO9an2TICBJD0X0ZyBqmExE9fAAAAAElFTkSuQmCC"]'))
                .toBeVisible();

            await expect(page.locator('#meal-name-input'))
                .toHaveValue('Kana bolognese');
            await expect(page.locator('#description-input'))
                .toHaveValue('Lorem ipsum');
            await expect(page.locator('text=Banaani kuorittu'))
                .toBeVisible();
            await expect(page.locator('#weight-input-0'))
                .toHaveValue('150');
            await expect(page.locator('text=Grillimakkara tuotekeskiarvo'))
                .toBeVisible();
            await expect(page.locator('#weight-input-1'))
                .toHaveValue('100');
            // cant figure how to get checkbox state
            // await expect(page.locator('#checkbox-gluten'))
            //     .toBeChecked();
            // await expect(page.locator('#checkbox-celery'))
            //     .toBeChecked();
            await expect(page.locator('#price-input'))
                .toHaveValue('12,00');
        });
    
    test('updates meal correctly',
        async ({ page }) => {
            await page.locator('#edit-button-0').click();

            await page.waitForURL('/edit-meal/1');
            await page.waitForSelector('text=Edit meal');
            
            await page.locator('#meal-name-input')
                .fill('Chicken bolognese');
            await page.locator('#description-input')
                .fill('Ipsum lorem');
            await page.locator('text=Banaani kuorittu').click();
            await page.locator('text=Mustikka metsämustikka')
                .click();
            await page.locator('#weight-input-0')
                .fill('200');
            await page.locator('#weight-input-1')
                .fill('200');
            await page.locator('#checkbox-gluten')
                .click();
            await page.locator('#checkbox-celery')
                .click();
            await page.locator('#checkbox-dairy')
                .click();
            await page.locator('#price-input')
                .fill('8,0');

            await page.locator('#create-meal-button').click();

            await page.locator('#navigation-home').click();
            await page.locator('#restaurant-page-button').click();

            await expect(page.getByText('Chicken bolognese')).toBeVisible();
            await page.locator('#chicken-bolognese-button').click();
            await expect(page.locator('text=CO2 EMISSIONS: 50')).toBeHidden();
            await expect(page.locator('text=Ipsum lorem')).toBeVisible();
            await expect(page.locator('text=ALLERGENS: maito'))
                .toBeVisible();
            await expect(page.locator('text=Carbohydrates: 1.3 g')).toBeHidden();
            await expect(page.locator('text=Fat: 8.2 g')).toBeHidden();
            await expect(page.locator('text=Protein: 11.7 g')).toBeHidden();
        });
});
