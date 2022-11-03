const fs = require('fs')
module.exports = {
    name: 'mareas',
    description: 'Información sobre las mareas.',
    aliases: ['tide', 'marea'],
    execute(client, msg, args, date) {
        let tide = require(process.cwd() + "/data/tides.json")
        if (tide.rss.channel[0].item[0]['Mareas:mareas'][3] == undefined) {
            client.sendMessage(msg.from, "*Información sobre la marea:*\n\n" + tide.rss.channel[0].item[0]['Mareas:mareas'][0].ATTR.estado + ' a las ' + tide.rss.channel[0].item[0]['Mareas:mareas'][0].ATTR.hora + ' (' + tide.rss.channel[0].item[0]['Mareas:mareas'][0].ATTR.altura + 'm)\n' +
                tide.rss.channel[0].item[0]['Mareas:mareas'][1].ATTR.estado + ' a las ' + tide.rss.channel[0].item[0]['Mareas:mareas'][1].ATTR.hora + ' (' + tide.rss.channel[0].item[0]['Mareas:mareas'][1].ATTR.altura + 'm)\n' +
                tide.rss.channel[0].item[0]['Mareas:mareas'][2].ATTR.estado + ' a las ' + tide.rss.channel[0].item[0]['Mareas:mareas'][2].ATTR.hora + ' (' + tide.rss.channel[0].item[0]['Mareas:mareas'][2].ATTR.altura + 'm)')
        }
        else {
            client.sendMessage(msg.from, "*Información sobre la marea:*\n\n" + tide.rss.channel[0].item[0]['Mareas:mareas'][0].ATTR.estado + ' a las ' + tide.rss.channel[0].item[0]['Mareas:mareas'][0].ATTR.hora + ' (' + tide.rss.channel[0].item[0]['Mareas:mareas'][0].ATTR.altura + 'm)\n' +
                tide.rss.channel[0].item[0]['Mareas:mareas'][1].ATTR.estado + ' a las ' + tide.rss.channel[0].item[0]['Mareas:mareas'][1].ATTR.hora + ' (' + tide.rss.channel[0].item[0]['Mareas:mareas'][1].ATTR.altura + 'm)\n' +
                tide.rss.channel[0].item[0]['Mareas:mareas'][2].ATTR.estado + ' a las ' + tide.rss.channel[0].item[0]['Mareas:mareas'][2].ATTR.hora + ' (' + tide.rss.channel[0].item[0]['Mareas:mareas'][2].ATTR.altura + 'm)\n' +
                tide.rss.channel[0].item[0]['Mareas:mareas'][3].ATTR.estado + ' a las ' + tide.rss.channel[0].item[0]['Mareas:mareas'][3].ATTR.hora + ' (' + tide.rss.channel[0].item[0]['Mareas:mareas'][3].ATTR.altura + 'm)\n')
        }
    },
};