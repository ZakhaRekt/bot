const Discord = require('discord.js');


const serverid = '325607843547840522';
const MafiaGame = require('../../data/mafia.js');


const mafiaVoiceChannel = '757600478732484639'; //Войс канал мафии
const mafiaTextChannel = '757601774063452210'; //Текстовой канал мафии

const mafiaRolePlayer = '757589808259399712'; //Роль играков мафии
const mafiaRoleLeading = '757589888060227618'; //Роль ведущего

const mafiaBlackTeamChannel = '757601729742373005'; //Канал черных

module.exports = async (bot,reaction,user) => {
	if (reaction.message.partial) await reaction.message.fetch(); 
 	if (reaction.partial) await reaction.fetch();
	if(reaction.message.guild.id != serverid) return; //если сервер не тот


	if (reaction.message.channel.id === mafiaTextChannel) { 


    if (reaction.emoji.name === "✔") {
           if(reaction.message.guild.member(user.id).roles.cache.some(role => role.id === mafiaRoleLeading)) return;
        if(reaction.message.guild.member(user).voice.channel.id != mafiaVoiceChannel) return;

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