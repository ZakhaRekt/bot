const Discord = require('discord.js');
const User = require("../../data/user.js");

module.exports = {
	name: "topcoins",
  category:"economy",
	description: "Топ по коинам на сервере",

	async run (bot,message,args) {
		    User.find().sort([
    ['coins', 'descending']
  ]).exec((err, res) => {
    if (err) console.log(err);

    let embed = new Discord.MessageEmbed()
      .setTitle("Таблица Лидеров || Rodina 01")
    //if there are no results
    if (res.length === 0) {
      embed.setColor("RED");
      embed.addField("Никто не найден в базе данных", "Попробуйте ещё раз.")
    } else if (res.length < 10) {
      //less than 10 results
      embed.setColor("BLURPLE");
      for (i = 0; i < res.length; i++) {
        let member = message.guild.members.cache.get(res[i].userID) || "User Left"
        if (member === "User Left") {
          embed.addField(`${i + 1}. ${member}`, `**Количество семечек**: ${res[i].coins}`);
        } else {
          embed.addField(`${i + 1}. ${member.displayName}`, `**Количество семечек**: ${res[i].coins}`);
        }
      }
    } else {
      //more than 10 results
      embed.setColor("BLURPLE");
      for (i = 0; i < 10; i++) {
        let member = message.guild.members.cache.get(res[i].userID) || "User Left"
        if (member === "User Left") {
          embed.addField(`${i + 1}. ${member}`, `**Количество семечек**: ${res[i].coins}`);
        } else {
          embed.addField(`${i + 1}. ${member.displayName}`, `**Количество семечек**: ${res[i].coins}`);
        }
      }
    }

    message.channel.send(embed);
  })
	}
}