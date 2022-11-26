require('dotenv').config()
const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi({
    appKey: process.env.TW_APP_KEY,
    appSecret: process.env.TW_APP_SECRET,
    accessToken: process.env.TW_ACCESS_TOKEN,
    accessSecret: process.env.TW_ACCESS_SECRET
})

const rwClient = client.readWrite

module.exports = rwClient