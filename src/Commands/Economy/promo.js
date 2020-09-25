const Discord = require('discord.js');
const User = require("../../data/user.js");
const Promo = require("../../data/promocodes.js");


module.exports = {
	name: "promo",
    category:"economy",
	description: "Команда для использования промокода",

	async run (bot,message,args) {
		if (!args[0]) {
        await message.delete();
        return await message.channel.send(`\`\`Укажите промокод который хотите использовать!\`\``)
            .then(msg => msg.delete({timeout:5000}));
    }
    Promo.findOne({ name: args[0] }, async(err, data) => {
        if (!data) {
            return await message.channel.send('**Промокод не найден в базе!**');
        }
        if (data.amountUses <= 0) {
            await data.remove({ name: args[0] });
            return await message.channel.send(`**Промокод не действителен!**`)
        }
        if (data.promoUsers.includes(message.author.id)) {
            return await message.channel.send(`**Вы уже использовали данный промокод!**`)
        }
        User.findOne( {userID: message.author.id}, async(err,userData) => {
            if (!userData) {
                return await message.channel.send(`Ошибка! No userData found!`);
            }
            userData.coins += data.coinsPerUse;
            data.promoUsers.push(message.author.id);
            data.amountUses--;
            await userData.save();
            await data.save();
            await message.channel.send(`Вы использовали промокод: ${args[0]}. Осталось промокодов: ${data.amountUses}`);
        });
    });

	}
}