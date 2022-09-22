import {
	Suggestion,
	QuickReply,
	Link,
	MessengerTextAndQuickReplyRequest,
	MessengerTextRequest,
	MessengerRequest,
	Button,
} from '../../typings/global'
import { sendToUser } from '../client/messenger'

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

export const sendMessage = (message: MessengerRequest): void => {
    sendToUser(message)
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