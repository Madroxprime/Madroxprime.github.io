/*
File: Casualty.js
Author: John Anderson
Created: 05/10/2016
Description: Main Bot File
Version: 0.1
*/
// load discordie object
var discordie = require("discordie");
// create the discord client obj
var client = new discordie();

// be sure to authorize the bot to your server/guild
// https://discordapp.com/oauth2/authorize?client_id=<CLIENT_ID>&scope=bot

client.connect({
token: "MjMzMzg1NTA1MDAwMTI4NTEy.CtcswQ.kZ78S9JZgxlzuR4W0ukbvdKIPE0"
});

client.Dispatcher.on("GATEWAY_READY", e => {
console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
console.log(e);
var privateMsg = e.message.isPrivate; // undefined if a message on a channel
var message = e.message.content.toLowerCase();
  
// e.message.content => returns the string that was sent to the server.
// e.message.channel returns the location of the sent message, either the
// text channel or the DirectMessageChannel.

// if privateMsg is true, you can encase the following code to
// reply in a private message to the user who pm'ed the
// bot.
if(message.substring(0,1) != "!"){
    var args = message.split(" ");
    switch (args[0]){
        case "!time": 
            e.message.channel.sendMessage("We're not quite ready to tell the time in a human readable format");
            break;
        case "!invite" :
            e.message.channel.sendMessage("We're not quite ready to send invites yet.");
            break;
        case "!make" :
            e.message.channel.sendMessage("We're not quite ready to make groups yet.");
            break'               
            
     }
}else {
switch (message){

    case "ping" : e.message.channel.sendMessage("pong");
                    break;
    case "hello casualty" : 
        var username = e.message.author.username;
        e.message.channel.sendMessage("Hello, "+ username);
        break; 
     
    } 
}
});

client.Dispatcher.on("VOICE_CHANNEL_JOIN", e => {
    try{
    client.Channels.textForGuild(e.guildId)[0].sendMessage('Welcome back ' + e.User.username);
    }
    catch(e){console.log(e)}
});
