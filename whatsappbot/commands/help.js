module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands', 'comandos', 'ayuda'],
	execute(client, msg, args, date) {
		client.sendMessage(msg.from, "💾 *Los comandos son:*\n" +
			"\n\n- ```!fc```  para ver el forecast completo " +
			"\n\n- ```!marea```  para ver la información sobre las mareas " +
			"\n\n- ```!oleaje```  para ver la información sobre las olas " +
			"\n\n- ```!viento```  para ver la información sobre el viento " +
			"\n\n- ```!webcam```  para ver las webcams " +
			"\n\n- ```!instagram```  para ver nuestro instagram " +
			"\n\n- ```!twitter```  paar ver nuestro twitter \n\n")
	},
};