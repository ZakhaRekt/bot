const Discord = require('discord.js');

module.exports = {
	name: 'famaddzam',
	category:"family",
	description: "Кманда добавления зама в фаму",


	async run (bot,message,args) {
		if (message.content == `/famaddzam`) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famaddzam [user]\``).then(msg => msg.delete({timeout:1000}));
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
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famaddzam [user]\``).then(msg => msg.delete({timeout:7000}));
            return message.delete();
        }

        if (user.id == message.author.id) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`воу, воу! Полегче! Если ты сделаешь себя заместителем, то у тебя не будет права управления семьей!\``).then(msg => msg.delete({timeout:10000}));
            return message.delete();
        }

        if (families.length == 1) {
            let fam_role;
            let fam_channel;
            await message.guild.channels.cache.filter(async channel => {
                if (channel.name == families[0]) {
                    if (channel.type == "voice") {
                        if (channel.parent.name.toString() == `Family ROOMS`) {
                            fam_channel = channel;
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
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} должен состоять в семье, что бы быть заместителем!\``).then(msg => msg.delete({timeout:10000}));
                return message.delete();
            }
            message.delete();
            await fam_channel.createOverwrite(user, {
                   // GENERAL PERMISSIONS
                    CREATE_INSTANT_INVITE: false,
                    MANAGE_CHANNELS: false,
                    MANAGE_ROLES: false,
                    MANAGE_WEBHOOKS: false,
                    // VOICE PERMISSIONS
                    VIEW_CHANNEL: true,
                    CONNECT: true,
                    SPEAK: true,
                    MUTE_MEMBERS: true,
                    DEAFEN_MEMBERS: false,
                    MOVE_MEMBERS: false,
                    USE_VAD: true,
                    PRIORITY_SPEAKER: true,
                });
            let general = message.guild.channels.cache.find(c => c.name == `чат`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь заместителем семьи '${families[0]}'! Назначил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.cache.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`назначил заместителя\` <@${user.id}> \`семья: '${families[0]}'\``);
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
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты владелец более 1-ой семьи! Что бы назначить заместителя, нужно выбрать в какую семью ты его будешь назначить! Используй: /famaddzam [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete({timeout:30000}));
                return message.delete();
            }
            if (!families[args[1]] || families[args[1]] == undefined) {
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete({timeout:10000}));
                return message.delete();
            }
            let fam_role;
            let fam_channel;
            await message.guild.channels.cache.filter(async channel => {
                if (channel.name == families[args[1]]) {
                    if (channel.type == "voice") {
                        if (channel.parent.name.toString() == `Family ROOMS`) {
                            let fam_channel = channel;
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
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} должен состоять в семье, что бы быть заместителем!\``).then(msg => msg.delete({timeout:10000}));
                return message.delete();
            }
            message.delete();
            await fam_channel.createOverwrite(user, {
                   // GENERAL PERMISSIONS
                    CREATE_INSTANT_INVITE: false,
                    MANAGE_CHANNELS: false,
                    MANAGE_ROLES: false,
                    MANAGE_WEBHOOKS: false,
                    // VOICE PERMISSIONS
                    VIEW_CHANNEL: true,
                    CONNECT: true,
                    SPEAK: true,
                    MUTE_MEMBERS: true,
                    DEAFEN_MEMBERS: false,
                    MOVE_MEMBERS: false,
                    USE_VAD: true,
                    PRIORITY_SPEAKER: true,
                });
            let general = message.guild.channels.cache.find(c => c.name == `чат`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь заместителем семьи '${families[args[1]]}'! Назначил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.cache.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`назначил заместителем\` <@${user.id}> \`семья: '${families[args[1]]}'\``);
            return
        }
	}
}