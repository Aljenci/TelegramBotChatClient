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
    console.log(msg);
    if (cId in chats)
    {
        if ('text' in msg)
        {
            chats[cId]['messages'].push({'text': msg.text, 'mine': false});
        }
        if ('photo' in msg)
        {
            var downloadedPhoto = bot.downloadFile( msg.photo[2].file_id, chatsFolder);
            downloadedPhoto.then( function (path)
            {
                $('#messages').append($('<li id="received"><img src="'+path+'" width="75%"></img></li>'));
                chats[cId]['messages'].push({'photo': path, 'mine': false});
            });
        }
    }
    else
    {
        var isFirstChat = false;
        if (_.isEmpty(chats))
        {
            actualChat = cId;
            isFirstChat = true;
        }
        if ('text' in msg)
        {
            chats[cId] = { 'name': username, 'messages': [{'text': msg.text, 'mine': false}] };
        }
        if ('photo' in msg)
        {
            var downloadedPhoto = bot.downloadFile( msg.photo[2].file_id, chatsFolder);
            downloadedPhoto.then( function (path)
            {
                $('#messages').append($('<li id="received"><img src="'+path+'" width="75%"></img></li>'));
                chats[cId] = { 'name': username, 'messages': [{'photo': path, 'mine': false}] };
            });
        }
        $('#chats').append($('<li id="'+cId+'" class="user"><a onClick=changeChat('+cId+')>'+username+'</a></li>'));
        if (isFirstChat)
        {
            $('#'+actualChat).addClass("selected");
        }
    }
    if (actualChat == cId)
    {
        if ('text' in msg)
        {
            $('#messages').append($('<li id="received">').text( username.concat(": ".concat(msg.text))));
        }
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
    $('#'+actualChat).removeClass("selected");
    actualChat = cId;
    $('#'+actualChat).addClass("selected");
    var username = chats[actualChat]['name'];
    $('#messages').empty();
    var messages = chats[actualChat]['messages'];
    _.each(messages, function(elem) {
        if (elem.mine)
        {
            if ('text' in elem)
            {
                $('#messages').append($('<li = id="sent">').text("Sent: ".concat(elem.text)));
            }
            if ('photo' in elem)
            {
                $('#messages').append($('<li id="sent"><img src="'+elem.photo+'" width="75%"></img></li>'));
            }
        }
        else
        {
            if ('text' in elem)
            {
                $('#messages').append($('<li id="received">').text( username.concat(": ".concat(elem.text))));
            }
            if ('photo' in elem)
            {
                $('#messages').append($('<li id="received"><img src="'+elem.photo+'" width="75%"></img></li>'));
            }
        }
    })
}

window.onload = function () {
    chats = JSON.parse(fs.readFileSync(chatsFolder.concat('/chats.json')));
    if (_.isEmpty(chats))
    {
        return;
    }
    for (var cId in chats)
    {
        var username = chats[cId]['name'];
        $('#chats').append($('<li id="'+cId+'" class="user"><a onClick=changeChat('+cId+')>'+username+'</a></li>'));
    }
    for (var cId in chats)
    {
        actualChat = cId;
        break;
    }
    $('#'+actualChat).addClass("selected");
    var username = chats[cId]['name'];
    var messages = chats[actualChat]['messages'];
    _.each(messages, function(elem) {
        if (elem.mine)
        {
            if ('text' in elem)
            {
                $('#messages').append($('<li = id="sent">').text("Sent: ".concat(elem.text)));
            }
            if ('photo' in elem)
            {
                $('#messages').append($('<li id="sent"><img src="'+elem.photo+'" width="75%"></img></li>'));
            }
        }
        else
        {
            if ('text' in elem)
            {
                $('#messages').append($('<li id="received">').text( username.concat(": ".concat(elem.text))));
            }
            if ('photo' in elem)
            {
                $('#messages').append($('<li id="received"><img src="'+elem.photo+'" width="75%" width="75%"></img></li>'));
            }
        }
    })
}

var exitHandler = function () {
    fs.writeFile(chatsFolder.concat('/chats.json'), JSON.stringify(chats));
};

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));