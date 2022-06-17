## Boticot Messenger Connector QuickStart

### Prerequisite
Start boticot: https://github.com/Boticot/boticot
Configure your application and page messenger by following steps described in the documentation of Meta (Facebook): https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup
The webhook configuration step should be done after starting your boticot messenger connector

### Start Project

#### Start using docker-compose
Override environment variables of the file docker-compose.yml:
- API_URL: the url of boticot api
- AGENT_NAME : the name of the agent that will be used by your chatbot
- PAGE_ACCESS_TOKEN : the access token of your page, you find this information in your Facebook app developers interface
- APP_ID : the id of your application, you find this information in your Facebook app developers interface
- APP_SECRET : the app secret associated to your application, you find this information in your Facebook app developers interface
- VERIFY_TOKEN : the verify token should be used when you configure your webhook inside Facebook app developers interface
You can start now your messenger connector
```
docker-compose up -d
```

#### Start for development
You should override environment variables inside the file .env as described in the previous section
You can start now your messenger connector
```
npm install
npm start
```

#### Webhook configuration
Once the project started, you need to configure the webhook inside Facebook app developers interface
You can use ngrok to expose your local server in internet
download: https://ngrok.com
run: 
```
ngrok http 8015
```

#### Troubleshooting
If your bot responds with 
"
Server error
Please retry later
"
You need to check the url of boticot api used with env varibale: API_URL
If the url is OK, you need to check that the agent set with env varibale AGENT_NAME already exists in boticot
If the agent not exist tou should create it before use it with messenger connector