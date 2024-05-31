import { sql, insertUser } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const testSurveyUrl = 'fi.wikipedia.org/';
const prodSurveyUrl = '/create-meal';

const initTestDB = async () => {
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE urls RESTART IDENTITY CASCADE`;
    const user = 'testi';
    const password = hash('Testi123@');
    const email = 'testi@test.com';
    insertUser(user, password, email);
    await sql`
    INSERT INTO urls (name, url) VALUES ('survey', ${testSurveyUrl})
    `;
};

const restoreDB = async () => {
    await sql`
    UPDATE urls SET url = ${prodSurveyUrl} WHERE name = 'survey'
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
        await page.fill('input[placeholder="Username"]', 'testi');
        await page.fill('input[placeholder="Password"]', 'Testi123@');
        await page.locator('#log_user_in_button').click();
    });

    test('survey link displays on the homepage and it opens in a new tab',
        async ({ page, context }) => {
            await expect(page.locator('text=Take a survey')).toBeVisible();

            const [newPage] = await Promise.all([
                context.waitForEvent('page'),
                page.click('text=Take a survey')
            ]);

            await newPage.waitForLoadState();
            await expect(newPage).toHaveURL(testSurveyUrl);

        });

    test('survey link does not display if survey link does not exist',
        async ({page}) => {
            deleteSurveyUrl();
            await expect(page.locator('text=Take a survey')).toHaveCount(0);
            restoreDB();
        });
});
