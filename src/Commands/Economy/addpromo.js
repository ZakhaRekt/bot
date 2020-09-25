const Discord = require('discord.js');
const Promo = require("../../data/promocodes.js");

module.exports = {
	name: "addpromo",
	category:"economy",
	description: "Добавление промокода на коины",


	async run (bot,message,args) {

			if(message.member.hasPermission('ADMINISTRATOR')) {
	        if(!args[0]) {
	            await message.delete();
	            return await message.channel.send(`Укажи название промокода который хочешь создать!`)
	                .then(msg => msg.delete({timeout:10000}));
	        }
	        if (!args[1]) {
	            await message.delete();
	            return await message.channel.send(`Укажи количество использований своего промокода!`)
	                .then(msg => msg.delete({timeout:10000}));
	        }
	        if(isNaN(parseInt(args[1]))) {
	            await message.delete();
	            return await message.channel.send(`Количество указать можно только числом!`)
	        }
	        if (!args[2]) {
	            await message.delete();
	            return await message.channel.send(`Укажи сколько промокод будет давать за 1 использование!`)
	                .then(msg => msg.delete({timeout:10000}));
	        }
	        if(isNaN(parseInt(args[2]))) {
	            await message.delete();
	            return await message.channel.send(`Количество указать можно только числом!`)
	        }
	        Promo.findOne({ name: args[0] }, async(err, data) => {
	            if (!data) {
	                let promo = new Promo({ name: args[0], amountUses: parseInt(args[1]), coinsPerUse: parseInt(args[2]) });
	                await promo.save().catch(err => message.channel.send(`\`[❌DataBase]\` Произошла ошибка при сохранении данных в базу-данных. Ошибка: \`\`\`${err}\`\`\``));;
	                return await message.channel.send(`Промокод добавлен!`);
	            }
	            return await message.channel.send(`**Промокод уже имеется в базе!**`)
	        });
	    }
	    else {
	        await message.delete();
	        await message.channel.send(`Данная команда не для вас :) `)
	    }

	}
}