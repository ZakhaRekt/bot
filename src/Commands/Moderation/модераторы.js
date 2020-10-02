const Discord = require('discord.js');
const Guild = require('../../data/guild.js');
const Report = require('../../data/report.js');




module.exports = {
	name: 'модераторы',
	category: 'moderation',
	description: 'Список модераторов',

	async run (bot,message,args) {
			Guild.findOne({guildID: message.guild.id}, async(err,guild) => {
				if(err) console.log(err);
				if(!guild) {
					return message.channel.send(`Гильдия не найдена в активных`);
				}
				const ModerEmb = new Discord.MessageEmbed()
					.setTitle(`**Список Модерации Дискорд**`)
					.setColor(`RED`)
					.setFooter(`> Rodina 02 | Moderation <`);
				if(guild.purpleModer.length > 0 ){
					ModerEmb.addField(`**Старшие Модераторы**`, `${guild.purpleModer.join("\n")}`);
				}
				if(guild.yellowModer.length > 0) {
					ModerEmb.addField(`**Модераторы**`,`${guild.yellowModer.join("\n")}`);
				}
				if(guild.blueModer.length > 0) {
					ModerEmb.addField(`**Стажёры**`, `${guild.blueModer.join("\n")}`);
				}

				message.channel.send(ModerEmb);
			});
	}
}