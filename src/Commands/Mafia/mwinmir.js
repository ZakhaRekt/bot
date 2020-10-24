const Discord = require('discord.js');

const MafiaGame = require('../../data/mafia.js');

const mafiaVoiceChannel = '611151814573686785'; //Войс канал мафии
const mafiaTextChannel = '702883306143744010'; //Текстовой канал мафии

const mafiaRolePlayer = '708319573451210796'; //Роль играков мафии
const mafiaRoleLeading = '714505482257170492'; //Роль ведущего

module.exports = {
	name: 'mwinmir',
	category:"mafia",
	description: "Выиграли Мирные",

	async run(bot,message) {
		if(message.channel.id != mafiaTextChannel) return;
		if(!message.member.roles.cache.some(role => role.id === mafiaRoleLeading)) return;
		MafiaGame.findOne({gameName: `game-${message.author.id}`, started:true}, async(err,data) => {
			if(err) console.log(err);
			if(!data) {
				return message.reply(`Вы не создатель данной игры!`);
			}
			const MafEmb = new Discord.MessageEmbed()
				.setTitle(`**Победа мирных!**`)
				.setColor(`RED`)
				.setDescription(``);
			await data.players.forEach((element, index) => {
				message.guild.member(element).setNickname(data.playersNicknames.get(element));
				message.guild.member(element).roles.remove(mafiaRolePlayer);
				MafEmb.setDescription(`${MafEmb.description} \n <@${element}> \n`);
			});
			await message.channel.send(MafEmb);
			await data.delete(); 
		});
	}
}