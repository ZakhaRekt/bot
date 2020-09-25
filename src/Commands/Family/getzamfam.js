const Discord = require('discord.js');

module.exports = {
	name: 'getzamfam',
	category:"family",
	description: "Админская команда получения замки фамы",

	async run (bot,message,args) {
		if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`\`эй! Эта функция только для модераторов!\``) && message.delete()
        if (message.content == `/getzamfam`) {
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /getzamfam [family]\``).then(msg => msg.delete({timeout:10000}));
            return message.delete();
        }

        let fam_channel;
        await message.guild.channels.cache.filter(async channel => {
            if (channel.name == args.slice(0).join(" ")) {
                if (channel.type == "voice") {
                    if (channel.parent.name.toString() == `Family ROOMS`) {
                        fam_channel = channel;
                    }
                }
            } else if (channel.name.toLowerCase().includes(args.slice(0).join(" ").toLowerCase())) {
                if (channel.type == "voice") {
                    if (channel.parent.name.toString() == `Family ROOMS`) {
                        fam_channel = channel;
                    }
                }
            }
        });
        if (!fam_channel) {
            message.reply(`\`семья не найдена!\``).then(msg => msg.delete({timeout:12000}));
            return message.react(`❌`);
        }
        await fam_channel.createOverwrite(message.member, {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // VOICE PERMISSIONS
            VIEW_CHANNEL: true,
            CONNECT: true,
            SPEAK: true,
            MUTE_MEMBERS: false,
            DEAFEN_MEMBERS: false,
            MOVE_MEMBERS: false,
            USE_VAD: true,
            PRIORITY_SPEAKER: true,
        });
        return message.react('✔');
    }

}