import { test as base } from '../fixtures/init'
import Gmail from '../apis/gmail.api'
import Attestation from '../pages/attestation.page'

const test = base.extend<{
    attestation: Attestation
    gmail: Gmail
}>({
    attestation: async ({page}, use) => {
        const attestation = new Attestation(page)
        await use(attestation)
    },
    gmail: async ({}, use) => {
        const gmail = new Gmail()
        await use(gmail)
    },
})

export default test
export const expect = test.expect