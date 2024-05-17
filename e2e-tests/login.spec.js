import { test, expect } from '@playwright/test';



test('should display login form and submit successfully', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  // Assuming you want to fill out the login form and submit it
  await page.fill('input[placeholder="Username"]', 'testi');
  await page.fill('input[placeholder="Password"]', 'Testi123@');
  await page.click('text=Login');
  
  // After submission, expect a successful login
  await expect(page).toHaveURL('/'); // Adjust the URL to the expected one after login
});

test('should redirect to registration', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  // Assuming you want to fill out the login form and submit it

  await page.click('text=register');

  // After submission, expect a successful login
  await expect(page).toHaveURL('/register'); // Adjust the URL to the expected one after login
});

test('Password missing', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  // Assuming you want to fill out the login form and submit it
  await page.fill('input[placeholder="Username"]', 'testi');
  await page.click('text=login');
  
  // After submission, expect "password is required" errorText
  await page.waitForSelector('text="Password is required"');

});

test('Username missing', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  // Assuming you want to fill out the login form and submit it
  await page.fill('input[placeholder="Password"]', 'Testi123@');
  await page.click('text=login');
  
  // After submission, expect "password is required" errorText
  await page.waitForSelector('text="Username is required"');

});