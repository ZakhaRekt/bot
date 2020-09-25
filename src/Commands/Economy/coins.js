const Discord = require('discord.js');
const User = require("../../data/user.js");

module.exports = {
	name: "coins",
    category:"economy",
	description: "Команда просмотра количаства коинов",
	async run (bot,message,args) {
	if(!args[0]) {
        User.findOne({userID: message.member.id}, async(err, data) => {
            if(!data) {
                await message.delete();
            }
            const selfcoins = new Discord.MessageEmbed()
                .setColor("#FC0202")
                .setTitle(`Rodina 01 | Coins`)
                .setDescription(`
                    Nickname: <@${message.author.id}> 
                    Coins: ${data.coins}
                 `)
                .setFooter(`By Developer Montano`)
                return await message.reply(selfcoins);
        });
        return;
    }
    const coin_member = message.mentions.members.first();
    if(!coin_member) {
        await message.delete();
        return await message.channel.send(`\`\`Упомяните человека!\`\``)
            .then(msg => msg.delete({timeout:5000}));
    }
    User.findOne({userID: coin_member.id}, async(err, data) => {
        if(!data) {
            await message.delete();
            return await message.channel.send(`\`\`Пользователь не записаны в банк тыквенных семечек! Обратитесь к Тех.Администратору!\`\``)
                .then(msg => msg.delete({timeout:5000}));
        }
        await message.delete();
        const mentioncoins = new Discord.MessageEmbed()
                .setColor("#FC0202")
                .setTitle(`Rodina 01 | Coins`)
                .setDescription(`
                    Nickname: <@${coin_member.id}> 
                    Coins: ${data.coins}
                 `)
                .setFooter(`By Developer Montano`)
        await message.channel.send(mentioncoins)
            .then(msg => msg.delete({timeout:10000}));

    });
	}
}