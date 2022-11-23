const fs = require('fs');

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	args: true,
	usage: "<command>",
	execute(client, msg, args, date) {
		if (!(msg.from == (process.env.ADMIN_USER_NUM + "@c.us") || msg.author == (process.env.ADMIN_USER_NUM + "@c.us"))) {
			return msg.reply("You do not have permission to execute this command.")
		};
		const commandName = args[0].toLowerCase();
		const command = client.commands.get(commandName)
			|| client.aliases.get(commandName);

		if (!command) {
			return msg.reply(`There is no command with name or alias ${commandName}`);
		}

		try {
			delete require.cache[require.resolve(`./${command.name}`)];
			const newCommand = require(`./${command.name}.js`);
			msg.client.commands.set(newCommand.name, newCommand);
			if (newCommand.aliases) {
				newCommand.aliases.forEach((alias) => {
					client.aliases.set(alias, newCommand);
				});
			}
			msg.reply(`Command ${newCommand.name} was reloaded!`);
		} catch (error) {
			console.error(error);
			msg.reply(`There was an error while reloading a command ${command.name}`);
		}
	},
};