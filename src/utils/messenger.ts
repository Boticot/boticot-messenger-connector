import { sendToUser } from '../client/messenger'

export const messageText = (sender_psid, message): any => {
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

export const sendMessage = (message): void => {
    sendToUser(message)
}

export const messageTextAndQuickReplies = (sender_psid, replies, text): any => {
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

export const messageTextUrlAndSuggestions = (sender_psid, message, links, replies): any => {
    let buttons = []
    links.forEach(link => {
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

export const buildQuickReply = (text, payload): any => {
    let quickReply = {
        content_type: 'text',
        title: text,
        payload: payload
    }
    return quickReply
}

export const buildQuickReplies = (suggestions): any => {
    if (suggestions) {
        let quickReplies = []
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