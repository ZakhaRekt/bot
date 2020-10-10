const Discord = require('discord.js');
const User = require("../../data/user.js");
const Achive = require("../../data/achivement.js");
const { randomColor, getRandomInt } = require("../../../functions.js");


const achives = [
    "Написать 2000 сообщений",
    "Написать 5000 сообщений",
    "Сыграть в казино 20 раз",
    "Сыграть в казино 50 раз"
];

module.exports = {
	name: "casino",
	category:"economy",
	description: "Команда для игры в казино",

	async run (bot,message,args) {
		if(message.channel.name != `🎰казино-рояль`) {
        return await message.channel.send(`Играть в казино можно только в канале: <#${message.guild.channels.cache.find(ch => ch.name === `🎰казино-рояль`).id}>`)
    }
	    if(!args[0]) {
	        await message.delete();
	        return await message.channel.send(`Вы не указали вашу ставку!`)
	            .then(msg => msg.delete({timeout:10000}))
	    } 
	    if(isNaN(parseInt(args[0]))) {
	        return await message.channel.send(`Количество семечек указывается только в цифрах!`)
	    }
	    if(parseInt(args[0]) <= 0 || parseInt(args[0]) >= 31) {
	        return await message.channel.send(`Вы не можете сделать такую ставку!`)
	    }
	    User.findOne({userID:message.author.id}, async(err, user) => {
	        if(!user) {
	            return await message.channel.send(`DataBase error -  cant find user!`);
	        }
	        await message.channel.send(new Discord.MessageEmbed().setTitle(`Начинаем персональную игру ${message.member.displayName}`).setColor(`#${randomColor()}`).setDescription(`Отдохни минутку и получешь результат!`));
	        async function Game() { 
	            if(user.coins < parseInt(args[0])) {
	                return await message.channel.send(new Discord.MessageEmbed().setTitle(`Ошибка!`).setColor(`#${randomColor()}`).setDescription(`Вы не можете сделать ставку которая выше вашего баланса!`));
	            }
	             const randomValue = getRandomInt(0,101);
	            if (randomValue <= 65) {
	                user.coins -= parseInt(args[0]);
	                user.casinoGames += 1;
	                if(user.casinoGames == 20) {
	                    Achive.findOne({userID: message.author.id}, (err,data) => {
	                        if(!data) {
	                            return message.channel.send(`Не найден в базе Ачивок!`)
	                        }
	                        data.three = true;
	                        data.save();
	                    })
	                    user.coins += 10;
	                    user.save();
	                    message.channel.send(new Discord.MessageEmbed().setTitle(`Не повезло :(`).setColor(`#${randomColor()}`).setDescription(`Вы потеряли свою ставку!`));
	                    return message.channel.send(`Вы выполнили ачивку \"${achives[2]}\"`)
	                }
	                if(user.casinoGames == 50) {
	                    Achive.findOne({userID: message.author.id}, (err,data) => {
	                        if(!data) {
	                            return message.channel.send(`Не найден в базе Ачивок!`)
	                        }
	                        data.four = true;
	                        data.save();
	                    })
	                    user.coins += 20;
	                    user.save();
	                    message.channel.send(new Discord.MessageEmbed().setTitle(`Не повезло :(`).setColor(`#${randomColor()}`).setDescription(`Вы потеряли свою ставку!`));
	                    return message.channel.send(`Вы выполнили ачивку \"${achives[3]}\"`)
	                }
	                user.save().catch(err => console.log(err));
	                return await message.reply(new Discord.MessageEmbed().setTitle(`Не повезло :(`).setColor(`#${randomColor()}`).setDescription(`Вы потеряли свою ставку!`));
	            }
	            if (randomValue > 65) {
	                user.coins += parseInt(args[0]);
	                user.casinoGames += 1;
	                if(user.casinoGames == 20) {
	                    Achive.findOne({userID: message.author.id}, (err,data) => {
	                        if(!data) {
	                            return message.channel.send(`Не найден в базе Ачивок!`)
	                        }
	                        data.three = true;
	                        data.save();
	                    })
	                    user.coins += 10;
	                    user.save();
	                    message.channel.send(new Discord.MessageEmbed().setTitle(`Повезло`).setColor(`#${randomColor()}`).setDescription(`Вы приумножили свою ставку в 2 раза!`));
	                    return message.channel.send(`Вы выполнили ачивку \"${achives[2]}\"`)
	                }
	                if(user.casinoGames == 50) {
	                    Achive.findOne({userID: message.author.id}, (err,data) => {
	                        if(!data) {
	                            return message.channel.send(`Не найден в базе Ачивок!`)
	                        }
	                        data.four = true;
	                        data.save();
	                    })
	                    user.coins += 20;
	                    user.save();
	                    message.channel.send(new Discord.MessageEmbed().setTitle(`Повезло`).setColor(`#${randomColor()}`).setDescription(`Вы приумножили свою ставку в 2 раза!`));
	                    return message.channel.send(`Вы выполнили ачивку \"${achives[3]}\"`)
	                }
	                user.save().catch(err => console.log(err));
	                return await message.reply(new Discord.MessageEmbed().setTitle(`Повезло`).setColor(`#${randomColor()}`).setDescription(`Вы приумножили свою ставку в 2 раза!`));

	            }
	        }
	        setTimeout(Game,6000);
	            
	    });

	}

}