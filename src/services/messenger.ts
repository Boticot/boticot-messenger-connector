import { Response } from 'express'
import * as crypto from 'crypto'
import {
	WebhookVerificationRequest,
	WebhookHandlingRequest,
	Entry,
	BoticotData,
	Message,
	Webhook,
} from '../../typings/global'
import {
    sendMessage,
    messageText,
    messageTextAndQuickReplies,
    messageTextUrlAndSuggestions,
    buildQuickReplies,
} from '../utils/messenger';
import { parseNlu, requestIntent } from '../client/nlu'

const TECHNICAL_ERROR_MESSAGE = 'Technical error\nPlease retry later'
const SERVER_ERROR_MESSAGE = 'Server error\nPlease retry later'

class MessengerService {
    public authorizeWebhook(req: WebhookVerificationRequest, res: Response): void {
        let { VERIFY_TOKEN } = process.env
        let mode = req.query['hub.mode']
        let token = req.query['hub.verify_token']
        let challenge = req.query['hub.challenge']

        if (mode && token) {
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.info('Sucess Webhook verification')
                res.status(200).json(parseInt(challenge)).send()
            } else {
                console.error('Webhook verification fails')
                res.sendStatus(403)
            }
        }
    }

    public async handleWebhook(req: WebhookHandlingRequest, res: Response): Promise<void> {
        try {
            let body = req.body;
            if (body.object === 'page') {
                if (this.isValidSignature(req.headers['x-hub-signature'].toString(), req.rawBody)) {
                    body.entry.forEach(entry => this.handleEntry(entry));
                    res.status(200).send('EVENT_RECEIVED');
                } else {
                    res.status(200).send('UNAUTHORIZED_SENDER');
                }
            } else {
                res.sendStatus(404);
            }
        } catch (err) {
            console.error(`Webhook error ${err}`)
            res.sendStatus(500);
        }
    }

    async handleEntry(entry: Entry): Promise<void> {
        let sender_psid: string
        try {
            if (entry.messaging !== undefined) {
                let webhook_event = entry.messaging[0];
                const sender_psid = webhook_event.sender.id
                if (webhook_event.message !== undefined) {
                    if (
                        !Object.prototype.hasOwnProperty.call(webhook_event.message, 'quick_reply')
                    ) {
                        this.handleMessage(sender_psid, webhook_event.message.text);
                    } else {
                        this.handleQuickReplies(sender_psid, webhook_event.message);
                    }
                } else if (webhook_event.postback !== undefined) {
                    console.debug(`Get postback :  ${JSON.stringify(webhook_event)}`)
                    this.handlePostback(sender_psid, webhook_event.postback)
                }
            } else {
                console.error(`Unknown Entry ${JSON.stringify(entry)}`)
            }
        } catch (error: unknown) {
            console.error(`Error when handling entry ${error}`)
            if (sender_psid) {
                sendMessage(messageText(sender_psid, TECHNICAL_ERROR_MESSAGE))
            }
        }
    }

    async handleMessage(sender_psid: string, received_message: string) {
        try {
            console.log('Received message : ', received_message)
			const boticot_data = await parseNlu(received_message, sender_psid)
			const message = await this.buildMessages(sender_psid, boticot_data)
			console.log('Built message : ', message)
			sendMessage(message)
        } catch (error: unknown) {
            console.error(`Error when handling message ${error}`)
            sendMessage(messageText(sender_psid, SERVER_ERROR_MESSAGE))
        }
    }

    async handleIntent(sender_psid: string, intent: string) {
        try {
            const boticot_data = await requestIntent(intent, sender_psid)
			const message = await this.buildMessages(sender_psid, boticot_data)
			sendMessage(message)
        } catch (error: unknown) {
            console.error(`Error when handling intent ${error}`)
            sendMessage(messageText(sender_psid, SERVER_ERROR_MESSAGE))
        }
    }

    buildMessages(sender_psid: string, boticot_data: BoticotData) {
        if (boticot_data.response.fulfillment_text) {
            if (boticot_data.response.links) {
                return messageTextUrlAndSuggestions(
                    sender_psid,
                    boticot_data.response.fulfillment_text,
                    boticot_data.response.links,
                    buildQuickReplies(boticot_data.response.suggestions)
                )
            } else if (boticot_data.response.suggestions) {
                return messageTextAndQuickReplies(
                    sender_psid,
                    buildQuickReplies(boticot_data.response.suggestions),
                    boticot_data.response.fulfillment_text
                )
            } else {
                return messageText(sender_psid, boticot_data.response.fulfillment_text)
            }
        } else {
            throw Error('Missed Fulfillment Text in response')
        }
    }

    async handleQuickReplies(sender_psid: string, received_postback: Message) {
        let { payload } = received_postback.quick_reply
        if (payload.startsWith("INTENT_QR_")) {
            const intent = payload.replace("INTENT_QR_", "")
            this.handleIntent(sender_psid, intent)
        } else {
            this.handleMessage(sender_psid, received_postback.text)
        }
    }

    async handlePostback(sender_psid: string, webhook: Webhook) {
        this.handleMessage(sender_psid, webhook.title)
    }

    getHash(input: string) {
        let APP_SECRET = process.env.APP_SECRET
        var hmac = crypto.createHmac('sha1', APP_SECRET);
        hmac.update(input);
        return hmac.digest('hex');
    }

    public isValidSignature(headerSignature: string, body: string): boolean {
        let expectedSignature = this.getHash(body)
        if (headerSignature.length == 45 && headerSignature.substring(0, 5) === 'sha1=') {
            let signature = headerSignature.substring(5)
            if (expectedSignature == signature) {
                return true
            }
        }
        console.warn(`Invalid Signature for body ${body}`)
        return false
    }
}

const messengerService = new MessengerService()

export default messengerService