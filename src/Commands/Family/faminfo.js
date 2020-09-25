const Discord = require('discord.js');

module.exports = {
	name: 'faminfo',
	category:"family",
	description: "Информация о семье",

	async run (bot,message,args) {
		 if (!args[0]) {
            message.reply(`\`использование: /faminfo [название семьи]\``).then(msg => msg.delete({timeout:7000}));
            return message.delete();
        }
        let familyname = args.slice(0).join(" ");
        let family_channel = null;
        let family_role = null;
        let family_leader;
        let families_zams = [];
        await message.guild.channels.cache.filter(async channel => {
            if (channel.name == familyname) {
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
                            if (perm.type == `member`) {
                                if (!perm.allow.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allow.toArray().some(r => r == `PRIORITY_SPEAKER`)) {
                                    families_zams.push(perm.id)
                                }
                            }
                        })
                    }
                }
            } else if (channel.name.toLowerCase().includes(familyname.toLowerCase())) {
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
                            if (perm.type == `member`) {
                                if (!perm.allow.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allow.toArray().some(r => r == `PRIORITY_SPEAKER`)) {
                                    families_zams.push(perm.id)
                                }
                            }
                        })
                    }
                }
            }
        });
        if (family_channel == null || family_role == null) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`ошибка! Семья: '${familyname}' не найдена!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        if (!family_leader) {
            family_leader = `не назначен`;
        } else {
            family_leader = `<@${family_leader.id}>`;
        }
        let family_zams = `\`заместителей нет\``;
        for (var i = 0; i < families_zams.length; i++) {
            if (family_zams == `\`заместителей нет\``) {
                family_zams = `<@${families_zams[i]}>`;
            } else {
                family_zams = family_zams + `, <@${families_zams[i]}>`;
            }
        }
        let members = message.guild.roles.cache.get(family_role.id).members; // members.size
        message.channel.send(`**<@${message.author.id}>, вот информация о семье: <@&${family_role.id}>**`, {
            embed: {
                color: 3447003,
                fields: [{
                    name: `Информация о семье: ${family_role.name}`,
                    value: `**Создатель семьи: ${family_leader}\nЗаместители: ${family_zams}\nКоличество участников: ${members.size}**`
                }]
            }
        })
	}
}