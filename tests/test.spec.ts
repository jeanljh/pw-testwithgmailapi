import test, { expect } from '../fixtures/modules'
import data from '../fixtures/data.json'

test.describe('Test Suite', async () => {
    test.afterEach(async ({page}) => {
        await page.close()
    })

    test('Test', async ({attestation, gmail}) => {
        await gmail.getAccessToken()
        await gmail.clearInbox()

        await attestation.navHome()
        await attestation.inputEmail().fill(data.email)
        await attestation.inputEmail().press('Space')
        await attestation.btnSubmit().click()
        await attestation.textCode(0).waitFor()

        const code = await gmail.getAttestationWithRetry(5)
        expect(code).not.toBeNull()

        await attestation.enterAttestationCode(code)
        await attestation.divWalletConnect().waitFor()
    })
})