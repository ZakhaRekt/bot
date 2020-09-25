const Discord = require('discord.js');
const User = require("../../data/user.js");
const { randomColor } = require("../../../functions.js")

module.exports = {
	name: "addcoins",
    category:"economy",
	description: "Админская команда добавления коинов",

	async run (bot,message,args) {
		if(message.member.hasPermission('ADMINISTRATOR') || message.author.id === "691029995656839229") {
        if(!args[0]) {
            await message.delete();
            return await message.channel.send(`\|\| Упомяните пользователя которому хотите выдать!\|\|`)
                .then(msg => msg.delete({timeout:10000}));
        }
        const add_coin_member = message.mentions.members.first();
        if(!add_coin_member) {
            await message.delete();
            return await message.channel.send(`\|\| Пользователь указан неверно! \|\|`)
                .then(msg => msg.delete({timeout:8000}));
        }
        if(!args[1]) {
            await message.delete();
            return await message.channel.send(`\|\|Укажите количество семечек для выдачи! \|\|`)
                .then(msg => msg.delete({timeout:5000})); 
        }
        if(isNaN(parseInt(args[1]))) {
            await message.delete();
            return await message.channel.send(`\|\|2-ым параметром можно указывать только число!\|\|`)
                .then(msg => msg.delete({timeout:5000}));
        }
        User.findOne({userID: add_coin_member.id}, async(err, data) => {
            if(!data) {
                await message.delete();
                return await message.channel.send(`\|\| Пользователь не найден в базе данных обратитесь к Тех.Администратору! \|\|`)
                    .then(msg => msg.delete({timeout:8000}));
            }
            await message.delete();
            let a = new Discord.MessageEmbed()
                .setDescription(`Вы успешно добавили <@${add_coin_member.user.id}> семечки в количестве \`${args[1]}\``)
                .setColor(`#${randomColor()}`)
            await message.channel.send(a);
            data.coins += Math.floor(parseInt(args[1]));
            await data.save()
        });
    }
    else {
        await message.delete();
        await message.channel.send(`\|\|У вас нет прав для использования данной команды! \|\|`)
            .then(msg => msg.delete({timeout:5000}))
    }
	}
}