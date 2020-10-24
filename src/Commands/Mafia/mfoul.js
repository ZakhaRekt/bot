const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');

const mafiaVoiceChannel = '611151814573686785'; //Войс канал мафии
const mafiaTextChannel = '702883306143744010'; //Текстовой канал мафии

const mafiaRolePlayer = '708319573451210796'; //Роль играков мафии
const mafiaRoleLeading = '714505482257170492'; //Роль ведущего



module.exports = {
	name: 'mfoul',
	category:"mafia",
	description: "Выдать фол",

	async run (bot,message,args) {
		if(message.channel.id != mafiaTextChannel) return;
		if(!message.member.roles.cache.some(role => role.id === mafiaRoleLeading)) return;
		MafiaGame.findOne({gameName: `game-${message.author.id}`,started:true}, async(err,data) => {
			if(err) console.log(err);
			if(!data) {
				return message.channel.send(`\`\`Ведущий игры не вы!\`\``);
			}
			if(data.paused) return message.channel.send(`\`\`Вы не можете выдать фол пока игра на паузе!\`\``);
			if(!args[0]) {
				return message.channel.send(`\`\`Упомяните пользователя которому хотите выдать фол!\`\``);
			}
			const memberToFoul = message.mentions.members.first();
			if(!memberToFoul) {
				return message.channel.send(`Пользователь не найден на сервере!`);
			}
			if(!data.fouls.has(memberToFoul.id)) {
				return message.channel.send(`\`\`Пользователь которому вы пытаетесь выдать фол не играет!\`\``);
			}
			await data.fouls.set(memberToFoul.id, data.fouls.get(memberToFoul.id) + 1);
			await memberToFoul.setNickname(`${memberToFoul.displayName} F`);
			await data.save();
			const FoulEmb = new Discord.MessageEmbed()
				.setTitle(`**Фол!**`)
				.setColor(`RED`)
				.setDescription(`
					Игрок ${memberToFoul} получил фол! \n
					Выдал: ${message.member}
					`)
			await message.channel.send(FoulEmb);
			if(data.fouls.get(memberToFoul.id) == 4) {
				await data.fouls.delete(memberToFoul.id);
				await memberToFoul.setNickname(data.playersNicknames.get(memberToFoul.id));
				await data.playersNicknames.delete(memberToFoul.id);
				await memberToFoul.roles.remove(mafiaRolePlayer);
				let player = data.players.indexOf(memberToFoul.id);
				await data.players.splice(player,1);
				const fourFouls = new Discord.MessageEmbed()
					.setTitle(`**Поднятие!**`)
					.setColor(`RED`)
					.setDescription(`Игрок ${memberToFoul} был поднят со стола по 4-ем фолам! \n
						Поднял: <@${message.author.id}>
						`);
				return message.channel.send(fourFouls);
			}
		});
	}
}