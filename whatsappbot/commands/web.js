module.exports = {
    name: 'web',
    description: 'Página web de HerculWing',
    aliases: ['website', 'site'],
    execute(client, msg, args, date) {
        client.sendMessage(msg.from, "¡Visita nuestra página web!\nhttps://herculwing.com")
    },
};