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
