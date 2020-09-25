const Discord = require('discord.js');

const serverid = '325607843547840522';
const MafiaGame = require('../../data/mafia.js');
const { getRandomInt, randomColor } = require("../../../functions.js");

const mafiaVoiceChannel = '757600478732484639'; //Войс канал мафии
const mafiaTextChannel = '757601774063452210'; //Текстовой канал мафии

const mafiaRolePlayer = '757589808259399712'; //Роль играков мафии
const mafiaRoleLeading = '757589888060227618'; //Роль ведущего

const mafiaBlackTeamChannel = '757601729742373005'; //Канал черных


module.exports = async (bot,reaction,user) => {
if (reaction.message.partial) await reaction.message.fetch(); 
  if (reaction.partial) await reaction.fetch();
  
  if (user.bot) return; 
  if (!reaction.message.guild) return; 

  if (reaction.message.guild.id !== serverid) return;
  
  if (reaction.message.channel.id === mafiaTextChannel) { 
  MafiaGame.findOne({started:false}, async (err,data) => {
    if(err) console.log(err);
            if(!data) {
              return console.log(`No data found on Readction Add`);
            }
    const messageOfLeader = reaction.message;
    const mainEmb = new Discord.MessageEmbed()
              .setTitle(`Начинаем!`)
              .setColor(`RED`) 
              .setFooter(`✔ - записаться на игру | ▶️ - начать игру | ❌ - отменить игру`)


              /*Регистрация*/
    if (reaction.emoji.name === "✔") {
    	if(reaction.message.author.bot){
    		if(reaction.count >= 12 || reaction.message.guild.member(user).voice.channel.id != mafiaVoiceChannel) {
          const userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
            try {
              for (const react of userReactions.values()) {
                return await react.users.remove(user.id);
              }
            } catch (error) {
              console.error('Failed to remove reactions.');
            }
        }
        }
        if(reaction.message.guild.member(user).voice.channel.id != mafiaVoiceChannel) return;
        if(reaction.message.guild.member(user.id).roles.cache.some(role => role.id === mafiaRoleLeading)) return;
    				await data.gamersDescription.push(`<@${user.id}>`);
            await data.players.push(user.id);
    				
    				await data.save().catch(err => console.log(err));
    				await mainEmb.setDescription(data.gamersDescription.join(", \n"));
    				await reaction.message.edit(mainEmb);
    	}
     	
    
    /*Старт игры*/
    if (reaction.emoji.name === "▶️") {
        if(!reaction.message.guild.member(user).roles.cache.some(role => role.id === mafiaRoleLeading)) return;
        if(data.players.length < 10) return reaction.message.channel.send(`Вы не можете начать игру, не хватает игроков! ${data.players.length}/10`);
        await reaction.message.channel.send(`<@${user.id}> Начал игру! Идёт раздача ролей!`);
        await data.players.forEach((element,index) => {
          if(!reaction.message.guild.channels.cache.find(ch => ch.id === mafiaVoiceChannel).members.has(element)) {
              reaction.message.channel.send(`<@${element}> Зайдите в голосовой канал ${reaction.message.guild.channels.cache.find(ch => ch.id == mafiaVoiceChannel).name}!`);
          }
            data.playersNicknames.set(element,reaction.message.guild.member(element).displayName);
            data.fouls.set(element,0);
            const randomRole = getRandomInt(0,data.roles.length);
            const Role = new Discord.MessageEmbed()
              .setTitle(`**Выдача ролей**`)
              .setColor(`${randomColor()}`)
              .setDescription(`Ваша роль ${data.roles[randomRole]}`);
            try {
               reaction.message.guild.member(element).send(Role);
               if(data.roles[randomRole] === 'Мафия' || data.roles[randomRole] === 'Дон Мафии') {
                  reaction.message.guild.channels.cache.get(mafiaBlackTeamChannel).createOverwrite(reaction.message.guild.member(element).user, {
                                            // GENERAL PERMISSIONS
                                            CREATE_INSTANT_INVITE: false,
                                            MANAGE_CHANNELS: false,
                                            MANAGE_ROLES: false,
                                            MANAGE_WEBHOOKS: false,
                                            // TEXT PERMISSIONS
                                            VIEW_CHANNEL: true,
                                            READ_MESSAGE_HISTORY: true,
                                            ATTACH_FILES: true,
                                            SEND_MESSAGES: true,
                                            MANAGE_MESSAGES: false,
                                            MENTION_EVERYONE: false,
                                            SEND_TTS_MESSAGES: false,
                                            EMBED_LINKS: true,
                  }); 
            } 
          } catch(e) {
              reaction.message.channel.send(new Discord.MessageEmbed().setColor(`PURPLE`).setDescription(`<@${element}> У вас закрыта личка! Игра не начата!`));
              data.players.forEach((el, index) => {
                reaction.message.guild.member(el).roles.remove(mafiaRolePlayer);
                reaction.message.guild.member(el).setNickname(data.playersNicknames.get(el));
              });
              return data.delete();
            }
             reaction.message.guild.member(user).send(`Игрок ${reaction.message.guild.member(element).displayName} имеет роль ${data.roles[randomRole]}.`);
             data.roles.splice(randomRole,1);
             reaction.message.guild.member(element).setNickname(`[${index+1}]`);
             reaction.message.guild.member(element).roles.add(mafiaRolePlayer);
        });
        data.started = true;
        await data.save().catch(err => console.log(err));
        await reaction.message.delete({timeout:3000});

    }


     if (reaction.emoji.name === "❌") {
         if(!reaction.message.guild.member(user).roles.cache.some(role => role.id === mafiaRoleLeading)) return;
         await reaction.message.channel.send(`Игра отменена пользователем <@${user.id}>`);
         await data.delete();
         return await reaction.message.delete({timeout:3000});
     }
  })    
}
} 
