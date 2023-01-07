const version = require(`../package.json`).version;
const mwnVersion = require(`../package.json`).dependencies.mwn;
require('dotenv').config({ path: './core/.env' });

const commonsApiUrl = 'https://commons.wikimedia.org/w/api.php'
const commonsBotUser = process.env.commonsBotUser;
const commonsBotPassword = process.env.commonsBotPassword;

const thwsApiUrl = 'https://th.wikisource.org/w/api.php'
const thwsBotUser = process.env.thwsBotUser;
const thwsBotPassword = process.env.thwsBotPassword;

const userAgent = `BebiezazaBot/${version} ([[m:User:Bebiezaza]]) mwn/${mwnVersion}`;

module.exports = {
    version,
    mwnVersion,

    commonsApiUrl,
    commonsBotUser,
    commonsBotPassword,

    thwsApiUrl,
    thwsBotUser,
    thwsBotPassword,

    userAgent,
}