const Discord = require('discord.js');

module.exports = {
	name: 'famhelp',
	category:"family",
	description: "Просмотр команд семей",


	async run (bot,message,args) {
		 message.member.send(`**<@${message.author.id}>, вот справка по системе семей!**`, {
            embed: {
                color: 3447003,
                fields: [{
                    name: `Команды модератора`,
                    value: `**Создать семью:** \`/createfam\`\n**Удалить семью:** \`/deletefam [название]\`\n**Информация о семье:** \`/faminfo [название]\`\n**Вступить как заместитель:** \`/getzamfam [название]\``,
                },
                {
                    name: `Управление семьей`,
                    value: `**Назначить заместителя:** \`/famaddzam [user]\`\n**Снять заместителя:** \`/famdelzam [user]\``,
                },
                {
                    name: `Команды для заместителей`,
                    value: `**Пригласить участника:** \`/faminvite [user]\`\n**Исключить участника:** \`/famkick [user]\``,
                }
                ]
            }
        }).then(msg => msg.delete({timeout:35000})).catch(async () => {
            message.channel.send(`**<@${message.author.id}>, вот справка по системе семей!**`, {
                embed: {
                    color: 3447003,
                    fields: [{
                        name: `Команды модератора`,
                        value: `**Создать семью:** \`/createfam\`\n**Удалить семью:** \`/deletefam [название]\`\n**Информация о семье:** \`/faminfo [название]\`\n**Вступить как заместитель:** \`/getzamfam [название]\``,
                    },
                    {
                        name: `Управление семьей`,
                        value: `**Назначить заместителя:** \`/famaddzam [user]\`\n**Снять заместителя:** \`/famdelzam [user]\``,
                    },
                    {
                        name: `Команды для заместителей`,
                        value: `**Пригласить участника:** \`/faminvite [user]\`\n**Исключить участника:** \`/famkick [user]\``,
                    }
                    ]
                }
            }).then(msg => msg.delete({timeout:35000}))
        });
        message.react('✔');
        return message.delete();
	}
}