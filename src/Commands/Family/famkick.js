const Discord = require('discord.js');

module.exports = {
	name: 'famkick',
	category:"family",
	description: "Кикнуть с фамы",


	async run (bot,message,args) {

		
		if (message.content == `/famkick`) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famkick [user]\``).then(msg => msg.delete({timeout:10000}));
            return message.delete();
        }
        let families = [];
        message.guild.channels.cache.filter(async channel => {
            if (channel.type == "voice") {
                if (channel.parent.name.toString() == `Family ROOMS`) {
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`) {
                            if (perm.allow.toArray().some(r => r == `PRIORITY_SPEAKER`)) {
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем/заместителем семьи!\``).then(msg => msg.delete({timeout:10000}));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());

        if (!user) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famkick [user]\``).then(msg => msg.delete({timeout:7000}));
            return message.delete();
        }
        if (families.length == 1) {
            let fam_role;
            await message.guild.channels.cache.filter(async channel => {
                if (channel.name == families[0]) {
                    if (channel.type == "voice") {
                        if (channel.parent.name.toString() == `Family ROOMS`) {
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`) {
                                    let role_fam = message.guild.roles.cache.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name) {
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.cache.some(r => r.id == fam_role.id)) {
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} не состоит в вашей семье!\``).then(msg => msg.delete({timeout:10000}));
                return message.delete();
            }
            message.delete();
            if (user.roles.cache.some(r => r.id == fam_role.id)) user.roles.remove(fam_role)
            let general = message.guild.channels.cache.find(c => c.name == `чат`);
            if (general) await general.send(`<@${user.id}>, \`вы были исключены из семьи '${families[0]}'! Источник:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.cache.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[KICK]\` <@${message.author.id}> \`выгнал пользователя\` <@${user.id}> \`из семьи: '${families[0]}'\``);
            return
        } else {
            if (!args[1]) {
                let familiesall = null;
                for (var i = 0; i < families.length; i++) {
                    if (familiesall == null) {
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    } else {
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты участник более 1-ой семьи! Что бы выгнать участника, нужно выбрать семью из которой нужно будет его кикнуть! Используй: /famkick [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete({timeout:30000}));
                return message.delete();
            }
            if (!families[args[1]] || families[args[1]] == undefined) {
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete({timeout:10000}));
                return message.delete();
            }
            let fam_role;
            await message.guild.channels.cache.filter(async channel => {
                if (channel.name == families[args[1]]) {
                    if (channel.type == "voice") {
                        if (channel.parent.name.toString() == `Family ROOMS`) {
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`) {
                                    let role_fam = message.guild.roles.cache.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name) {
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.cache.some(r => r.id == fam_role.id)) {
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} не состоит в данной семье!\``).then(msg => msg.delete({timeout:10000}));
                return message.delete();
            }
            message.delete();
            if (user.roles.cache.some(r => r.id == fam_role.id)) user.roles.remove(fam_role)
            let general = message.guild.channels.cache.find(c => c.name == `чат`);
            if (general) await general.send(`<@${user.id}>, \`вы были исключены из семьи '${families[args[1]]}'! Источник:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.cache.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[KICK]\` <@${message.author.id}> \`выгнал пользователя\` <@${user.id}> \`из семьи: '${families[args[2]]}'\``);
            return
        }
	}	
}