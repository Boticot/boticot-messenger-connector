import axios from 'axios';
import { MessengerRequest } from '../../typings/global';

export const sendMessagesToUserRecursive = async (messages: MessengerRequest[], i: number) => {
    if (i < messages.length) {
        const { FACEBOOK_GRAPH_API_URL, PAGE_ACCESS_TOKEN } = process.env;
        const url = `${FACEBOOK_GRAPH_API_URL}/messages?access_token=${PAGE_ACCESS_TOKEN}`;
        axios
            .post(
                url,
                messages[i],
            )
            .then(function (response) {
                console.log("Status: " + response.status);
                console.log(response.data);
                sendMessagesToUserRecursive(messages, i + 1)
            })
            .catch(function (error) {
                console.error(error);
                sendMessagesToUserRecursive(messages, i + 1)
            });
    } else return
}

export const sendMessagesToUser = async (messages: any) => {
    sendMessagesToUserRecursive(messages, 0)
}


