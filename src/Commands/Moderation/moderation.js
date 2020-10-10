const Discord = require('discord.js');
const ModerationRoles = ["✵ Модератор Дискорд ✵","✵ Ст.Модератор Дискорд ✵","✵ Зам.Куратора Дискорд ✵","✵ Куратор Дискорд ✵"];
module.exports = {
	name: "moderation",
    category:"moderation",
	description: "Список модераторов",

    async run (bot,message,args) {
        const ModerationEmbed = new Discord.MessageEmbed()
            .setColor(`${message.member.displayHexColor}`)
            .setTitle(`**Список модераторов | Rodina Central District**`)
        ModerationRoles.reverse().forEach(element => {
            message.guild.roles.cache.each(role => {
                if(role.name === element) {
                    var ids = "";
                    role.members.each(member =>  ids = ids + `<@${member.id}>` + "\n")
                    if(ids === '') return;
                    ModerationEmbed.addField(`**${role.name}**`,ids)
                }
            })
        })
        return message.channel.send(ModerationEmbed)
    }
}