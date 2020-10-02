const Discord = require('discord.js');
const Guild = require('../../data/guild.js');
const Report = require('../../data/report.js');

const StuffRoles = [
	"⚒ Куратор Дискорда ⚒",
    "⚒ Deputy Curator ⚒", 
    "⚒ Technical Administrator Discord ⚒"
];


module.exports = {
	name: 'removemoder',
	category: 'moderation',
	description: 'Убрать модератора',

	async run (bot,message,args) {
		if(!message.member.roles.cache.some(role => StuffRoles.includes(role.name))) {
			return message.channel.send(`**У вас нет прав для использования данной команды!**`)
		}
		if(!args[0]) {
			return message.channel.send(new Discord.MessageEmbed()
				.setTitle(`**Ошибка!**`)
				.setColor(`RED`)
				.setDescription(`**Вы не указали кого убрать!**`)
				)
		}
		const ModerMember = message.mentions.members.first();
		if(!ModerMember) {
			return message.channel.send(`**Пользователь которого вы указали не найден на сервере!**`);

		}
		if(!args[1]) {
			return message.channel.send(new Discord.MessageEmbed()
				.setTitle(`**Ошибка!**`)
				.setColor(`RED`)
				.setDescription(`**Вы не указали группу для модератора
					1) Старший модератор
					2) Модератор
					3) Стажёр
					 **
					`)
				)
		}
		Guild.findOne({guildID:message.guild.id}, async(err,guild) => {
			if(err) console.log(err);
			if(!guild) {
				return console.log(`Guild no fould`);
			}
			if(+args[1] == 1) {
				const index = guild.purpleModer.indexOf(`<@${ModerMember.id}>`);
				await guild.purpleModer.splice(index, 1);
				await message.channel.send(new Discord.MessageEmbed().setColor(`RED`).setDescription(` Вы убрали пользователя ${ModerMember} из группы Ст.Модераторы!`))
				return await guild.save();
			}
			if(+args[1] == 2) {
				const index = guild.yellowModer.indexOf(`<@${ModerMember.id}>`);
				await guild.yellowModer.splice(index, 1);
				await message.channel.send(new Discord.MessageEmbed().setColor(`RED`).setDescription(` Вы убрали пользователя ${ModerMember} из Группы Модераторы!`))
				return await guild.save();
			}
			if(+args[1] == 3) {
				const index = guild.blueModer.indexOf(`<@${ModerMember.id}>`);
				await guild.blueModer.splice(index, 1);
				await message.channel.send(new Discord.MessageEmbed().setColor(`RED`).setDescription(` Вы убрали пользователя ${ModerMember} из группы Стажёры!`))
				return await guild.save();
			}
		});
	}
}
