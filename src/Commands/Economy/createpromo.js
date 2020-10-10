const Discord = require('discord.js');
const Promo = require("../../data/promocodes.js");
const User = require("../../data/user.js")

module.exports = {
	name: "createpromo",
	category:"economy",
	description: "Добавление промокода на коины Пользователем",


	async run (bot,message,args) {
        if(!args[0]) {
            return message.channel.send(`\`\`Нельзя создать промокод без названия!\`\``)
        }
      User.findOne({userID:message.author.id}, (err, user) => {
            if(!user) return message.channel.send(`\`\`User is not found\`\``)
            if(err) console.log(err);
            if(user.coins >= 30) {
                message.channel.send(`\`\`Вы точно хотите создать промокод? Ответ только да/нет\`\``).then(msg => {
                    message.channel.awaitMessages(response => response.member.id == message.member.id, {
                        max: 1,
                        time: 60000,
                        errors: ['time'],
                    }).then(collected => {
                        if (!collected.first().content.toLowerCase().includes('да')) return msg.delete();
                        collected.first().delete();
                        msg.delete();
                        Promo.findOne({owner: message.author.id}, async (err, promo) => {
                            if (err)
                                console.log(err);
                            if (!promo) {
                                let promo = new Promo({ name: args[0], IsPromoUser: 1, owner:message.author.id });
                                await promo.save().catch(err => message.channel.send(`\`[❌DataBase]\` Произошла ошибка при сохранении данных в базу-данных. Ошибка: \`\`\`${err}\`\`\``));
                                user.coins -= 30;
                                await user.save();
                                return await message.channel.send(`Промокод добавлен!`);
                            }
                            else {
                                return message.channel.send(`\`\`У вас уже есть личный промокод!\`\``);
                            }
                        })
                    })
                })
            } else {
                return message.channel.send(`**У вас не хватает \`\`${30 - user.coins}\`\` семечек для создания личного промокода**`);
            }
        }) 
    }
}