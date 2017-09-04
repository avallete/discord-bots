const Discord = require('discord.js');

const Moment = require('moment');

const bot = new Discord.Client();

const token = 'YOUR-APP-TOKEN';

var _connection = null;

var _logtimes = null;

bot.login(token);

bot.on('ready', () => {
    console.log('I am ready to work !');
});

// Used to compute the total speaking time each time someone speak
const speakCount = function (user, speaking) {
    if (!(user.username in _logtimes)) {
        _logtimes[user.username] = {
            'start_speak': Date.now(),
            'total_time': 0
        }
    }
    if (speaking === true) {
        _logtimes[user.username].start_speak = Date.now();
    }
    else {
        _logtimes[user.username].total_time += Date.now() - _logtimes[user.username].start_speak
    }
}

bot.on('message', message => {
    // Didn't reply to itself
    if (message.author.bot) return;

    // Join the user voice channel
    if (message.content === '/join') {
        // Only try to join if caller is on voiceChannel
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    _connection = connection;
                    _logtimes = {};
                })
                .catch(console.error);
        }
    }

    // Self descriptive
    if (message.content === '/leave') {
        // Only try to leave if caller is on voiceChannel
        if (message.member.voiceChannel) {
            message.member.voiceChannel.leave();
            _connection = null;
            _logtimes = null;
        }
    }

    // Start recording speaking time
    if (message.content === '/record') {
        if (_connection) {
            _connection.on('speaking', speakCount);
        }
        else
            console.error("You must be on a voiceChannel to record.");
    }

    // Stop recording speaking time
    if (message.content === '/stop-record') {
        _connection.removeListener('speaking', speakCount);
        _logtimes = null
    }

    // Send a resume message of all speaking times into the channel.
    if (message.content === '/show') {
        if (_logtimes) {
            var text = "";
            for (var username in _logtimes) {
                // Remove 1h to the timestamp to get the true time with HH:mm:ss
                var dt = new Date(_logtimes[username].total_time - 3600000);
                text += username + "      ::      "  + Moment(dt).format('HH:mm:ss') + " speaking time.\n";
            }
            message.channel.send(text);
        }
        else {
            console.error("You must be in record session to see stats.")
        }
    }
});