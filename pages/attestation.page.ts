import { expect, Page } from '@playwright/test'

export default class Attestation {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    inputEmail = () => this.page.locator('#value')
    btnSubmit = () => this.page.locator('#submitBtn')
    textCode = (id: number) => this.page.locator(`#code${id}`)
    btnConfirm = () => this.page.locator('div.input-div > button')
    divWalletConnect = () => this.page.locator('div.walletconnect-modal__base')

    navHome = async () => {
        await this.page.goto('')
        await this.page.waitForLoadState()
    }

    enterAttestationCode = async (code: string) => {
        for (let i = 0; i < code.length; i++) {
            await this.textCode(i).fill(code[i])
        }
        await this.textCode(5).type('Tab')
        await expect(this.btnConfirm()).toBeEnabled()
        await this.btnConfirm().click()
    }
}