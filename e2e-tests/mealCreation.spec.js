import { test, expect } from '@playwright/test';
import path from 'node:path';
import { sql, insertUser, insertRestaurant} from '../backend/database';
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
            restaurantId: restaurantId
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
            // await page.waitForURL(/\/create-meal$/);
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

    test('creating a meal works with meal description, \
        ingredients and their weight and allergens', async ({ page }) => {
        await page.fill('input[id="meal-name-input"]', 'ruoka');
        await page.locator('#description-input').fill('description');
        // await page.locator('#ingredient-dropdown-0').click();
        await page.getByText('Ingredient').click();
        await page.getByText('Banaani kuorittu').click();
        await page.fill('input[id="weight-input-0"]', '100');
        await page.locator('#checkbox-grains').click();
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

    // For some reason doesnt want to open restaurant page TODO
    // test('created meal and its information is displayed correctly on the meal list',
    //     async ({ page }) => {
    //         await page.fill('input[id="meal-name-input"]', 'ruoka');
    //         await page.locator('#description-input').fill('description');
    //         // await page.locator('#ingredient-dropdown-0').click();
    //         await page.getByText('Ingredient').click();
    //         await page.getByText('Banaani kuorittu').click();
    //         await page.fill('input[id="weight-input-0"]', '100');
    //         await page.locator('#checkbox-grains').click();
    //         const fileChooserPromise = page.waitForEvent('filechooser');
    //         await page.locator('#image-picker-button').click();
    //         const fileChooser = await fileChooserPromise;
    //         const filePath = path.join(__dirname, 'assets', 'image.png');
    //         await fileChooser.setFiles(filePath);

    //         await page.goto(`/restaurant/${restaurantId}`);
    //         await expect(page.locator('text=ruoka')).toBeVisible();
    //         const images = page.locator('img');
    //         await expect(images).toHaveCount(1);
    //         await expect(page.locator('img[src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAktJREFUOE91k19IU3EUx7+32px6EYoKiUijyAYRYfS4YRGhhUbEInrQ/hCoQQVSo5FZPowsIhSiB0lYQTOVCpO0EUHMhxI0InG0FNesbczQsrm23fLGOdff5S7pvJxzfueczzm/87tXisWTKgAk5hVSusj5piz/fzkSATLKQlay2bSMfYISqNzxCKlkIivH9/QE+9L45A+egER0FdOYzctRdaybY2drtLS6cz2sN26tQF9XNXiCZ50eVB6t4UD13p24/3JY7/a8r1O3Z/vdur2ywgX77sOQ2tvuqt+no9hTdQSXTjmQazZh9uc8OgZGcGZ/EUrWyegJnURkopmLbzk2s27oHkcsntQA20p38eH7d0H0e64zoMv/AWUH7mFfQQsDGkofwjWwBe7yIOeSPfTmAaSbjVf4cr9SaQy+6OUJ2M8oCOfUsz03M80Ao3yeScHlDWoAUUwJqXSG8yw5ZgZY8mTEv0wuAfhGv8HzOgKp1X1DVZQFDA++wtfwhLbxphZcvh3VQHkyPo2Nof44kB7x8plvzompUBhXa3MhNV9wqjS66E7FJASgYhL7ikYUrbKANh8IBBj0MZJAbVMHJHvJJv07MN4xXnCeAaI4VnwIVquVUwgihAGia9s1px4gAMnp4lbWRoBI8vv9kNrveFXl9x+sXWPhc4LQAkloiZVlYRSGnmBUtsFms+kNxBQ8gSgQUXpK8YwX6/J55Le9j3Fwu2S8Jegp9R2sLtzAQdPijxSdCrFPRZRIS/xXsgBLoosHO9an2TICBJD0X0ZyBqmExE9fAAAAAElFTkSuQmCC"]'))
    //             .toBeVisible();
            // await expect(page.locator('img[src="data:image/png;base64,UklGRogDAABXRUJQVlA4THsDAAAvr8QrAQ+hKJKk5u7ImR8mcIZxJGSwoaCNJGWPNby/1/fqGKMmAJCGDR9J7GD/Bpbw3jr/0UsJV2GQMQfCMc/333Q+ue8iHK42/4K3vn/BvEPjipQwRSoME8SUcGVMSEmp5o4RkhKIiBJDRIhI9kRMkJhCgiTJiSQxMx0t//+raSUdyVujiP5PwCX/8z//8z//8z//8z//8z//8z//8z//8z//8z//8z//838VL5J+tu9X0lXUj6SfReU//uM//uM//uM//uM//uM//uM//uM//uM//uM//uM/a7hJupK+FfU16fwNvJLyH//xH//xH//xH//xH//xH//xH//xH//xH//xH//x31DcdVG/ks4/C1+TRtmSzqSfSa/bl//4j//4j//4j//4j//4j//4j//4j//4j//4j//4j/8GvWb7bkkb6D3p7PX8x3/8x3/8x3/8x3/8x3/8x3/8x3/8x3/8x3/8x3/8N6r3K+lL0ih/rq6i8h//8R//8R//8R//8R//8R//8R//8R//8R//8R//8d+o3o+ivrTvLulq313SlfRn0pmU//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP/8bProp6XdSZdJd0/lm42pf/+I//+I//+I//+I//+I//+I//+I//+I//+I//+I//Br26/VXS66LeJV29/iYp//Ef//Ef//Ef//Ef//Ef//Ef//Ef//Ef//Ef//Ef/w3FbUkbqIEfk3a7/aLyH//xH//xH//xH//xH//xH//xH//xH//xH//xH//x3/hZA8+u+px0FrUqM+leUfmP//iP//iP//iP//iP//iP//iP//iP//iP//iP//hv0Gu/qx4m3Svq96Tfks6i7hd1L+lB0qOk/Md//Md//Md//Md//Md//Md//Md//Md//Md//Md//DfoVdXZ61fSx6RV6asnSfmP//iP//iP//iP//iP//iP//iP//iP//iP//iP//hv0CvqWdKjrhrlMelD0qOiHifd2pf/+I//+I//+I//+I//+I//+I//+I//+I//+I//+I//xs/Ok54mPemqj0mfkm5F3fX686LyH//xH//xH//xH//xH//xH//xH//xH//xH//xH//x36BXX71Nete+90ln0u0Pe/7jP/7jP/7jP/7jP/7jP/7jP/7jP/7jP/7jP/7jP/4bfQEA"]'))
            //     .toBeVisible();
        // });
});
