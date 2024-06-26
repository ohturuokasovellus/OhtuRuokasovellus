import { sql, insertUser } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const initTestDB = async () => {
    await sql`SET client_min_messages TO WARNING`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE urls RESTART IDENTITY CASCADE`;
    const user = 'testi';
    const password = hash('Testi123@');
    const email = 'testi@test.com';
    const birthYear = '2000';
    const gender = 'other';
    const education = 'primary';
    const income = 'below 1500';
    await insertUser(user, password, email, birthYear,
        gender, education, income
    );
    await sql`
    INSERT INTO urls (name, url) VALUES ('survey', 'https://fi.wikipedia.org')
    `;
};

const deleteSurveyUrl = async () => {
    await sql`
    DELETE FROM urls WHERE name = 'survey'
    `;
};

test.describe('survey', () => {
    test.beforeEach(async ({ page }) => {
        await initTestDB();
        await page.goto('/login');
        await page.locator('#language-toggle').click();
        await page.fill('input[id="username-input"]', 'testi');
        await page.fill('input[id="password-input"]', 'Testi123@');
        await page.locator('#login-button').click();
    });

    test('survey link displays on the homepage and it opens in a new tab',
        async ({ page, context }) => {
            await expect(page.locator('text=Take a survey')).toBeVisible();

            const [newPage] = await Promise.all([
                context.waitForEvent('page'),
                page.click('text=Take a survey')
            ]);

            await newPage.waitForLoadState();
            await expect(newPage).toHaveURL(/fi\.wikipedia\.org/);

        });

    test('survey link does not display if survey link does not exist',
        async ({page}) => {
            await deleteSurveyUrl();
            await expect(page.locator('text=Take a survey')).toHaveCount(0);
        });
});
