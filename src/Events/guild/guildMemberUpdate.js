const Discord = require('discord.js');
const StuffRoles = ["★ Администратор ★","★ Старший Модератор ★"];
const {getDateString} = require('../../../functions.js');

const mafiaRolePlayer = '739444270565425173'; //Роль играков мафии


module.exports = async (bot,oldMember,newMember) => {
		await newMember.guild.fetchAuditLogs({
			type: "MEMBER_ROLE_UPDATE",
		}).then(audit => {
			const memberThatAddRole = bot.guilds.cache.first().member(audit.entries.first().executor);
			if(newMember.displayName != oldMember.displayName) return;
			console.log(memberThatAddRole.displayName);
			if(memberThatAddRole.roles.cache.some(role => StuffRoles.includes(role.name))) {
				return bot.guilds.cache.first().channels.cache.find(ch => ch.name === "special-logs").send(new Discord.MessageEmbed()
					.setColor(`${memberThatAddRole.displayHexColor}`)
					.setImage(`http://img.1001mem.ru/posts/3886000/3885571.jpg`)
					.setDescription(`**Ник администратора:**\`\`${memberThatAddRole.displayName}\`\` \n
					**Ник кому снял/выдал:** \`\`${newMember.displayName}\`\` \n
					**Время:** \`\`${getDateString()}\`\` \n
					**Ему пизда?:** \`\`Да определенно!\`\``)
				)
			}
	})
}