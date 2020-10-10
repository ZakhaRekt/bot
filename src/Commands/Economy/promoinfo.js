const Discord = require('discord.js');
const Promo = require("../../data/promocodes.js");
const User = require("../../data/user.js")

module.exports = {
	name: "promoinfo",
	category:"economy",
	description: "Информация о промокоде",


	async run (bot,message,args) {
        if(!args[0]) return message.channel.send(`\`\`Укажите название промокода!\`\``);
        Promo.findOne({name:args[0]},(err,promo) => {
            if(err) console.log(err);
            if(!promo) return message.channel.send(`\`\`Проверьте правильность написания названия промокода. Такого промокода нет в базе.\`\``)
            const MainEmbed = new Discord.MessageEmbed()
            .setColor(`${message.member.displayHexColor}`)
            .setDescription(`
            **PromoInfo | Promocode: ${args[0]}**
            \`\`\`Уровень: ${promo.promoLevel}\nСемечек за 1 использование: ${promo.promoLevel * 2}\nИспользований: ${promo.promoUsers.length}\nПоследний кто использовал: ${message.guild.member(promo.promoUsers[promo.promoUsers.length - 1]).displayName}\nСоздатель промокода: ${message.guild.member(promo.owner).displayName}\`\`\``)
            .setImage("https://images.ua.prom.st/1186685095_promokody-na-15.jpg")
            .setFooter(`PromoInfo | Robohumster Developers`);
            return message.channel.send(MainEmbed);

        })
        
    }
}