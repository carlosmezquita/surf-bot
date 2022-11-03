module.exports = {
    name: 'instagram',
    description: 'Instagram de @HerculWing',
    aliases: ['ig'],
    execute(client, msg, args, date) {
        client.sendMessage(msg.from, "¡Síguenos en Instagram!\nhttps://www.instagram.com/HerculWing/")
    },
};