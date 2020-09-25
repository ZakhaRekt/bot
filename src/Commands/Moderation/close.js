const Discord = require('discord.js');

module.exports = {
	name: 'close',
	category: 'moderation',
	description: 'Закритие вопроса в торговой лавке',

	async run (bot,message) {
		 if (message.channel.parent.id === "757598789157781585") {
            if(message.member.hasPermission('ADMINISTRATOR')) {
                await message.channel.delete();
            }
            else{
                await message.delete();
                await message.channels.send("У вас нет прав Администратора!");
            }
        }
        else {
            await message.delete();
            await message.channel.send("Ай ай ай! В этом канале нельзя!");
        }
	}
}