const Discord = require('discord.js');
module.exports = {
	name: "clear",
    category:"moderation",
	description: "Очистить сообщения в чате",

	async run (bot,message,args) {
		if(!args[0]){
			return message.channel.send(
				new Discord.MessageEmbed()
					.setColor('YELLOW')
					.setDescription(`**Вы не указали пользователя или количество сообщений!**`)
			)
		}
		if(+args[0] != NaN && +args[0] <= 50) {
			let emb = new Discord.MessageEmbed()
				.setColor(`${message.member.displayHexColor}`)
				.setTitle(`**Удаление сообщений**`)
				.setDescription(`**Процесс 0/${args[0]}**`)
			message.channel.send(emb).then(msg => {
			return message.channel.messages.fetch({limit:+args[0]}).then(messages => messages
				.filter(msg => !msg.author.bot)
				.array()
				.forEach((message,element) => {
				message.delete()
				msg.edit(``,new Discord.MessageEmbed()
					.setColor(`${message.member.displayHexColor}`)
					.setTitle(`**Удаление сообщений**`)
					.setDescription(`**Процесс ${element}/${args[0]}**`))
			}))
		})
	}
		if(message.guild.member(message.mentions.users.first())) {
			if(+args[0] != NaN) return;
			if(+args[1] != NaN && +args[1] <=50) {
				let ManiMsgID = '';
				let emb = new Discord.MessageEmbed()
					.setColor(`${message.member.displayHexColor}`)
					.setTitle(`**Удаление сообщений**`)
					.setDescription(`**Процесс 0/${args[1]}**`)
				message.channel.send(emb).then(msg => ManiMsgID = msg.id);
				return message.channel.messages.fetch({limit:+args[1]}).then(messages => messages
					.filter(msg => msg.author == message.mentions.users.first())
					.array()
					.forEach((message,element) => {
					if(message.author.bot) return;
					message.delete()
					message.channel.messages.cache.get(ManiMsgID).edit(``,new Discord.MessageEmbed()
						.setColor(`${message.member.displayHexColor}`)
						.setTitle(`**Удаление сообщений**`)
						.setDescription(`**Процесс ${messages.size}/${args[1]}**`))
				}))
			}
				else {
					let ManiMsgID = '';
					let emb = new Discord.MessageEmbed()
						.setColor(`${message.member.displayHexColor}`)
						.setTitle(`**Удаление всех сообщений ${message.member.displayName}**`)
						.setDescription(`**Процесс 0/50**`)
					message.channel.send(emb).then(msg => ManiMsgID = msg.id);
					return message.channel.messages.fetch({limit:50}).then(messages => messages
						.filter(msg => msg.author == message.mentions.users.first())
						.each(message => {
						if(message.author.bot) return;
						message.delete()
						message.channel.messages.cache.get(ManiMsgID).edit(``,new Discord.MessageEmbed()
							.setColor(`${message.member.displayHexColor}`)
							.setTitle(`**Удаление всех сообщений ${message.member.displayName}**`)
							.setDescription(`**Процесс ${messages.size}**`))
				})
			)
		}
	}
}
}