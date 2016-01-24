var TelegramBot = require('node-telegram-bot-api');
var fs = require('fs');

var token = 'YOUR_BOT_API_TOKEN_HERE';
var chatsFolder = 'PATH_TO_SAVE_THE_CHATS';

// Setup polling way
var bot = new TelegramBot(token, {polling: true});

var chats = {};
var actualChat;

// Any kind of message
bot.on('message', function (msg) {
    var cId = msg.chat.id;
    var username = msg.from.username;
    if (cId in chats)
    {
        chats[cId]['messages'].push({'text': msg.text, 'mine': false});
    }
    else
    {
        if (_.isEmpty(chats))
        {
            actualChat = cId;
        }
        chats[cId] = { 'name': username, 'messages': [{'text': msg.text, 'mine': false}] }
        $('#chats').append($('<li><a onClick=changeChat('.concat(cId).concat(')>').concat(username).concat('</a></li>')));
    }
    if (actualChat == cId)
    {
        $('#messages').append($('<li id="received">').text( username.concat(": ".concat(msg.text))));
    }
});

//Reply to message
$('form').submit(function(){
    var resp = $('#m').val();
    $('#m').val('');
    bot.sendMessage(actualChat, resp);
    chats[actualChat]['messages'].push({'text': resp, 'mine': true});
    $('#messages').append($('<li = id="sent">').text("Sent: ".concat(resp)));
    return false;
});

function changeChat( cId ) {
    actualChat = cId;
    var username = chats[actualChat]['name'];
    $('#messages').empty();
    var messages = chats[actualChat]['messages'];
    _.each(messages, function(elem) {
        if (elem.mine)
        {
            $('#messages').append($('<li = id="sent">').text("Sent: ".concat(elem.text)));
        }
        else
        {
            $('#messages').append($('<li id="received">').text( username.concat(": ".concat(elem.text))));
        }
    })
}

window.onload = function () {
    chats = JSON.parse(fs.readFileSync(chatsFolder.concat('chats.json')));
    if (_.isEmpty(chats))
    {
        return;
    }
    for (var cId in chats)
    {
        var username = chats[cId]['name'];
        $('#chats').append($('<li><a onClick=changeChat('.concat(cId).concat(')>').concat(username).concat('</a></li>')));
    }
    for (var cId in chats)
    {
        actualChat = cId;
        break;
    }
    var username = chats[cId]['name'];
    var messages = chats[actualChat]['messages'];
    _.each(messages, function(elem) {
        if (elem.mine)
        {
            $('#messages').append($('<li = id="sent">').text("Sent: ".concat(elem.text)));
        }
        else
        {
            $('#messages').append($('<li id="received">').text( username.concat(": ".concat(elem.text))));
        }
    })
}

var exitHandler = function () {
    fs.writeFile(chatsFolder.concat('chats.json'), JSON.stringify(chats));
};

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));