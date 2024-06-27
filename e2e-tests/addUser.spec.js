import { test, expect } from '@playwright/test';
import { sql } from '../backend/database';
import { insertRestaurant} from '../backend/databaseUtils/restaurant';
import { insertUser, 
    updateUserRestaurantByEmail } from '../backend/databaseUtils/user';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;

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
        },
        {
            username: 'test3',
            password: 'Rest789+',
            email: 'test3@test.com',
            birthYear: '2000',
            gender: 'other',
            education: 'primary',
            income: 'below 1500',
        },
        {
            username: 'test4',
            password: 'Zest_000',
            email: 'test4@test.com',
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

test.describe('adding restaurant users: unauthorised', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
        await page.locator('#language-toggle').click();
    });

    test('redirects to home if a normal user tries to access the page',
        async ({ page }) => {
            await page.goto('/login');
            await page.getByPlaceholder('Username').click();
            await page.getByPlaceholder('Username').fill('test2');
            await page.getByPlaceholder('Password').click();
            await page.getByPlaceholder('Password').fill('Best456@');
            await page.locator('#login-button').click();

            await page.waitForURL('/home');
            await expect(page.locator('text=Welcome,')).toBeVisible();

            await page.goto('/add-users');
            await page.waitForURL('/home');
            await expect(page.locator('text=Welcome,')).toBeVisible();
        });

    test('redirects to login if user is not logged in',
        async ({ page }) => {
            await page.goto('/add-users');
            await expect(page).toHaveURL(/\/login$/);
        });
});

test.describe('adding restaurant users: authorised', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
        await page.locator('#language-toggle').click();
        await page.getByPlaceholder('Username').click();
        await page.getByPlaceholder('Username').fill('test');
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill('Test123!');
        await page.locator('#login-button').click();
        await page.getByText('add user').click();
    });

    test('user can go back to home page', async ({ page }) => {
        await page.getByRole('link', { name: 'back to home' }).click();
        await expect(page).toHaveURL('/home');
    });

    test('cannot add more than 10 email fields at once', async ({ page }) => {
        // eslint-disable-next-line id-length
        for (let i = 1; i < 10; i++) {
            await page.locator('#add-email-button').click();
        }

        await expect(page.locator('#add-email-button'))
            .not
            .toBeVisible();
    });

    test('restaurant user can add one user to their restaurant',
        async ({ page }) => {
            await page.getByPlaceholder('email').click();
            await page.getByPlaceholder('email').fill('test2@test.com');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('Test123!');
            await page.locator('#add-users-button').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('users have been successfully processed!');
            await expect(page.locator('#root'))
                .toContainText('test2@test.com: user added successfully');
        });

    test('restaurant user can add multiple users to their restaurant',
        async ({ page }) => {
            await page.getByPlaceholder('email').click();
            await page.getByPlaceholder('email').fill('test2@test.com');
            await page.getByText('+').click();
            await page.getByPlaceholder('email').nth(1).click();
            await page.getByPlaceholder('email').nth(1).fill('test3@test.com');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('Test123!');
            await page.locator('#add-users-button').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('users have been successfully processed!');
            await expect(page.locator('#root'))
                .toContainText('test2@test.com: user added successfully');
            await expect(page.locator('#root'))
                .toContainText('test3@test.com: user added successfully');
        });

    test('restaurant user can remove an email from the users-to-add listing',
        async ({ page }) => {
            await page.getByText('+').click();
            await expect(page.getByPlaceholder('email').nth(1)).toBeVisible();
            await page.getByText('–').nth(1).click();
            await expect(page.getByPlaceholder('email').nth(1))
                .toBeHidden();
        });

    test('users are not added if the emails do not exist',
        async ({ page }) => {
            await page.getByPlaceholder('email').click();
            await page.getByPlaceholder('email').fill('does@not.exist');
            await page.getByText('+').click();
            await page.getByPlaceholder('email').nth(1).click();
            await page.getByPlaceholder('email').nth(1).fill('not an email');
            await page.getByText('+').click();
            await page.getByPlaceholder('email').nth(2).click();
            await page.getByPlaceholder('email').nth(2).fill('');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('Test123!');
            await page.locator('#add-users-button').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('users have been successfully processed!');
            await expect(page.locator('#root'))
                .toContainText('does@not.exist: email does not exist');
            await expect(page.locator('#root'))
                .toContainText('not an email: email does not exist');
            await expect(page.locator('#root'))
                .toContainText(' : email does not exist');
        });

    test('users are not added if they are already part of a restaurant',
        async ({ page }) => {
            await updateUserRestaurantByEmail('test4@test.com', 1);
            await page.getByPlaceholder('email').click();
            await page.getByPlaceholder('email').fill('test4@test.com');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('Test123!');
            await page.locator('#add-users-button').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('users have been successfully processed!');
            await expect(page.locator('#root'))
                .toContainText(
                    // eslint-disable-next-line @stylistic/js/max-len
                    'test4@test.com: user is already associated with a restaurant'
                );
        });

    test('users are not added without password validation',
        async ({ page }) => {
            await page.getByPlaceholder('email').click();
            await page.getByPlaceholder('email').fill('test2@test.com');
            await page.locator('#add-users-button').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('invalid password');
            await page.getByPlaceholder('email').click();
            await page.getByPlaceholder('email').fill('test2@test.com');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('incorrect');
            await page.locator('#add-users-button').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('invalid password');
            await page.getByPlaceholder('confirm with password').click();
            await page.getByPlaceholder('confirm with password')
                .fill('Test123!');
            await page.locator('#add-users-button').click();
            await expect(page).toHaveURL(/\/add-users$/);
            await expect(page.locator('#root'))
                .toContainText('users have been successfully processed!');
            await expect(page.locator('#root'))
                .toContainText('test2@test.com: user added successfully');
        });
});
