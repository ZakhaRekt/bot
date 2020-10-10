const Discord = require('discord.js');

const MafiaGame = require('../../data/mafia.js');
const User = require('../../data/user.js');

const mafiaVoiceChannel = '757600478732484639'; //Войс канал мафии
const mafiaTextChannel = '757601774063452210'; //Текстовой канал мафии

const mafiaRolePlayer = '757589808259399712'; //Роль играков мафии
const mafiaRoleLeading = '757589888060227618'; //Роль ведущего

const mafiaBlackTeamChannel = '757601729742373005'; //Канал черных


module.exports = {
	name: 'mwinmaf',
	category:"mafia",
	description: "Выиграла мафия",

	async run(bot,message) {
		if(message.channel.id != mafiaTextChannel) return;
		if(!message.member.roles.cache.some(role => role.id === mafiaRoleLeading)) return;
		MafiaGame.findOne({gameName: `game-${message.author.id}`, started:true}, async(err,data) => {
			if(err) console.log(err);
			if(!data) {
				return message.reply(`Вы не создатель данной игры!`);
			}
			const MafEmb = new Discord.MessageEmbed()
				.setTitle(`**Победа мафии!**`)
				.setColor(`RED`)
				.setDescription(`На столе остались: \n`);
			await data.players.forEach((element, index) => {
				message.guild.member(element).setNickname(data.playersNicknames.get(element));
				message.guild.member(element).roles.remove(mafiaRolePlayer);
				MafEmb.setDescription(`${MafEmb.description} <@${element}> \n`);
				User.findOne({userID: element}, (ferr,user) => {
					if(ferr) console.log(ferr);
					if(!user) {
						return message.channel.send(`Пользователю <@${element}> не были выданы коины! Он не занесён в базу данных!`);
					}
					user.coins += 2;
					user.save();
				});
			});
			await message.guild.channels.cache.get(mafiaBlackTeamChannel).permissionOverwrites
					.filter(perm => perm.type === 'member')
					.each(perm => perm.delete());
			await message.channel.send(MafEmb);
			await data.delete();
		});
	}
}