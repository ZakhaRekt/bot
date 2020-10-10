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
	name: 'achive',
	category:"misc",
	description: 'Команда просмотра активных ачивок',

	async run (bot,message,args) {

			User.findOne({userID:message.author.id}, async(err,data) => {
	        if(err) console.log(err);
	        if(!data){
	            return message.channel.send(`Пользователь не найден в базе данных в таблице Users!`)
	        }
	        Achive.findOne({userID: message.author.id}, async(err,res) => {
	            if(err) console.log(err);
	            if(!res) {
	                return message.channel.send(`Пользователь не найден в базе данных в таблице Achive!`)
	            }
	            const resultEmb = new Discord.MessageEmbed().setTitle(`Ачивки пользователя ${message.member.displayName}`).setThumbnail('http://i.yapx.ru/IeIie.png').setColor(`RED`).setDescription(`
	                \n-----------------------------------
	                \nНаграды: 
	                \nАчивка первого уровня - 10 коинов!
	                \nАчивка второго уровня - 20 коинов!
	                \n-----------------------------------
	                `);

	            if(res.one == true) {
	                resultEmb.addField(achives[0],`Статус: ✅`,true)
	            }
	            else {
	                resultEmb.addField(achives[0],`Статус: ❌`,true)
	            }
	            if(res.two == true) {
					resultEmb.addField(achives[1],`Статус: ✅`,true)
					resultEmb.addField(`\u200B`, `\u200B`, true)
	            }
	            else {
					resultEmb.addField(achives[1],`Статус: ❌`,true)
					resultEmb.addField(`\u200B`, `\u200B`, true)
	            }
	            if(res.three == true) {
	                resultEmb.addField(achives[2],`Статус: ✅`,true)
	            }
	            else {
	                resultEmb.addField(achives[2],`Статус: ❌`,true)
	            }
	            if(res.four == true) {
					resultEmb.addField(achives[3],`Статус: ✅`,true)
					resultEmb.addField(`\u200B`, `\u200B`, true)
	            }
	            else {
					resultEmb.addField(achives[3],`Статус: ❌`,true)
					resultEmb.addField(`\u200B`, `\u200B`, true)
	            }
	            message.channel.send(resultEmb);
	        });
	    });
	}
}
