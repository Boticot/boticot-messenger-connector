import { app } from './express';

const port = process.env.PORT;
app.appExpress.listen(port, (): void => {
    console.log(`SERVER RUNNING ON PORT: ${port}`);
});