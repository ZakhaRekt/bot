const Discord = require('discord.js');

module.exports = {
	name: 'deletefam',
	category:"family",
	description: "Удалить семью",

	async run (bot,message,args) {
		if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`\`эй! Эта функция только для модераторов!\``) && message.delete()
        if (!args[0]) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите название семьи! /deletefam [name]\``).then(msg => msg.delete({timeout:7000}));
            return message.delete();
        }
        let name = args.slice(0).join(" ");
        let family_channel = null;
        let family_role = null;
        let family_leader;
        await message.guild.channels.cache.filter(async channel => {
            if (channel.name == name) {
                if (channel.type == "voice") {
                    if (channel.parent.name.toString() == `Family ROOMS`) {
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`) {
                                let role_fam = message.guild.roles.cache.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name) {
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`) {
                                if (perm.allow.toArray().some(r => r == `CREATE_INSTANT_INVITE`)) {
                                    family_leader = message.guild.members.cache.find(m => m.id == perm.id);
                                }
                            }
                        })
                    }
                }
            }
        });
        if (family_channel == null || family_role == null) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`ошибка! Семья: '${name}' не найдена!\``).then(msg => msg.delete({timeout:10000}));
            return message.delete();
        }
        family_channel.delete();
        family_role.delete();
        let general = message.guild.channels.cache.find(c => c.name == `чат`);
        if (general) await general.send(`<@${family_leader.id}>, \`модератор\` <@${message.author.id}> \`удалил вашу семью: ${name}\``)
        let fam_chat = message.guild.channels.cache.find(c => c.name == `family-chat`);
        if (fam_chat) await fam_chat.send(`\`[DELETED]\` \`Семья '${name}', главой которой был\` <@${family_leader.id}> \`была удалена модератором. Удалил:\` <@${message.author.id}>`);
        return message.delete();
    }

}