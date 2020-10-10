const Discord = require('discord.js');
const Promo = require("../../data/promocodes.js");
const User = require("../../data/user.js")

module.exports = {
	name: "updatepromo",
	category:"economy",
	description: "Прокачка промокода",


	async run (bot,message,args) {
        Promo.findOne({owner:message.author.id}, (err,promo) => {
            if(err) console.log(err);
            if(!promo) {
                return message.channel.send(`\`\`У вас нет личных промокодов!\`\``)
            }
            User.findOne({userID:message.author.id},(err,user) => {
                if(!user) return message.channel.send(`No data for ${message.author.tag} found`)
                if(err) console.log(err);
                if(!args[0]) {
                    return message.channel.send(`\`\`Укажите уровень на который хотите улучшить!\`\``);
                }
                if(parseInt(args[0]) == 2) {    
                    if(user.coins < 70) {
                        return message.channel.send(`\`\`У вас не хватает ${70 - user.coins} для повышения уровня промокода до 2. \`\` `)
                    }
                    user.coins -= 70;
                    promo.promoLevel = 2;
                    user.save();
                    promo.save();
                    return message.channel.send(`**Промокод ${promo.name} был обновлен. Уровень промокода установлен на 2.**`)
                } else if(parseInt(args[0]) == 3) {
                    if(user.coins < 150) {
                        return message.channel.send(`\`\`У вас не хватает ${150 - user.coins} для повышения уровня промокода до 3. \`\` `)
                    }
                    user.coins -= 150;
                    promo.promoLevel = 3;
                    user.save();
                    promo.save();
                    return message.channel.send(`**Промокод ${promo.name} был обновлен. Уровень промокода установлен на 3.**`) 
                } else {
                    return message.channel.send(`\`\`Возможно указать только число 2 или 3.\`\``);
                }
            })
        })
    }
}