# Biblical Names Chatbot Webhook
A simple webhook used for learning about Facebook Messenger Chatbots, written in Node.js.

*Endpoints*
- Web [localhost:3939/biblicalnamesbot](http://localhost:3939/biblicalnamesbot)
- Webhook [localhost/biblicalnamesbot/webhook](http://localhost/biblicalnamesbot/webhook)

See [https://developers.facebook.com/docs/messenger-platform](https://developers.facebook.com/docs/messenger-platform)

*Features*
- Reply to the Fabebook App Challenge request
- Process incoming messages from the chatbot with [wit.ai](https://wit.ai/) and lookup entity name in local "database" (json file).

## Usage

### Chatting

![An example chat](https://github.com/aweijnitz/biblicalNamesWebhook/raw/master/doc/chat-example.png "An Example Chat")

### Finding and adding the bot

![Finding the bot](https://github.com/aweijnitz/biblicalNamesWebhook/raw/master/doc/FB-Messenger-finding-the-bot.png "Finding the bot")

![The Bot Page](https://github.com/aweijnitz/biblicalNamesWebhook/raw/master/doc/chatbot-page-messenger.png "The Bot Page")



## Install
First clone/save this repo

    mkdir logs
    npm install

## Run
	npm start

## Run tests
	npm test
	