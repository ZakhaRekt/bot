const Discord = require('discord.js');

const mafiaRolePlayer = '739444270565425173'; //Роль играков мафии


module.exports = async (bot,oldMember,newMember) => {
		await newMember.guild.fetchAuditLogs({
			type: "MEMBER_UPDATE",
		}).then(audit => {
			if(newMember.guild.member(audit.entries.first().executor).roles.cache.some(role => role.id === mafiaRolePlayer)) {
				newMember.setNickname(oldMember.nickname)
			}
	})
}