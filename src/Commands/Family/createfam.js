const Discord = require('discord.js');
const { randomColor, getRandomInt } = require("../../../functions.js");


module.exports = {
	name: 'createfam',
	category:"family",
	description: "Создать семью",

	async run (bot,message,args) {

		if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`\`эй! Эта функция только для модераторов!\``) && message.delete()
        let idmember = message.author.id;
        let family_name;
        let family_leader;
        await message.delete();
        await message.channel.send(`\`[FAMILY] Название семьи: [напиши название семьи в чат]\n[FAMILY] Создатель семьи [ID]: [ожидание]\``).then(async delmessage0 => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then(async (collected) => {
                family_name = `${collected.first().content}`;
                await delmessage0.edit(`\`[FAMILY] Название семьи: '${collected.first().content}'\n[FAMILY] Создатель семьи [ID]: [на модерации, если надо себя, отправь минус]\``)
                collected.first().delete();
                message.channel.awaitMessages(response => response.member.id == message.member.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then(async (collectedd) => {
                    if (!message.guild.members.cache.find(m => m.id == collectedd.first().content)) {
                        family_leader = `${idmember}`;
                    } else {
                        family_leader = `${collectedd.first().content}`;
                    }
                    await delmessage0.edit(`\`[FAMILY] Название семьи: '${family_name}'\n[FAMILY] Создатель семьи: ${message.guild.members.cache.find(m => m.id == family_leader).displayName}\nСоздать семейный канал и роль [да/нет]?\``)
                    collectedd.first().delete();
                    message.channel.awaitMessages(response => response.member.id == message.member.id, {
                        max: 1,
                        time: 20000,
                        errors: ['time'],
                    }).then(async (collecteds) => {
                        if (!collecteds.first().content.toLowerCase().includes('да')) return delmessage0.delete();
                        collecteds.first().delete();
                        delmessage0.delete();

                        let family_channel = null;
                        let myfamily_role = null;
                        await message.guild.channels.cache.filter(async channel => {
                            if (channel.name == family_name) {
                                if (channel.type == "voice") {
                                    if (channel.parent.name == `Family ROOMS`) {
                                        family_channel = channel;
                                        await channel.permissionOverwrites.forEach(async perm => {
                                            if (perm.type == `role`) {
                                                let role_fam = message.guild.roles.cache.find(r => r.id == perm.id);
                                                if (role_fam.name == channel.name) {
                                                    myfamily_role = role_fam;
                                                }
                                            }
                                        })
                                    }
                                }
                            }
                        });
                        if (family_channel != null || myfamily_role != null) {
                            message.channel.send(`\`[ERROR]\` <@${idmember}> \`ошибка! Семья: '${family_name}' уже существует!\``).then(msg => msg.delete({timeout:10000}));
                            return
                        }
                        let family_role = await message.guild.roles.create({
                            data: {
                                name: `${family_name}`,
                                position: message.guild.roles.cache.find(r => r.name == `★ Молчанка ★`).position + 1,
                                color: `#${randomColor()}`
                            },
                            reason: 'Create Family',
                        })
                        await message.guild.channels.create(`${family_name}`, {
                            type: "voice",
                            reason: "Creating Family Channel" 
                        } ).then(async (channel) => {
                            await channel.setParent(message.guild.channels.cache.find(c => c.name == `Family ROOMS`))
                            await channel.overwritePermissions
                            (   
                                [
                                    {
                                        id:family_role.id,
                                        allow:['VIEW_CHANNEL','CONNECT','SPEAK','USE_VAD'],
                                        deny:['CREATE_INSTANT_INVITE','MANAGE_CHANNELS','MANAGE_ROLES','MANAGE_WEBHOOKS','MUTE_MEMBERS','DEAFEN_MEMBERS','MOVE_MEMBERS','PRIORITY_SPEAKER']
                                    },
                                    {
                                        id:message.guild.members.cache.find(m => m.id == family_leader).id,
                                        allow:['VIEW_CHANNEL','CONNECT','SPEAK','USE_VAD','CREATE_INSTANT_INVITE','MUTE_MEMBERS','PRIORITY_SPEAKER'],
                                        deny:['MANAGE_CHANNELS','MANAGE_ROLES','MANAGE_WEBHOOKS','DEAFEN_MEMBERS','MOVE_MEMBERS']
                                    },
                                    {
                                        id:message.guild.roles.cache.find(r => r.name == `@everyone`).id,
                                        allow:[],
                                        deny:['CREATE_INSTANT_INVITE','MANAGE_CHANNELS','MANAGE_ROLES','MANAGE_WEBHOOKS','MUTE_MEMBERS','DEAFEN_MEMBERS','MOVE_MEMBERS','PRIORITY_SPEAKER','VIEW_CHANNEL','CONNECT','SPEAK','USE_VAD']
                                    }

                                ]
                            );
                            if (message.guild.channels.cache.find(c => c.name == `family-chat`)) {
                                await message.guild.channels.cache.find(c => c.name == `family-chat`).createOverwrite(family_role, {
                                            // GENERAL PERMISSIONS
                                            CREATE_INSTANT_INVITE: false,
                                            MANAGE_CHANNELS: false,
                                            MANAGE_ROLES: false,
                                            MANAGE_WEBHOOKS: false,
                                            // TEXT PERMISSIONS
                                            VIEW_CHANNEL: true,
                                            READ_MESSAGE_HISTORY: true,
                                            ATTACH_FILES: true,
                                            SEND_MESSAGES: true,
                                            MANAGE_MESSAGES: false,
                                            MENTION_EVERYONE: false,
                                            SEND_TTS_MESSAGES: false,
                                            EMBED_LINKS: true,

                                });
                               
                            }
                            await message.guild.members.cache.find(m => m.id == family_leader).roles.add(family_role);
                            let general = message.guild.channels.cache.find(c => c.name == `чат`);
                            if (general) await general.send(`<@${family_leader}>, \`модератор\` <@${idmember}> \`назначил вас контролировать семью: ${family_name}\``)
                            let fam_chat = message.guild.channels.cache.find(c => c.name == `family-chat`);
                            if (fam_chat) await fam_chat.send(`\`[CREATE]\` \`Пользователь\` <@${family_leader}> \`стал лидером семьи '${family_name}'! Назначил:\` <@${idmember}>`);
                            return
                        })
                    }).catch(() => {
                        return delmessage0.delete();
                    })
                }).catch(() => {
                    return delmessage0.delete();
                })
            }).catch(() => {
                return delmessage0.delete();
            })
        })
	}
}