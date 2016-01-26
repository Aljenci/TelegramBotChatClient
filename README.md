# TelegramBotChatClient
A simple telegram chat client using a bot.

# Requirements
| Name | URL | Install |
| ---- | --- | ------- |
| node telegram bot api | https://github.com/yagop/node-telegram-bot-api | npm install node-telegram-bot-api |
| jQuery | https://jquery.com/ | bower install jquery |
| Underscore | http://underscorejs.org/ | bower install underscore |
| nwjs | http://nwjs.io/ | Download the ejecutable |

In src/bot.js you must change:

Variable | Set this | To
--- | --- | ---
var token | 'YOUR_BOT_API_TOKEN_HERE' | Your bot api token
var chatsFolder | 'PATH_TO_SAVE_THE_CHATS' | The path where you want to save your chats

# Limitations
Using bots the client have some limitations:
* Cannot start a chat.
* If a user delete the chat, your messages will not arrive.

# TODO
I don't know if I will continue the project, but if yes:
* Using of emojis.
* Multimedia messages.
* Show the users avatar.
* Notification of arrived messages.
* Management of unread messages.
