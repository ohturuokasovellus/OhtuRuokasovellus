import { test, expect } from '@playwright/test';
import { sql, insertRestaurant } from '../backend/database';
import { insertUser,
    updateUserRestaurantByEmail } from '../backend/databaseUtils/user';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE`;
    await insertUser('test', hash('Test123!'), 'test@test.com', '2000',
        'other', 'primary', 'below 1500'
    );
    const restaurantId = await insertRestaurant('testaurant');
    await updateUserRestaurantByEmail('test@test.com', restaurantId);
};

test.describe('registration page', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/register');
        await page.locator('#language-toggle').click();
    });

    test('page elements are displayed correctly', async ({ page }) => {
        // fields
        await expect(page.locator('#username-input')).toBeVisible();
        await expect(page.locator('#email-input')).toBeVisible();
        await expect(page.locator('#birth-year-input')).toBeVisible();
        await expect(page.getByText('Gender')).toBeVisible();
        await expect(page.getByText('Education')).toBeVisible();
        await expect(page.getByText('Monthly income')).toBeVisible();
        await expect(page.locator('#password-input')).toBeVisible();
        await expect(page.locator('#confirm-password-input')).toBeVisible();
        await expect(page.locator('#terms-checkbox')).toBeVisible();
        await expect(page.locator('#privacy-checkbox')).toBeVisible();
        await expect(page.locator('#link-to-terms')).toBeVisible();
        await expect(page.locator('#link-to-privacy')).toBeVisible();

        // login link
        await page.locator('#login-link').click();
        await expect(page).toHaveURL(/\/login$/);

        // redirects to home if logged in
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('test');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL(/\/home$/);
        await page.goto('/register');
        await expect(page).toHaveURL(/\/home$/);
    });

    test('registers user with correct details', async ({ page }) => {
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('best');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('best@test.com');
        await page.locator('#birth-year-input').click();
        await page.locator('#birth-year-input').fill('2000');
        await page.getByText('Gender').click();
        await page.getByText('Woman').click();
        await page.getByText('Education').click();
        await page.getByText('Secondary education').click();
        await page.getByText('Monthly income').click();
        await page.getByText('<1500 €/kk').click();
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#terms-checkbox').click();
        await page.locator('#privacy-checkbox').click();
        await page.locator('#register-button').click();

        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[id="username-input"]', 'best');
        await page.fill('input[id="password-input"]', 'Test123!');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL('/home');
        await expect(page.locator('#restaurant-page-button'))
            .not.toBeVisible();
    });

    test('registers restaurant with correct details', async ({ page }) => {
        await page.locator('#restaurant-checkbox').click();
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input').fill('testaurant');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('best');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('best@test.com');
        await page.locator('#birth-year-input').click();
        await page.locator('#birth-year-input').fill('2000');
        await page.getByText('Gender').click();
        await page.getByText('Woman').click();
        await page.getByText('Education').click();
        await page.getByText('Secondary education').click();
        await page.getByText('Monthly income').click();
        await page.getByText('<1500 €/kk').click();
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#terms-checkbox').click();
        await page.locator('#privacy-checkbox').click();
        await page.locator('#register-button').click();

        // cannot register with duplicate restaurant
        await expect(page).toHaveURL(/\/register$/);
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input').fill('bestaurant');
        await expect(page.locator('#password-input')).toHaveValue('');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await expect(page.locator('#confirm-password-input')).toHaveValue('');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#register-button').click();

        await expect(page).toHaveURL(/\/login$/);
        await page.fill('input[id="username-input"]', 'best');
        await page.fill('input[id="password-input"]', 'Test123!');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL('/home');
        await expect(page.locator('#restaurant-page-button'))
            .toBeVisible();
    });

    test('cannot register without filling the form', async ({ page }) => {
        await page.locator('#restaurant-checkbox').click();
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register$/);
        await expect(page.locator('#root'))
            .toContainText('Restaurant name is required');
        await expect(page.locator('#root'))
            .toContainText('Username is required');
        await expect(page.locator('#root'))
            .toContainText('Email is required');
        await expect(page.locator('#root'))
            .toContainText('Year of birth is required');
        await expect(page.locator('#root'))
            .toContainText('Gender is required');
        await expect(page.locator('#root'))
            .toContainText('Education is required');
        await expect(page.locator('#root'))
            .toContainText('Monthly income is required');
        await expect(page.locator('#root'))
            .toContainText('Password is required');
        await expect(page.locator('#root'))
            .toContainText('Password confirmation is required');
    });

    test('cannot register with invalid details', async ({ page }) => {
        await page.getByText('Gender').click();
        await page.getByText('Woman').click();
        await page.getByText('Education').click();
        await page.getByText('Secondary education').click();
        await page.getByText('Monthly income').click();
        await page.getByText('<1500 €/kk').click();

        // invalid restaurant name
        await page.locator('#restaurant-checkbox').click();
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input').fill('te');
        await page.locator('#username-input').click();
        await expect(page.locator('#root'))
            .toContainText('Restaurant name must be at least 3 characters');
        await page.locator('#restaurant-name-input').click();
        await page.locator('#restaurant-name-input')
            .fill('123456789012345678901234567890123');
        await expect(page.locator('#root'))
            .toContainText('Restaurant name cannot exceed 32 characters');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register$/);

        // invalid username
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('te');
        await page.locator('#email-input').click();
        await expect(page.locator('#root'))
            .toContainText('Username must be at least 3 characters');
        await page.locator('#username-input').click();
        await page.locator('#username-input')
            .fill('123456789012345678901234567890123');
        await expect(page.locator('#root'))
            .toContainText('Username cannot exceed 32 characters');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register$/);

        // invalid email
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test');
        await page.locator('#username-input').click();
        await expect(page.locator('#root')).toContainText('Invalid email');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.com');
        await page.locator('#email-input').fill('test@test');
        await page.locator('#username-input').click();
        await expect(page.locator('#root')).toContainText('Invalid email');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('test@test.com');
        await page.locator('#email-input').fill('test@test@');
        await page.locator('#username-input').click();
        await expect(page.locator('#root')).toContainText('Invalid email');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register$/);

        // invalid year of birth
        await page.locator('#birth-year-input').click();
        await page.locator('#birth-year-input').fill('t');
        await expect(page.locator('#root'))
            .toContainText('The year must be a number');
        await page.locator('#birth-year-input').fill('1899');
        await expect(page.locator('#root'))
            .toContainText('The year cannot be before 1900');
        await page.locator('#birth-year-input').fill('2010');
        await expect(page.locator('#root'))
            .toContainText('You must be over 15 to register');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register$/);

        // invalid password
        await page.locator('#password-input').click();
        await page.locator('#password-input').fill('test');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText('Password must be at least 8 characters');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('123456789012345678901234567890123');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText('Password cannot exceed 32 characters');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('TESTTEST');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText(
                'Password must contain at least one lowercase letter'
            );
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('testtest');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText(
                'Password must contain at least one uppercase letter'
            );
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('testTEST');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText('Password must contain at least one number');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('test123A');
        await page.locator('#confirm-password-input').click();
        await expect(page.locator('#root'))
            .toContainText(
                'Password must contain at least one special character'
            );
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register$/);

        // passwords do not match
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123');
        await page.locator('#username-input').click();
        await expect(page.locator('#root'))
            .toContainText('Passwords must match');
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register$/);

        // t&c and privacy policy are not accepted
        await page.locator('#restaurant-checkbox.click');
        await page.locator('#username-input').click();
        await page.locator('#username-input').fill('best');
        await page.locator('#email-input').click();
        await page.locator('#email-input').fill('best@test.com');
        await page.locator('#birth-year-input').click();
        await page.locator('#birth-year-input').fill('2000');
        await page.locator('#password-input').click();
        await page.locator('#password-input')
            .fill('Test123!');
        await page.locator('#confirm-password-input').click();
        await page.locator('#confirm-password-input').fill('Test123!');
        await page.locator('#terms-checkbox').click();
        await page.locator('#privacy-checkbox').click();
        await page.locator('#register-button').click();
        await page.locator('#register-button').click();
        await expect(page).toHaveURL(/\/register$/);
    });

    test('cannot register with duplicate username or email',
        async ({ page }) => {
            await page.locator('#birth-year-input').click();
            await page.locator('#birth-year-input').fill('2000');
            await page.getByText('Gender').click();
            await page.getByText('Woman').click();
            await page.getByText('Education').click();
            await page.getByText('Secondary education').click();
            await page.getByText('Monthly income').click();
            await page.getByText('<1500 €/kk').click();
            await page.locator('#terms-checkbox').click();
            await page.locator('#privacy-checkbox').click();

            // duplicate username
            await page.locator('#username-input').click();
            await page.locator('#username-input').fill('test');
            await page.locator('#email-input').click();
            await page.locator('#email-input').fill('test@test.fi');
            await page.locator('#password-input').click();
            await page.locator('#password-input')
                .fill('Test123!');
            await page.locator('#confirm-password-input').click();
            await page.locator('#confirm-password-input').fill('Test123!');
            await page.locator('#register-button').click();
            await expect(page).toHaveURL(/\/register$/);
            await expect(page.locator('#root'))
                .toContainText('username already exists');

            // duplicate email
            await page.locator('#username-input').click();
            await page.locator('#username-input').fill('test2');
            await page.locator('#email-input').click();
            await page.locator('#email-input').fill('test@test.com');
            await page.locator('#password-input').click();
            await page.locator('#password-input')
                .fill('Test123!');
            await page.locator('#confirm-password-input').click();
            await page.locator('#confirm-password-input').fill('Test123!');
            await page.locator('#register-button').click();
            await expect(page).toHaveURL(/\/register$/);
            await expect(page.locator('#root'))
                .toContainText('email already exists');
        });
});
