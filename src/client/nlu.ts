import axios from 'axios';
import * as correlator from 'express-correlation-id';

export const parseNlu = async (input: string, userId: String): Promise<any> => {
    const { API_URL, AGENT_NAME } = process.env;
    const url = `${API_URL}/nlu/agents/${AGENT_NAME}/parse`;
    const opt = {
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'X-Correlation-ID': correlator.getId()
        },
    };
    const body = {
        'text': input,
        'user_id': userId,
    };
    const response = await axios.post(url, body, opt);
    return response.data;
}

export const requestIntent = async (intent: string, userId: String): Promise<any> => {
    const { API_URL, AGENT_NAME } = process.env;
    const url = `${API_URL}/nlu/agents/${AGENT_NAME}/parse`;
    const opt = {
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'X-Correlation-ID': correlator.getId()
        },
    };
    const body = {
        'intent': intent,
        'user_id': userId,
    };
    const response = await axios.post(url, body, opt);
    return response.data;
}