declare module "*.json"
{   const value: any;
    export default value;
}

declare module 'http' {
    interface IncomingMessage {
        rawBody: any;
    }
}