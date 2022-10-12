import {
	Suggestion,
	QuickReply,
	Link,
	MessengerTextAndQuickReplyRequest,
	MessengerTextRequest,
	MessengerRequest,
	Button,
    Image,
} from '../../typings/global'
import { sendMessagesToUser, loadImage } from '../client/messenger'

export const sendMessage = (message: MessengerRequest): void => {
    sendMessagesToUser([message])
}

export const sendMessages = (messages: MessengerRequest[]): void => {
    sendMessagesToUser(messages)
}

export const messageText = (sender_psid: string, message: string): MessengerTextRequest => {
    const requestBody = {
        "recipient": {
            "id": sender_psid
        },
        "message": {
            "text": message
        }
    }
    return requestBody
}

export const messagesTexts = (sender_psid: string, messages: string[]): MessengerTextRequest[] => {
    return messages.map(message => messageText(sender_psid, message))
}

export const messageTextAndQuickReplies = (
    sender_psid: string,
	replies: QuickReply[],
	text: string
): MessengerTextAndQuickReplyRequest => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "messaging_type": "RESPONSE",
        "message": {
            "text": text,
            "quick_replies": replies
        }
    }
    return request_body
}

export const messagesTextsAndQuickReplies = (
    sender_psid: string,
    replies: QuickReply[],
    texts: string[]
): MessengerRequest[] => {
    if (texts && texts.length == 1) {
        return [messageTextAndQuickReplies(sender_psid, replies, texts[0])]
    } else {
        return texts.slice(0, texts.length - 1).map(message => messageText(sender_psid, message)).concat(
            messageTextAndQuickReplies(sender_psid, replies, texts[texts.length - 1])
        )
    }
}

export const messageTextUrlAndSuggestions = (
    sender_psid: string,
	message: string,
	links: Link[],
	replies: QuickReply[],
): MessengerTextRequest => {
    let buttons = new Array<Button>()
    links.forEach((link: Link) => {
        buttons.push({
            "type": "web_url",
            "title": link.link_name,
            "url": link.url,
            "webview_height_ratio": "tall"
        })
    })
    const requestBody = {
        "recipient": {
            "id": sender_psid
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": message,
                    "buttons": buttons
                }
            },
            "quick_replies": replies
        }
    }
    return requestBody
}

export const messagesTextsUrlAndSuggestions = (
    sender_psid: string,
    messages: string[],
    links: Link[],
    replies: QuickReply[],
): MessengerRequest[] => {
    if (messages && messages.length == 1) {
        return [messageTextUrlAndSuggestions(sender_psid, messages[0], links, replies)]
    } else {
        return messages.slice(0, messages.length - 1).map(message => messageText(sender_psid, message)).concat(
            messageTextUrlAndSuggestions(sender_psid, messages[messages.length - 1], links, replies)
        )
    }
}

export const messageImage = async (
	sender_psid: string,
    images: Image[],
    quick_replies?: QuickReply[],
): Promise<MessengerRequest> => {
	const { attachment_id } = await loadImage(images[0].image_url)
	const requestBody = {
		recipient: {
			id: sender_psid,
		},
		message: {
			attachment: {
				type: 'template',
				payload: {
					template_type: 'media',
					elements: [
						{
							media_type: 'image',
							attachment_id: attachment_id,
						},
					],
				},
			},
            quick_replies: quick_replies
		},
	}
	return requestBody
}

export const buildQuickReply = (text: string, payload: string): QuickReply => {
    let quickReply = {
        content_type: 'text',
        title: text,
        payload: payload
    }
    return quickReply
}

export const buildQuickReplies = (suggestions: Suggestion[]): QuickReply[] => {
    if (suggestions) {
        let quickReplies = new Array<QuickReply>()
        suggestions.forEach(suggestion => {
            if (suggestion.suggestion_code) {
                quickReplies.push(buildQuickReply(suggestion.suggestion_text, suggestion.suggestion_code))
            } else if (suggestion.suggestion_intent) {
                quickReplies.push(buildQuickReply(suggestion.suggestion_text, `INTENT_QR_${suggestion.suggestion_intent}`))
            } else {
                quickReplies.push(buildQuickReply(suggestion.suggestion_text, 'NONE'))
            }
        })
        return quickReplies
    }
    return undefined
}