import { Request } from 'express'

export interface WebhookVerificationRequest extends Request {
	query: {
		'hub.mode': string
		'hub.verify_token': string
		'hub.challenge': string
	}
}

export interface WebhookHandlingRequest extends Request {
	body: {
		object: string
		entry: Entry[]
	}
}

export interface Entry {
	messaging: MessagingEvent[]
}

export interface MessagingEventBasic {
	sender: Sender
}

export interface MessagingEventMessage extends MessagingEventBasic {
	message: Message
	postback?: never
}

export interface MessagingEventPostback extends MessagingEventBasic {
	message?: never
	postback: Webhook
}

export type MessagingEvent = MessagingEventMessage | MessagingEventPostback

export interface Sender {
	id: string
}

export type Message = MessageText | MessageQuickReplies

export interface MessageText {
	text: string
	quick_reply?: never
}

export interface MessageQuickReplies {
	quick_reply: QuickReply
	text?: never
}

export interface BoticotResponse {
	data: BoticotData
}

export interface BoticotData {
	response: ResponseAnswer
}

export interface ResponseAnswer {
	fulfillment_text?: string
	suggestions?: Suggestion[]
	links?: Link[]
}

export interface Suggestion {
	suggestion_code?: string
	suggestion_intent?: string
	suggestion_text: string
	linked_to: string
}

export interface Link {
	link_name: string
	url: string
}

export interface QuickReply {
	content_type: string
	title: string
	payload: string
}

export interface MessengerRequestBasic {
	recipient: Recipient
}

export interface MessengerTextRequest extends MessengerRequestBasic {
	message: MessengerMessage
}

export interface MessengerTextAndQuickReplyRequest extends MessengerRequestBasic {
	messaging_type: string
	message: MessengerMessage
}

export type MessengerRequest =
	| MessengerTextRequest
	| MessengerTextAndQuickReplyRequest

export interface Recipient {
	id: string
}

export interface MessengerMessage {
	text?: string
	quick_replies?: QuickReply[]
	attachment?: Attachment
}

export interface Attachment {
	type: string
	payload: Payload
}

export interface Payload {
	template_type: string
	text?: string
	elements?: Element[]
	buttons?: Button[]
}

export interface Element {
	media_type: string
	attachment_id: string
	buttons?: Button[]
}

export interface Button {
	type: string
	title: string
	url?: string
	payload?: string
	webview_height_ratio?: string
}

export interface Postback {
	quick_reply: QuickReply
	text: string
}

export interface Webhook {
	title: string
}
