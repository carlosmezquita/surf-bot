module.exports = {
    name: 'twitter',
    description: 'Twitter de @HerculWing',
    aliases: ['tw'],
    execute(client, msg, args, date) {
        client.sendMessage(msg.from, "¡Síguenos en Twitter!\nhttps://twitter.com/HerculWing")
    },
};