const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { Client, LocalAuth } = require('whatsapp-web.js');
const intents = require('./dialogflow.js');
require('dotenv').config()
const logger = require('../utils/logger.js')

//#region Session

console.clear();


let client = new Client({
    puppeteer: {
        ignoreDefaultArgs: ['--disable-extensions'],
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    restartOnAuthFail: true,
    takeoverOnConflict: true,
    qrTimeoutMs: 0,
    authStrategy: new LocalAuth({
        dataPath: process.cwd() + '/whatsappbot/sessions'
    })
});

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    qrcode.generate(qr, { small: true });

    logger.info(`QR RECEIVED ${qr}`);
});

client.on('authenticated', () => {
    logger.info('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    logger.error(`AUTHENTICATION FAILURE ${msg}`);
});

client.on('ready', () => {
    logger.info('CLIENT READY');
});
//#endregion Session

// #region Date
const cron = require("node-cron");
const { date } = require("../utils/getDate");

cron.schedule(
    "0 0 * * *",
    () => {
        const loadData = require("../api/request");
        // console.log("Loading today's data");
        loadData.dataRequest();
        client.destroy();
        client.initialize();
        let today = new Date();

        let date =
            today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
        // console.log(date);

    },
    {
        scheduled: true,
        timezone: "Europe/Madrid",
    }
);
cron.schedule("0 */30 * * *", () => {
    let time = new Date().toLocaleTimeString();
    // console.log(time);
});

//#endregion Date


client.on("group_join", async (notification) => {
    if (notification.type != "add" || notification.id.participant != client.info.wid._serialized) return;
    logger.info(`${notification.author} added our client to ${(await notification.getChat()).name}`)
    client.sendMessage(
        notification.id.remote,
        "¡Hola!\nPara ver los comandos escribe !help \n \nhttps://herculwing.com",
        { linkPreview: false }
    );
});
let prefix = "!";
client.commands = new Map();
client.aliases = new Map();

const commandFiles = fs
    .readdirSync(__dirname + "/commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
    if (command.aliases) {
        command.aliases.forEach((alias) => {
            client.aliases.set(alias, command);
        });
    }
}

client.on("message", async (msg) => {

    const chat = msg.isStatus ? "status" : await msg.getChat();
    /**
     * Mensaje de bienvenida
     */
    if ((await chat.fetchMessages()).length == 1 && chat.isGroup == false) {
        logger.info(`Welcome message send to ${msg.author}`)
        client.sendMessage(
            msg.from,
            "¡Hola!\nPara ver los comandos escribe ```!help``` \n \nhttps://herculwing.com",
            { linkPreview: false }
        );
    }

    if ((!msg.body.startsWith(prefix) && chat.isGroup) || msg.fromMe) return;

    const args = msg.body.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) || client.aliases.get(commandName);

    logger.info(`${msg.author} -> ${msg.body}`)

    /**
     * Conversaciones individuales con la integración de DialogFlow
     */
    if (!msg.body.startsWith(prefix) && !chat.isGroup && msg.type == "chat") {
        let query = msg.body;
        if (query.length <= 250) {
            let response = await intents.executeQuery(msg.from, query);
            const args = response.trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            let command = client.commands.get(commandName);
            if (command) {
                command.execute(client, msg, args, date);
            } else {
                client.sendMessage(msg.from, response);
            }
        } else {
            msg.reply("El mensaje excede el límite. Por favor no envíes mensajes que superen los 250 caracteres.")
        }
        return
    }
    // Si el comando no existe => finalizar
    if (!command) return;
    // Si el comando requiere argumentos y estos estan especificados en el archivo del documento indicarlo.
    if (command.args && !args.length) {
        let reply = `Comando incorrecto`;

        if (command.usage) {
            reply +=
                "\nUso esperado: ```" +
                prefix +
                commandName +
                " " +
                command.usage +
                "```";
        }

        return msg.reply(reply);
    }
    try {
        command.execute(client, msg, args, date);
    } catch (error) {
        logger.error(`An error happened executing a command ${error}`)
        msg.reply(
            "Lo sentimos, se ha producido un error.\nVuelva a intentarlo más tarde."
        );
    }
    // if ((msg.body).charAt(0)== "!"){
    // let cmd = require('./commands.js');
    // client.sendMessage(msg.from, cmd.commands(msg.body))
    // delete require.cache[require.resolve('./commands.js')]
    // }
});
client.initialize();
