const Discord = require('discord.js');

module.exports = {
	name: 'famdelzam',
	category:"family",
	description: "Команда удаления зама из фамы",


	async run (bot,message,args) {
		if (message.content == `/famdelzam`) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famdelzam [user]\``).then(msg => msg.delete({timeout:10000}));
            return message.delete();
        }
        let families = [];
        message.guild.channels.cache.filter(async channel => {
            if (channel.type == "voice") {
                if (channel.parent.name.toString() == `Family ROOMS`) {
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`) {
                            if (perm.allow.toArray().some(r => r == `CREATE_INSTANT_INVITE`)) {
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем семьи!\``).then(msg => msg.delete({timeout:10000}));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        if (!user) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famdelzam [user]\``).then(msg => msg.delete({timeout:7000}));
            return message.delete();
        }

        if (user.id == message.author.id) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`воу, воу! Полегче! Забрав у себя доступ ты не сможешь выдавать роли своей семьи!\``).then(msg => msg.delete({timeout:10000}));
            return message.delete();
        }

        if (families.length == 1) {
            let fam_zam = false;
            await message.guild.channels.cache.filter(async channel => {
                if (channel.name == families[0]) {
                    if (channel.type == "voice") {
                        if (channel.parent.name.toString() == `Family ROOMS`) {
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `member`) {
                                    if (!perm.allow.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allow.toArray().some(r => r == `PRIORITY_SPEAKER`)) {
                                        if (perm.id == user.id) {
                                            fam_zam = true
                                            perm.delete()
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!fam_zam) {
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`данный пользователь не ваш заместитель!\``).then(msg => msg.delete({timeout:10000}));
                return message.delete();
            }
            message.delete();
            let general = message.guild.channels.cache.find(c => c.name == `чат`);
            if (general) await general.send(`<@${user.id}>, \`вы были изгнаны с поста заместителя семьи '${families[0]}'! Снял:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.cache.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`снял заместителя\` <@${user.id}> \`семья: '${families[0]}'\``);
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
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты владелец более 1-ой семьи! Что бы снять заместителя, нужно выбрать из какой семьи ты его будешь выгонять! Используй: /famdelzam [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete({timeout:30000}));
                return message.delete();
            }
            if (!families[args[1]] || families[args[1]] == undefined) {
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete({timeout:10000}));
                return message.delete();
            }

            let fam_zam = false;
            await message.guild.channels.cache.filter(async channel => {
                if (channel.name == families[args[1]]) {
                    if (channel.type == "voice") {
                        if (channel.parent.name.toString() == `Family ROOMS`) {
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `member`) {
                                    if (!perm.allow.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allow.toArray().some(r => r == `PRIORITY_SPEAKER`)) {
                                        if (perm.id == user.id) {
                                            fam_zam = true
                                            perm.delete()
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!fam_zam) {
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`данный пользователь не ваш заместитель!\``).then(msg => msg.delete({timeout:10000}));
                return message.delete();
            }
            message.delete();
            let general = message.guild.channels.cache.find(c => c.name == `чат`);
            if (general) await general.send(`<@${user.id}>, \`вы были изгнаны с поста заместителя семьи '${families[args[1]]}'! Снял:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.cache.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`снял заместителя\` <@${user.id}> \`семья: '${families[args[1]]}'\``);
            return
        }
	}
}