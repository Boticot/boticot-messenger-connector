import axios from 'axios';
import { MessengerRequest } from '../../typings/global';

export const sendToUser = async (message: MessengerRequest) => {
    const { FACEBOOK_GRAPH_API_URL, PAGE_ACCESS_TOKEN } = process.env;
    const url = `${FACEBOOK_GRAPH_API_URL}/messages?access_token=${PAGE_ACCESS_TOKEN}`;
    axios
        .post(
            url,
            message,
        )
        .then(function (response) {
            console.log("Status: " + response.status);
            console.log(response.data);
        })
        .catch(function (error) {
            console.error(error);
        });
}


