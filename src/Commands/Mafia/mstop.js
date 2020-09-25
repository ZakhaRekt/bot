const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');

const mafiaVoiceChannel = '757600478732484639'; //Войс канал мафии
const mafiaTextChannel = '757601774063452210'; //Текстовой канал мафии

const mafiaRolePlayer = '757589808259399712'; //Роль играков мафии
const mafiaRoleLeading = '757589888060227618'; //Роль ведущего

const mafiaBlackTeamChannel = '757601729742373005'; //Канал черных


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
			await message.guild.channels.cache.get(mafiaBlackTeamChannel).permissionOverwrites
				.filter(perm => perm.type === 'member')
				.each(perm => perm.delete());
			await message.channel.send(`Игра успешно остановленна!`)
		});
	}
}

