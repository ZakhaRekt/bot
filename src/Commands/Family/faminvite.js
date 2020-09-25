const Discord = require('discord.js');

module.exports = {
	name: 'faminvite',
	category:"family",
	description: "Пригласить в фаму",


	async run(bot,message,args) {

		if (message.content == `/faminvite`) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /faminvite [user]\``).then(msg => msg.delete({timeout:10000}));
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
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /faminvite [user]\``).then(msg => msg.delete({timeout:7000}));
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
            if (user.roles.cache.some(r => r.id == fam_role.id)) {
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} уже состоит в вашей семье!\``).then(msg => msg.delete({timeout:7000}));
                return message.delete();
            }
            message.delete();
            let msg = await message.channel.send(`<@${user.id}>, \`создатель или заместитель семьи\` <@${message.author.id}> \`приглашает вас вступить в семью:\` **<@&${fam_role.id}>**\n\`Нажмите галочку в течении 10 секунд, если вы согласны принять его приглашение!\``);
            await msg.react(`✔`);
            await msg.react(`❌`);
            const filter = (reaction, user_need) => {
                return ['✔', '❌'].includes(reaction.emoji.name) && user_need.id === user.id;
            };

            msg.awaitReactions(filter, { max: 1, time: 20000, errors: ['time'] }).then(async collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === '✔') {
                    if (!user.roles.cache.some(r => r.id == fam_role.id)) user.roles.add(fam_role)
                    let general = message.guild.channels.cache.find(c => c.name == `чат`);
                    if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь участником семьи '${families[0]}'! Пригласил:\` <@${message.author.id}>`);
                    let fam_chat = message.guild.channels.cache.find(c => c.name == `family_chat`);
                    if (fam_chat) await fam_chat.send(`\`[INVITE]\` <@${message.author.id}> \`пригласил пользователя\` <@${user.id}> \`в семью: '${families[0]}'\``);
                    return msg.delete();
                } else {
                    message.channel.send(`<@${message.author.id}>, \`пользователь ${user.displayName} отказался от вашего предложения вступить в семью!\``).then(msg => msg.delete({timeout:15000}));
                    return msg.delete();
                }
            }).catch(async collected => {
                message.channel.send(`<@${message.author.id}>, \`пользователь ${user.displayName} не успел принять ваше предложение!\``).then(msg => msg.delete({timeout:15000}));
                return msg.delete();
            });
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
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты участник более 1-ой семьи! Что бы пригласить участника, нужно выбрать в какую семью ты его будешь приглашать! Используй: /faminvite [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete({timeout:30000}));
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
            if (user.roles.cache.some(r => r.id == fam_role.id)) {
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} уже состоит в данной семье!\``).then(msg => msg.delete({timeout:5000}));
                return message.delete();
            }
            message.delete();
            let msg = await message.channel.send(`<@${user.id}>, \`создатель или заместитель семьи\` <@${message.author.id}> \`приглашает вас вступить в семью:\` **<@&${fam_role.id}>**\n\`Нажмите галочку в течении 10 секунд, если вы согласны принять его приглашение!\``)
            await msg.react(`✔`);
            await msg.react(`❌`);
            const filter = (reaction, user_need) => {
                return ['✔', '❌'].includes(reaction.emoji.name) && user_need.id === user.id;
            };

            msg.awaitReactions(filter, { max: 1, time: 20000, errors: ['time'] }).then(async collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === '✔') {
                    if (!user.roles.cache.some(r => r.id == fam_role.id)) user.roles.add(fam_role)
                    let general = message.guild.channels.cache.find(c => c.name == `чат`);
                    if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь участником семьи '${families[args[1]]}'! Пригласил:\` <@${message.author.id}>`);
                    let fam_chat = message.guild.channels.cache.find(c => c.name == `family_chat`);
                    if (fam_chat) await fam_chat.send(`\`[INVITE]\` <@${message.author.id}> \`пригласил пользователя\` <@${user.id}> \`в семью: '${families[args[1]]}'\``);
                    return msg.delete();
                } else {
                    message.channel.send(`<@${message.author.id}>, \`пользователь ${user.displayName} отказался от вашего предложения вступить в семью!\``).then(msg => msg.delete({timeout:15000}));
                    return msg.delete();
                }
            }).catch(async collected => {
                message.channel.send(`<@${message.author.id}>, \`пользователь ${user.displayName} не успел принять ваше предложение!\``).then(msg => msg.delete({timeout:15000}));
                return msg.delete();
            });
        }
	}
}