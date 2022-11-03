const fs = require('fs')
module.exports = {
	name: 'webcam',
	args: true,
	usage: '<lugar>\n!webcam list',
	description: '',
	aliases: ['wc'],
	execute(client, msg, args, date) {
		const removeAccents = (str) => {
			return str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		}
		let spot = removeAccents(args)
		let contents = fs.readFileSync(process.cwd() + "/data/spots.json");
		// // Define to JSON type
		let spotsData = JSON.parse(contents);
		if (spot != "list") {
			if (spotsData[spot].webcam) {
				client.sendMessage(msg.from, "🎥 *Webcam de " + spotsData[spot].name + "*" +
					"\n\n" + spotsData[spot].webcam, { linkPreview: false });
			}
			else {
				msg.reply("Lo sentimos, la webcam de _" + args + "_ no se encuentra disponible. \nPara ver las webcams disponibles escriba ```!webcam list``");
			}
		}
		else {
			console.log(Object.keys(spotsData))
			let text = "";
			for (let x in spotsData) {
				if (spotsData[x].webcam) {
					text += `\n${spotsData[x].name}:\n${spotsData[x].webcam}\n`;
				}
			}
			client.sendMessage(msg.from, "*Lista de webcams:*\n" + text, { linkPreview: false })
		}

	},
};