const Discord = require('discord.js');
const Guild = require('../../data/guild.js');
const Report = require('../../data/report.js');

const { getRandomInt, randomColor } = require("../../../functions.js");





module.exports = {
	name: 'close_rep',
	category: 'moderation',
	description: 'Закритие вопроса',

	async run (bot,message,args) {
        const tehchannel = message.guild.channels.cache.find(c=> c.name == `📜вопросы-и-жалобы`);
		 if (message.channel.parent.id === "757598790197706763") {
            if(message.member.hasPermission('MANAGE_ROLES')) {
                if(!args[0]) return;
                const mainUser = message.mentions.members.first();
                Guild.findOne({guildID: message.guild.id}, async(err,guild) => {
                    if(err) console.log(err);
                    if(!guild) {
                        return console.log(`Server is undefined`);
                    }
                    await Report.findOne({reportUser: mainUser.id}, (err,user) => {
                        if(err) console.log(err);
                        if(!user) {
                            return console.log(`Пользователь репорт которого вы пытаетесь закрыть не найден в БД.Обратитесь к тех адмнку.`); 
                        }
                            user.delete()
                            guild.activeReports--;
                            guild.closedReports++;
                            guild.save();
                        tehchannel.messages.fetch('758000475961294889')
                        .then(message => message.edit(
                            new Discord.MessageEmbed()
                                .setAuthor("Report » Обработчик репортов.","https://cdn.discordapp.com/avatars/509074641025892419/c6f9ba7a1038a81f9876d162df5a89a6.png")
                                .setTitle("Rodina Rp 01 | Report ")
                                .setColor(`#${randomColor()}`)
                                .addField("Правила подачи репорта:","\`\`\`1. Запрещено оскорбительное и неадекватное поведение.\n2. Запрещено создавать репорт с некорректным вопросом.\n3. После создания репорта сразу описывайте свою проблему. \n4. Запрещено флудить @упоминаниями.\n5. Запрещено оффтопить в канал репорта.\`\`\`")
                                .setImage("https://imgur.com/LKDbJeM.gif")
                                .addField("Всего", `\`Обработанных запросов:\` ${guild.countReports}`, true)
                                .addField("Всего",`\`Активных запросов:\` ${guild.activeReports}`,true) 
                                .addField("Всего",`\`Закрытых запросов:\` ${guild.closedReports}`,true)
                                .setFooter("© Report | by Developer Montano")
                                .setTimestamp()
                        ))
                .catch(err => message.channel.send(err));
                message.channel.delete();
                    });
                });
            }
            else {
                await message.delete();
                await message.channel.send("У вас нет прав для закрытия репорта!");
            }
        }
        else {
            await message.delete();
            await message.channel.send("Ай ай ай! В этом канале нельзя!");
        }
	}
}