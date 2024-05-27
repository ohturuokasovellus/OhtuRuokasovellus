// import { test, expect } from '@playwright/test';
// import {
//     sql, insertUser,
//     insertRestaurant,
// } from '../backend/database';
// import { hash } from '../backend/services/hash';

// const initTestDB = async () => {
//     await sql`SET client_min_messages TO WARNING`;
//     await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
//     await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;

//     await insertRestaurant('testaurant');

//     const users = [
//         {
//             username: 'test',
//             password: 'Test123!',
//             email: 'test@test.com',
//             restaurantId: 1
//         },
//         {
//             username: 'test2',
//             password: 'Best456@',
//             email: 'test2@test.com',
//             restaurantId: null
//         }
//     ];

//     for (const user of users) {
//         // eslint-disable-next-line id-length
//         const pw = hash(user.password);
//         await insertUser(user.username, pw, user.email, user.restaurantId);
//     }
// };

// test.describe('home page', () => {
//     test.beforeEach(async ({ page }) => {
//         await initTestDB();
//         await page.goto('/');
//     });

//     test('redirects to login if not currently logged in',
//         async ({ page }) => {
//             await expect(page).toHaveURL(/\/login$/);
//         });

//     test('displays regular user page correctly',
//         async ({ page }) => {
//             await page.getByPlaceholder('Username').click();
//             await page.getByPlaceholder('Username').fill('test2');
//             await page.getByPlaceholder('Password').click();
//             await page.getByPlaceholder('Password').fill('Best456@');
//             await page.getByText('login').click();
//             // await page.waitForURL('/');
//             // await expect(page).toHaveURL('/');
//             await page.goto('/');
//             await expect(page.locator('#root'))
//                 .toContainText('Welcome, test2');
//         });

//     test('displays restaurant user page correctly',
//         async ({ page }) => {
//             await page.goto('/login');
//             await page.getByPlaceholder('Username').click();
//             await page.getByPlaceholder('Username').fill('test');
//             await page.getByPlaceholder('Password').click();
//             await page.getByPlaceholder('Password').fill('Test123!');
//             await page.getByText('login').click();
//             await page.goto('/');
//             // await page.waitForURL('/');
//             // await expect(page).toHaveURL('/');
//             await expect(page.locator('#root'))
//                 .toContainText('Welcome, test');
//             await expect(page.locator('#root'))
//                 .toContainText('You are logged in as a restaurant user.');
//             await expect(page.getByText('add user')).toBeVisible();
//             await expect(page.getByText('restaurant page')).toBeVisible();
//         });

//     test('restaurant user view navigation works',
//         async ({ page }) => {
//             await page.goto('/login');
//             await page.getByPlaceholder('Username').click();
//             await page.getByPlaceholder('Username').fill('test');
//             await page.getByPlaceholder('Password').click();
//             await page.getByPlaceholder('Password').fill('Test123!');
//             await page.getByText('login').click();
//             await page.goto('/');
//             // await page.waitForURL('/');
//             await page.getByText('add user').click();
//             await expect(page).toHaveURL(/\/add-users$/);
//             await page.getByRole('link', { name: 'back to home' }).click();
//             await page.waitForURL('/');
//             // await page.getByText('restaurant page').click();
//             // await expect(page).toHaveURL(/\/restaurant\//);
//         });
// });
