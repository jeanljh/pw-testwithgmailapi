import { test as base, BrowserContext, Page, chromium } from '@playwright/test'

export const test = base.extend<{
    browserContext: BrowserContext
    page: Page
}>({
    browserContext: async ({}, use) => {
        const browser = await chromium.launch()
        const browserContext = await browser.newContext()
        await browserContext.grantPermissions(['clipboard-read', 'clipboard-write'])
        await use(browserContext)
    },
    page: async ({browserContext}, use) => {
        const page = await browserContext.newPage()
        await use(page)
    },
})