const Discord = require('discord.js');
const Guild = require('../../data/guild.js');
const Report = require('../../data/report.js');

const StuffRoles = [
	"⚒ Куратор Дискорда ⚒",
    "⚒ Deputy Curator ⚒", 
    "⚒ Technical Administrator Discord ⚒"
];



module.exports = {
	name: 'addmoder',
	category: 'moderation',
	description: 'Добавить модератора',

	async run (bot,message,args) {
		if(!message.member.roles.cache.some(role => StuffRoles.includes(role.name))) {
			return message.channel.send(`**У вас нет прав для использования данной команды!**`)
		}
		if(!args[0]) {
			return message.channel.send(new Discord.MessageEmbed()
				.setTitle(`**Ошибка!**`)
				.setColor(`RED`)
				.setDescription(`**Вы не указали кого добавить!**`)
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
				await guild.purpleModer.push(`<@${ModerMember.id}>`);
				await message.channel.send(new Discord.MessageEmbed().setColor(`RED`).setDescription(` Пользователь ${ModerMember} успешно добавлен в группу Ст.Модераторы!`))
				return await guild.save();
			}
			if(+args[1] == 2) {
				await guild.yellowModer.push(`<@${ModerMember.id}>`);
				await message.channel.send(new Discord.MessageEmbed().setColor(`RED`).setDescription(` Пользователь ${ModerMember} успешно добавлен в группу Модераторы!`))
				return await guild.save();
			}
			if(+args[1] == 3) {
				await guild.blueModer.push(`<@${ModerMember.id}>`);
				await message.channel.send(new Discord.MessageEmbed().setColor(`RED`).setDescription(` Пользователь ${ModerMember} успешно добавлен в группу Стажёры!`))
				return await guild.save();
			}
		});
	}
}
