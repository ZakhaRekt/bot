const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');

const mafiaVoiceChannel = '611151814573686785'; //Войс канал мафии
const mafiaTextChannel = '702883306143744010'; //Текстовой канал мафии

const mafiaRolePlayer = '708319573451210796'; //Роль играков мафии
const mafiaRoleLeading = '714505482257170492'; //Роль ведущего


module.exports = {
	name: 'mstop',
	category:"mafia",
	description: "Остановить Мафию",

	async run(bot,message) {
		await MafiaGame.findOne({gameName: `game-${message.author.id}`, started:true}, async(err,data) => {
			if(message.channel.id != mafiaTextChannel) return;
			if(err) console.log(err);
			if(!data) {
				return message.channel.send(`Вы не можете использовать команды!Вы не ведущий`)
			}
			await data.players.forEach(async(element, index) => {
				await message.guild.member(element).setNickname(data.playersNicknames.get(element));
				await message.guild.member(element).roles.remove(mafiaRolePlayer);
			});
			await data.delete();
			await message.channel.send(`Игра успешно остановленна!`)
		});
	}
}

