const Discord = require('discord.js');
const User = require("../../data/user.js");
const { randomColor } = require("../../../functions.js");

module.exports = {
	name: "pay",
	category:"economy",
	description: "Передать человеку монетки",

	async run(bot,message,args) {
		const color = `#${randomColor()}`;
	    if(!args[0]) {
	        message.delete();
	        return message.reply(
	            new Discord.MessageEmbed()
	                .setTitle(`Ошибка!`)
	                .setColor(color)
	                .setDescription(`
	                    Вы не указали кому хотите передать деньги!
	                    Использование: /pay <упоминания> <количество>
	                `)
	            );
	    }
	    const memberToPay = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
	    if(!memberToPay) {
	        message.delete();
	        return message.reply(
	            new Discord.MessageEmbed()
	                .setTitle(`Ошибка!`)
	                .setColor(color)
	                .setDescription(`
	                    Пользователь не найден на сервере!
	                    Использование: /pay <упоминания> <количество>
	                `)
	            );
	    }
	    if(memberToPay.id === message.author.id) {
	        message.delete();
	        return message.reply(
	            new Discord.MessageEmbed()
	                .setTitle(`Ошибка!`)
	                .setColor(color)
	                .setDescription(`
	                    Невозможно передать деньги самому себе!
	                    Использование: /pay <упоминания> <количество>
	                `)
	            );
	    }
	    if(!args[1]) {
	        message.delete();
	        return message.reply(
	            new Discord.MessageEmbed()
	                .setTitle(`Ошибка!`)
	                .setColor(color)
	                .setDescription(`
	                    Вы не указали количество которое хотите передать!
	                    Использование: /pay <упоминания> <количество>
	                `)
	            );
	    }
	    if (isNaN(+args[1])) {
	        message.delete();
	        return message.reply(
	            new Discord.MessageEmbed()
	                .setTitle(`Ошибка!`)
	                .setColor(color)
	                .setDescription(`
	                    Количество можно указывать только в цыфрах!
	                    Использование: /pay <упоминания> <количество>
	                `)
	            );
	    }
	    if (+args[1] <= 0) {
	        message.delete();
	        return message.reply(
	            new Discord.MessageEmbed()
	                .setTitle(`Ошибка!`)
	                .setColor(color)
	                .setDescription(`
	                    Пытался забагать, но не получилось :(
	                    Использование: /pay <упоминания> <количество>
	                `)
	            );
	    }

	    User.findOne({ userID: message.author.id }, async(err,res)=> {
	        if(!res) {
	            await message.delete();
	            return await message.reply(`\`[❌DataBase]\` Отправитель не найден в базе-данных!`);
	        }
	        if(res.coins < +args[1]) {
	            await message.delete();
	            return await message.reply(
	                new Discord.MessageEmbed()
	                    .setTitle(`Ошибка!`)
	                    .setColor(color)
	                    .setDescription(`
	                        Не хватает баланса!
	                        Использование: /pay <упоминания> <количество>
	                    `)
	            )
	        }
	        else {
	            await User.findOne({ userID:memberToPay.id }, async (err,member) => {
	                if(!member) {
	                    await message.delete();
	                    return await message.reply(`\`[❌DataBase]\` Получатель не найден в базе-данных!`);
	                }
	                res.coins -= +args[1];
	                member.coins += +args[1];
	                await res.save();
	                await member.save();
	                message.delete();
	                message.reply(
	                    new Discord.MessageEmbed()
	                    .setTitle(`Успех!`)
	                    .setColor(color)
	                    .setDescription(`
	                        Операция успешна!
	                        Вы передали пользователю ${memberToPay.displayName} коины в каличестве ${+args[1]}
	                    `)
	                )
	            });
	        }
	    });

		}
}