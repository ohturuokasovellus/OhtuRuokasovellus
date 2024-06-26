/* eslint-disable @stylistic/js/indent */
import { test, expect } from '@playwright/test';
import {
    sql, insertUser,
    insertRestaurant,
    updateUserRestaurantByEmail
} from '../backend/database';
import { hash } from '../backend/services/hash';

const testSurveyUrl = 'fi.wikipedia.org/';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE urls RESTART IDENTITY CASCADE`;
    await sql`
    INSERT INTO urls (name, url) VALUES ('survey', ${testSurveyUrl})
    `;
    await insertRestaurant('testaurant');

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

    await updateUserRestaurantByEmail('test@test.com', 1);
};

test.describe('home page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/home');
        await page.locator('#language-toggle').click();
    });

    test('redirects to login page if not logged in',
        async ({ page }) => {
            await expect(page).toHaveURL(/\/login$/);
        });

    test('home page is displayed correctly for regular users',
        async ({ page }) => {
        await page.locator('#navigation-login').click();
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test2');
        await page.locator('#password-input').click();
        await page.locator('#password-input').fill('Best456@');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL(/\/home$/);
        await expect(page.locator('text=Welcome, test2')).toBeVisible();
        await expect(page.locator('#survey-link'))
            .toBeVisible();
        await expect(page.locator('#add-users-button'))
            .not.toBeVisible();
        await expect(page.locator('#restaurant-page-button'))
            .not.toBeVisible();
        await expect(page.locator('#restaurant-menu-button'))
            .not.toBeVisible();
        await page.locator('#history-button').click();
        await expect(page).toHaveURL(/\/history$/);
        await page.goto('/home');
        await page.locator('#settings-button').click();
        await expect(page).toHaveURL(/\/settings$/);
        await page.locator('#navigation-logout').click();
        await expect(page).toHaveURL(/\/login$/);
    });

    test('home page is displayed correctly for restaurant users',
        async ({ page }) => {
        await page.locator('#navigation-login').click();
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test');
        await page.locator('#password-input').click();
        await page.locator('#password-input').fill('Test123!');
        await page.locator('#login-button').click();
        await expect(page.locator('#root'))
            .toContainText('You are logged in as a restaurant user.');
        await expect(page.locator('#root'))
            .toContainText('Manage restaurant meals');
        await expect(page.locator('#history-button'))
            .toBeVisible();
        await expect(page.locator('#settings-button'))
            .toBeVisible();
        await expect(page.locator('#survey-link'))
            .toBeVisible();
        await page.locator('#add-users-button').click();
        await expect(page).toHaveURL(/\/add-users$/);
        await page.goto('/home');
        await page.locator('#restaurant-page-button').click();
        await expect(page).toHaveURL('/restaurant/1');
        await page.goto('/home');
        await page.locator('#restaurant-menu-button').click();
        await expect(page).toHaveURL('/menu-qr/1');
    });
});
