import {
    sql, insertRestaurant, insertUser,
    addMealImage, updateUserRestaurantByEmail
} from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';
import { convertKJ2Kcal } from '../src/utils/KJKcalConverter';

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
        50, 'gluteeni, selleri', 1.3, 11.7, 8.2, 0.1, 0.1, 654.7, 1.9,
        523, 0, 1230),
        ('Pannacotta', ${restaurantId}, 'abcdefgh',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit
        esse cillum dolore eu fugiat nulla pariatur.', 2,
        'maito, kananmuna', 27.4, 2.9, 16.3, 0, 27.4, 78.5, 10.9,
        1119, 0, 950)`;

    // eslint-disable-next-line @stylistic/js/max-len, no-undef
    await addMealImage(1, Buffer.from('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAktJREFUOE91k19IU3EUx7+32px6EYoKiUijyAYRYfS4YRGhhUbEInrQ/hCoQQVSo5FZPowsIhSiB0lYQTOVCpO0EUHMhxI0InG0FNesbczQsrm23fLGOdff5S7pvJxzfueczzm/87tXisWTKgAk5hVSusj5piz/fzkSATLKQlay2bSMfYISqNzxCKlkIivH9/QE+9L45A+egER0FdOYzctRdaybY2drtLS6cz2sN26tQF9XNXiCZ50eVB6t4UD13p24/3JY7/a8r1O3Z/vdur2ywgX77sOQ2tvuqt+no9hTdQSXTjmQazZh9uc8OgZGcGZ/EUrWyegJnURkopmLbzk2s27oHkcsntQA20p38eH7d0H0e64zoMv/AWUH7mFfQQsDGkofwjWwBe7yIOeSPfTmAaSbjVf4cr9SaQy+6OUJ2M8oCOfUsz03M80Ao3yeScHlDWoAUUwJqXSG8yw5ZgZY8mTEv0wuAfhGv8HzOgKp1X1DVZQFDA++wtfwhLbxphZcvh3VQHkyPo2Nof44kB7x8plvzompUBhXa3MhNV9wqjS66E7FJASgYhL7ikYUrbKANh8IBBj0MZJAbVMHJHvJJv07MN4xXnCeAaI4VnwIVquVUwgihAGia9s1px4gAMnp4lbWRoBI8vv9kNrveFXl9x+sXWPhc4LQAkloiZVlYRSGnmBUtsFms+kNxBQ8gSgQUXpK8YwX6/J55Le9j3Fwu2S8Jegp9R2sLtzAQdPijxSdCrFPRZRIS/xXsgBLoosHO9an2TICBJD0X0ZyBqmExE9fAAAAAElFTkSuQmCC'));
    // eslint-disable-next-line @stylistic/js/max-len, no-undef
    await addMealImage(2, Buffer.from('data:image/png;base64,UklGRogDAABXRUJQVlA4THsDAAAvr8QrAQ+hKJKk5u7ImR8mcIZxJGSwoaCNJGWPNby/1/fqGKMmAJCGDR9J7GD/Bpbw3jr/0UsJV2GQMQfCMc/333Q+ue8iHK42/4K3vn/BvEPjipQwRSoME8SUcGVMSEmp5o4RkhKIiBJDRIhI9kRMkJhCgiTJiSQxMx0t//+raSUdyVujiP5PwCX/8z//8z//8z//8z//8z//8z//8z//8z//8z//8z//838VL5J+tu9X0lXUj6SfReU//uM//uM//uM//uM//uM//uM//uM//uM//uM//uM/a7hJupK+FfU16fwNvJLyH//xH//xH//xH//xH//xH//xH//xH//xH//xH//x31DcdVG/ks4/C1+TRtmSzqSfSa/bl//4j//4j//4j//4j//4j//4j//4j//4j//4j//4j/8GvWb7bkkb6D3p7PX8x3/8x3/8x3/8x3/8x3/8x3/8x3/8x3/8x3/8x3/8N6r3K+lL0ih/rq6i8h//8R//8R//8R//8R//8R//8R//8R//8R//8R//8d+o3o+ivrTvLulq313SlfRn0pmU//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP/8bProp6XdSZdJd0/lm42pf/+I//+I//+I//+I//+I//+I//+I//+I//+I//+I//Br26/VXS66LeJV29/iYp//Ef//Ef//Ef//Ef//Ef//Ef//Ef//Ef//Ef//Ef/w3FbUkbqIEfk3a7/aLyH//xH//xH//xH//xH//xH//xH//xH//xH//xH//x3/hZA8+u+px0FrUqM+leUfmP//iP//iP//iP//iP//iP//iP//iP//iP//iP//hv0Gu/qx4m3Svq96Tfks6i7hd1L+lB0qOk/Md//Md//Md//Md//Md//Md//Md//Md//Md//Md//DfoVdXZ61fSx6RV6asnSfmP//iP//iP//iP//iP//iP//iP//iP//iP//iP//hv0CvqWdKjrhrlMelD0qOiHifd2pf/+I//+I//+I//+I//+I//+I//+I//+I//+I//+I//xs/Ok54mPemqj0mfkm5F3fX686LyH//xH//xH//xH//xH//xH//xH//xH//xH//xH//x36BXX71Nete+90ln0u0Pe/7jP/7jP/7jP/7jP/7jP/7jP/7jP/7jP/7jP/7jP/4bfQEA'));
};

test.describe('restaurant meal page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/restaurant/1');
        await page.locator('#language-toggle').click();
    });

    test('renders restaurant name, price and their images',
        async ({ page }) => {
            await expect(page.locator('text=Restaurant testaurant'))
                .toBeVisible();

            await expect(page.locator('text=Kana bolognese')).toBeVisible();
            await expect(page.locator('text=Pannacotta')).toBeVisible();
            await expect(page.locator('text=12,30 €')).toBeVisible();
            await expect(page.locator('text=9,50 €')).toBeVisible();

            const images = page.locator('img');
            await expect(images).toHaveCount(2);
            // eslint-disable-next-line @stylistic/js/max-len
            await expect(page.locator('img[src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAktJREFUOE91k19IU3EUx7+32px6EYoKiUijyAYRYfS4YRGhhUbEInrQ/hCoQQVSo5FZPowsIhSiB0lYQTOVCpO0EUHMhxI0InG0FNesbczQsrm23fLGOdff5S7pvJxzfueczzm/87tXisWTKgAk5hVSusj5piz/fzkSATLKQlay2bSMfYISqNzxCKlkIivH9/QE+9L45A+egER0FdOYzctRdaybY2drtLS6cz2sN26tQF9XNXiCZ50eVB6t4UD13p24/3JY7/a8r1O3Z/vdur2ywgX77sOQ2tvuqt+no9hTdQSXTjmQazZh9uc8OgZGcGZ/EUrWyegJnURkopmLbzk2s27oHkcsntQA20p38eH7d0H0e64zoMv/AWUH7mFfQQsDGkofwjWwBe7yIOeSPfTmAaSbjVf4cr9SaQy+6OUJ2M8oCOfUsz03M80Ao3yeScHlDWoAUUwJqXSG8yw5ZgZY8mTEv0wuAfhGv8HzOgKp1X1DVZQFDA++wtfwhLbxphZcvh3VQHkyPo2Nof44kB7x8plvzompUBhXa3MhNV9wqjS66E7FJASgYhL7ikYUrbKANh8IBBj0MZJAbVMHJHvJJv07MN4xXnCeAaI4VnwIVquVUwgihAGia9s1px4gAMnp4lbWRoBI8vv9kNrveFXl9x+sXWPhc4LQAkloiZVlYRSGnmBUtsFms+kNxBQ8gSgQUXpK8YwX6/J55Le9j3Fwu2S8Jegp9R2sLtzAQdPijxSdCrFPRZRIS/xXsgBLoosHO9an2TICBJD0X0ZyBqmExE9fAAAAAElFTkSuQmCC"]'))
                .toBeVisible();
            // eslint-disable-next-line @stylistic/js/max-len
            await expect(page.locator('img[src="data:image/png;base64,UklGRogDAABXRUJQVlA4THsDAAAvr8QrAQ+hKJKk5u7ImR8mcIZxJGSwoaCNJGWPNby/1/fqGKMmAJCGDR9J7GD/Bpbw3jr/0UsJV2GQMQfCMc/333Q+ue8iHK42/4K3vn/BvEPjipQwRSoME8SUcGVMSEmp5o4RkhKIiBJDRIhI9kRMkJhCgiTJiSQxMx0t//+raSUdyVujiP5PwCX/8z//8z//8z//8z//8z//8z//8z//8z//8z//8z//838VL5J+tu9X0lXUj6SfReU//uM//uM//uM//uM//uM//uM//uM//uM//uM//uM/a7hJupK+FfU16fwNvJLyH//xH//xH//xH//xH//xH//xH//xH//xH//xH//x31DcdVG/ks4/C1+TRtmSzqSfSa/bl//4j//4j//4j//4j//4j//4j//4j//4j//4j//4j/8GvWb7bkkb6D3p7PX8x3/8x3/8x3/8x3/8x3/8x3/8x3/8x3/8x3/8x3/8N6r3K+lL0ih/rq6i8h//8R//8R//8R//8R//8R//8R//8R//8R//8R//8d+o3o+ivrTvLulq313SlfRn0pmU//iP//iP//iP//iP//iP//iP//iP//iP//iP//iP/8bProp6XdSZdJd0/lm42pf/+I//+I//+I//+I//+I//+I//+I//+I//+I//+I//Br26/VXS66LeJV29/iYp//Ef//Ef//Ef//Ef//Ef//Ef//Ef//Ef//Ef//Ef/w3FbUkbqIEfk3a7/aLyH//xH//xH//xH//xH//xH//xH//xH//xH//xH//x3/hZA8+u+px0FrUqM+leUfmP//iP//iP//iP//iP//iP//iP//iP//iP//iP//hv0Gu/qx4m3Svq96Tfks6i7hd1L+lB0qOk/Md//Md//Md//Md//Md//Md//Md//Md//Md//Md//DfoVdXZ61fSx6RV6asnSfmP//iP//iP//iP//iP//iP//iP//iP//iP//iP//hv0CvqWdKjrhrlMelD0qOiHifd2pf/+I//+I//+I//+I//+I//+I//+I//+I//+I//+I//xs/Ok54mPemqj0mfkm5F3fX686LyH//xH//xH//xH//xH//xH//xH//xH//xH//xH//x36BXX71Nete+90ln0u0Pe/7jP/7jP/7jP/7jP/7jP/7jP/7jP/7jP/7jP/7jP/4bfQEA"]'))
                .toBeVisible();

        });

    test('closes and opens meal cards correctly', async ({ page }) => {
        await page.locator('#kana-bolognese-button').click();
        await page.locator('#pannacotta-button').click();
        await expect(page.locator('text=Lorem ipsum dolor sit amet'))
            .toBeVisible();
        await expect(page.locator('text=Ut enim ad minim veniam'))
            .toBeVisible();

        await page.locator('#kana-bolognese-button').click();
        await page.locator('#pannacotta-button').click();
        await expect(page.locator('text=Lorem ipsum dolor sit amet'))
            .not.toBeVisible();
        await expect(page.locator('text=Ut enim ad minim veniam'))
            .not.toBeVisible();
    });

    test('renders meal info correctly if selected', async ({ page }) => {
        await page.locator('#kana-bolognese-button').click();
        await expect(page.locator('text=CO2 EMISSIONS: 50')).toBeVisible();
        await expect(page.locator('text=ALLERGENS: gluteeni, selleri'))
            .toBeVisible();
        await expect(page.locator('#doughnut-chart-container')).toBeVisible();
        await expect(page.locator('text=Carbohydrates: 1.3 g')).toBeVisible();
        await expect(page.locator('text=Fat: 8.2 g')).toBeVisible();
        await expect(page.locator('text=Protein: 11.7 g')).toBeVisible();
        await expect(page.locator('#nutritional-values-button')).toBeVisible();
    });

    test('renders nutritional values correctly', async ({ page }) => {
        const kcal = `text=Energy:${convertKJ2Kcal(523)} kcal`;

        await page.locator('#kana-bolognese-button').click();
        await page.locator('#nutritional-values-button').click();
        await expect(page.locator(kcal)).toBeVisible();
        await expect(page.locator('text=Fat:8.2 g')).toBeVisible();
        await expect(page.locator('text=of which saturates:1.9 g'))
            .toBeVisible();
        await expect(page.locator('text=Carbohydrates:1.3 g')).toBeVisible();
        await expect(page.locator('text=of which sugars:0.1 g')).toBeVisible();
        await expect(page.locator('text=Fiber:0.1 g')).toBeVisible();
        await expect(page.locator('text=Protein:11.7 g')).toBeVisible();
        await expect(page.locator('text=Salt:654.7 mg')).toBeVisible();
        await expect(page.locator('text=Nutri-score:')).toBeVisible();
        await expect(page.locator('text="C"')).toBeVisible();
        await expect(page.locator('#nutri-score')).toBeVisible();

        await page.locator('#nutritional-values-button').click();
        await expect(page.locator(kcal)).not.toBeVisible();
        await expect(page.locator('text=Fat:8.2 g')).not.toBeVisible();
        await expect(page.locator('text=of which saturates:1.9 g'))
            .not.toBeVisible();
        await expect(page.locator('text=Carbohydrates:1.3 g'))
            .not.toBeVisible();
        await expect(page.locator('text=of which sugars:0.1 g'))
            .not.toBeVisible();
        await expect(page.locator('text=Fiber:0.1 g')).not.toBeVisible();
        await expect(page.locator('text=Protein:11.7 g')).not.toBeVisible();
        await expect(page.locator('text=Salt:654.7 mg')).not.toBeVisible();
        await expect(page.locator('text=Nutri-score:')).not.toBeVisible();
        await expect(page.locator('text="C"')).not.toBeVisible();
        await expect(page.locator('#nutri-score')).not.toBeVisible();
    });
});
