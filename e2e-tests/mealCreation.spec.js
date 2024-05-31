import { test, expect } from '@playwright/test';
import path from 'node:path';

test.describe('meal creation page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/create-meal');
    });

    test('does not create a meal without name', async ({page}) => {
        await page.click('text=Create a meal');
        await expect(page).toHaveURL('/create-meal');
        await expect(page.locator('#root'))
            .toContainText('Name for the meal is required');
    });

    test('does not create a meal without image selected', async ({page}) => {
        await page.fill('input[placeholder="Name of the meal"]', 'ruoka');
        await page.click('text=Create a meal');
        await expect(page).toHaveURL('/create-meal');
        await expect(page.locator('#root'))
            .toContainText('Image of the meal is required');
    });

    test('creating a meal works with name and a image', async ({ page}) => {
        await page.fill('input[placeholder="Name of the meal"]', 'ruoka');
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.click('text=Select image from device');
        const fileChooser = await fileChooserPromise;
        const filePath = path.join(__dirname, 'assets', 'image.png');
        await fileChooser.setFiles(filePath);
        expect(page.getByRole('img')).toBeDefined();
    });
});
