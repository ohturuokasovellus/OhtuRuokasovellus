import { sql } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

const testSurveyUrl = 'http://127.0.0.1:8080/create-meal';
const prodSurveyUrl = 'http://localhost:19006/create-meal';

const initTestDB = async () => {
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE urls RESTART IDENTITY CASCADE`;
    const user = 'testi';
    // eslint-disable-next-line id-length
    const pw = hash('Testi123@');
    const email = 'testi@test.com';
    await sql`
    INSERT INTO users (username, password, email)
    VALUES (${user}, ${pw}, ${email})
    `;
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
        await page.click('text=login');
    });

    test('survey link displays on the homepage', async ({page}) => {
        await expect(page.locator('text=Take a survey')).toBeVisible();
        await page.click('text=Take a survey');
        await expect(page).toHaveURL('/create-meal');
    });

    test('survey link does not display if survey link does not exist',
        async ({page}) => {
            deleteSurveyUrl();
            await expect(page.locator('text=Take a survey')).toHaveCount(0);
            restoreDB();
        });
});
