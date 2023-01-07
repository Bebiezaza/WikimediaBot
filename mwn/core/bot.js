const { mwn } = require('mwn');
const { commonsApiUrl, commonsBotUser, commonsBotPassword, thwsApiUrl, thwsBotUser, thwsBotPassword, userAgent } = require('./config');

const commonsBot = new mwn({
    apiUrl: commonsApiUrl,

    // Can be skipped if the bot doesn't need to sign in
    username: commonsBotUser,
    password: commonsBotPassword,

    // Set your user agent (required for WMF wikis, see https://meta.wikimedia.org/wiki/User-Agent_policy):
    userAgent: userAgent,

    // Set default parameters to be sent to be included in every API request
    defaultParams: {
        assert: 'user' // ensure we're logged in
    }
});

const thwsBot = new mwn({
    apiUrl: thwsApiUrl,

    // Can be skipped if the bot doesn't need to sign in
    username: thwsBotUser,
    password: thwsBotPassword,

    // Set your user agent (required for WMF wikis, see https://meta.wikimedia.org/wiki/User-Agent_policy):
    userAgent: userAgent,

    // Set default parameters to be sent to be included in every API request
    defaultParams: {
        assert: 'user' // ensure we're logged in
    }
});

// commonsBot.login();
thwsBot.login();

module.exports = {
    // commonsBot,
    thwsBot
}