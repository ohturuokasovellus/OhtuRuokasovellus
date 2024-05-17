import { test, expect } from '@playwright/test';

test('root redirects to login page', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login$/)
})
