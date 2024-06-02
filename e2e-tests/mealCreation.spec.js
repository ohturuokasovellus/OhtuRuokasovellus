import { test, expect } from '@playwright/test';
import path from 'node:path';

test.describe('meal creation page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/create-meal');
        await page.locator('#language-toggle').click();
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
});
