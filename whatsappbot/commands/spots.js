const fs = require('fs')
module.exports = {
	name: 'spots',
	description: 'Información sobre las mareas.',
	aliases: ['lugares', 'picos'],
	execute(client, msg, args, date) {
		let contents = fs.readFileSync(process.cwd() + "/data/spots.json");
		// // Define to JSON type
		let spotsData = JSON.parse(contents);
		console.log(Object.keys(spotsData))
		let text = "";
		for (let x in spotsData) {
			text += `\n - ${spotsData[x].name}\n`;
		}
		client.sendMessage(msg.from, "*Lista de lugares:*\n" + text, { linkPreview: false })
	}
}