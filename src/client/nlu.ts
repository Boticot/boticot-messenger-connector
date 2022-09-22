import axios from 'axios';
import * as correlator from 'express-correlation-id';
import { BoticotData } from '../../typings/global';

export const parseNlu = async (input: string, userId: string): Promise<BoticotData> => {
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
    const { data } = await axios.post<BoticotData>(url, body, opt);
    return data;
}

export const requestIntent = async (intent: string, userId: string): Promise<BoticotData> => {
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
    const { data } = await axios.post<BoticotData>(url, body, opt);
    return data;
}