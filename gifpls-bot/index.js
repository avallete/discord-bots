const Discord = require('discord.js');
const Giphy = require('giphy-api')();

const bot = new Discord.Client();

const token = 'YOUR-APP-TOKEN';

bot.login(token);

bot.on('ready', () => {
    console.log('I am ready to work !');
});

bot.on('message', message => {
   // Didn't reply to itself
    if (message.author.bot) return;

    // Check if message starts with `!`
    if (message.content.indexOf('!gifpls') === 0) {
        var text = message.content.substring(7);

        Giphy.search({
            q: text,
            limit: 1
        }).then(function (res) {
            if (res.data.length > 0) {
                message.channel.send(res.data[0].url);
            }
        });
    }
});

