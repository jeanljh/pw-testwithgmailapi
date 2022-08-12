import { request } from "@playwright/test";
import data from '../fixtures/data.json'

export default class Gmail {

    private token: string = ''

    apiContext = async (url: string) => {
        return await request.newContext({
            baseURL: url,
            extraHTTPHeaders: {
                Authorization: this.token
            }
        })
    }

    getAccessToken = async () => {
        const req = await this.apiContext(data.urlToken)
        const res = await req.post('', {
            params: {
                client_id: data.client_id,
                client_secret: data.client_secret,
                refresh_token: data.refresh_token,
                grant_type: data.grant_type
            }
        })
        const {access_token} = await res.json()
        this.token = `Bearer ${access_token}`
    }

    getAttestation = async () => {
        const req = await this.apiContext(data.urlMessages)
        let res = await req.get('')
        const body = await res.json()
        if (body.resultSizeEstimate > 0) {
            res = await req.get('' + body.messages[0].id)
            const { snippet } = await res.json()
            return snippet.split(' ')[2]
        }
        return null
    }

    getAttestationWithRetry = async (maxRetries: number): Promise<any> => {
        if (!maxRetries) return null
        const code = await this.getAttestation()
        if (!code) {
            await this.wait(2000)
            return await this.getAttestationWithRetry(maxRetries - 1)
        }
        return code
    }

    clearInbox = async () => {
        let req = await this.apiContext(data.urlMessages)
        let res = await req.get('')
        const body = await res.json()
        if (body.resultSizeEstimate > 0) {
            for (const {id} of body.messages) {
                await req.delete('' + id)  
            }
        }
    }

    wait = async (duration: number) => new Promise(resolve => setTimeout(resolve, duration))
}