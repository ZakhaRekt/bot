const Discord = require('discord.js');

const PrivateCategoryID = '757598794924949564';
module.exports = async (bot,oldChannel,newChannel) => {
	if(newChannel.type === 'dm') return;
	if(newChannel.parentID === PrivateCategoryID) {
		if(newChannel.name != oldChannel.name) {
			if(newChannel.name.startsWith(`📞 |`)) {
				newChannel.setName(`📞 |${newChannel.name}`)
			}
		}
	}else {
		bot.channels.cache.find(ch => ch.id === '757601751372267632').send(`
			\`\`Настройки канала\`\` **${oldChannel}** \`\`были изменены!\`\``
			)
	}
}