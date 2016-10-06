/*
File: Casualty.js
Author: John Anderson
Created: 05/10/2016
Description: Main Bot File
Version: 0.1
*/
var Discord = require("discord.js");
var bot = new Discord.Client();
require('String.prototype.startsWith'); // used to parse complicated messages

// begin main bot
bot.on("message", function(message) {
    // convert message into all upper case and store it in input
    var input = message.content.toUpperCase();
    var server = message.channel.server;
    var roles = message.channel.server.roles;
    var user = message.author;
    var role;
    var roleName = message.content.split(" "); // roleName[0] = "ADDROLE", roleName[1] = "GivenRole"
    var channels = message.channel.server.channels;
    var channel;
    var reserved;        // Hello Casualty
    if (input === "HELLO CASUALTY") {
        bot.reply(message, "Hello! Good to be back.");


}
});
bot.loginWithToken("MjMzMzg1NTA1MDAwMTI4NTEy.CtcswQ.kZ78S9JZgxlzuR4W0ukbvdKIPE0");