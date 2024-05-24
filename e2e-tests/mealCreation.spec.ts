import { sql } from '../backend/database';
import { test, expect } from '@playwright/test';
import { hash } from '../backend/services/hash';

test.describe('meal creation page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/create-meal')
    });

    test('does not create a meal without name', async ({page}) => {
        await page.click('text=Luo ateria');
        await expect(page).toHaveURL('/create-meal');
        await expect(page.locator('#root')).toContainText('Name for the meal is required');
    });

    test('does not create a meal without image selected', async ({page}) => {
        await page.fill('input[placeholder="Aterian nimi"]', 'ruoka');
        await page.click('text=Luo ateria');
        await expect(page).toHaveURL('/create-meal');
        await expect(page.locator('#root')).toContainText('Image of the meal is required');
    });
});
