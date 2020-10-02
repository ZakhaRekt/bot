const Discord = require('discord.js');


let serverid = '465086262383083520';

const MafiaGame = require('../../data/mafia.js');


const mafiaVoiceChannel = '611151814573686785'; //Войс канал мафии
const mafiaTextChannel = '702883306143744010'; //Текстовой канал мафии

const mafiaRolePlayer = '708319573451210796'; //Роль играков мафии
const mafiaRoleLeading = '714505482257170492'; //Роль ведущего

module.exports = async (bot,reaction,user) => {
	if (reaction.message.partial) await reaction.message.fetch(); 
 	if (reaction.partial) await reaction.fetch();
	if(reaction.message.guild.id != serverid) return; //если сервер не тот


	if (reaction.message.channel.id === mafiaTextChannel) { 


    if (reaction.emoji.name === "✔") {
           if(reaction.message.guild.member(user.id).roles.cache.some(role => role.id === mafiaRoleLeading)) return;
    		const botMsg = reaction.message;
    		MafiaGame.findOne({started:false}, async (err,data) => {
    			if(err) console.log(err);
    			if(!data) {
    				console.log(`No data found on Reaction Remove!`);
    			}
    			let GamerRemove = data.gamersDescription.indexOf(`<@${user.id}>`);
                await data.gamersDescription.splice(GamerRemove, 1);

                let PlayerRemove = data.players.indexOf(user.id);
                await data.players.splice(PlayerRemove, 1);

    			await data.save().catch(err => console.log(err));


    			const emb = new Discord.MessageEmbed()
	    			.setTitle(`${botMsg.embeds[0].title}`)
	    			.setColor(`RED`)
	    			.setDescription(`${data.gamersDescription.join(", \n")}`)
	    			.setFooter(`✔ - записаться на игру | ▶️ - начать игру | ❌ - отменить игру`)
    			await botMsg.edit(emb);
    		});
    	}
     	
    
  } else {
    return; 
  }

}