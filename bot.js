//Общие константы 
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");
const humanizeDuration = require('humanize-duration');
const ms = require("ms");

//для команд
const { getMember, formatDate, getRandomInt } = require("./functions.js");
const { stripIndents } = require("common-tags");

//Economy
const membersValue = new Map();
//command Warn
const warnMembers = new Map();
//report cooldown
const reportCullDown = new Map();
//work command coolDown
const workCoolDown = new Map();



let serverid = '711648783125184620';
let prefix = '!';

bot.login(process.env.token);


bot.on('ready', () => {
    console.log("Бот был успешно запущен!"); // Написать что бот запущен
    bot.user.setPresence({ game: { name: 'Economy All Gamers' }, status: 'online' }) // Установить игру
});

bot.on('message', async message => {
	if (message.guild.id != serverid) return;
    if (message.channel.type == "dm") return; // Если в ЛС, то выход.
    if (message.type === "PINS_ADD") return message.delete(); 
    if (message.author.bot) return;
    if (message.member.roles.cache.some(role => role.id === "720246252067094650")) return;
    if (message.content == "/ping") return message.reply("`я онлайн.`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`);
    if (message.content.startsWith(`/run`)) {
        if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id !== '422109629112254464' && message.author.id !== '407228819498336256' && message.author.id !== '646573856785694721') {
            message.reply(`\`недостаточно прав доступа!\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        const args = message.content.slice(`/run`).split(/ +/);
        let cmdrun = args.slice(1).join(" ");
        try {
            eval(cmdrun);
        } catch (err) {
            message.reply(`**\`произошла ошибка: ${err.name} - ${err.message}\`**`);
        }
    }
/*
*			
*
*		Кастомные команды >> Все команды
*
*
*/
	
	/* Написать в чат от имени бота */
if(message.content.startsWith(`${prefix}say`)) {
	if (message.member.hasPermission("ADMINISTRATOR") || message.author.id == '422109629112254464' || message.author.id == '407228819498336256') { 
		const args = message.content.slice(`${prefix}say`).trim().split(/ +/g);
		if(!args[1]) {
			message.delete();
			return message.channel.send(`\`\` Нечего не хотите сказать?\`\``)
				.then(m => m.delete({timeout:5000}));
		}
		const sayEmbed = new Discord.MessageEmbed()
			.setTitle("All Gamers >> Rules")
			.setColor("#ff4a4d")
			.addField("--------------------------------------------",`${args.slice(1).join(" ")}`)
			.setFooter("© Info | All Gamers");
		message.delete();
		message.channel.send(sayEmbed);

	}
	else {
		message.delete();
		return message.channel.send(`\`\` У вас нет прав для использования данной команды!\`\``)
			.then(m => m.delete({timeout:5000}));
	}
}
    /* Команда изменения префикса бота */

if(message.content.startsWith(`${prefix}changeprefix`)) {
    	if (message.member.hasPermission("ADMINISTRATOR") || message.author.id == '422109629112254464' || message.author.id == '407228819498336256') {
    	const args = message.content.slice(`${prefix}changeprefix`).trim().split(/ +/g);
    		if(!args[1]) {
    			message.delete({timeout:10});
    			return message.channel.send("\`\`Укажите префикс на который хотите изменить \`\`")
    				.then(m => m.delete({timeout:5000}))
    				.catch(err => console.log(err));
    		}
    		prefix = args[1];
    		message.delete({timeout:10});
    		return message.reply(`\`\`Вы изменили префикс на ${args[1]}\`\``)
    			.then(m => m.delete({timeout:5000}));
    	}
    	else {
    		message.channel.send(`У вас нет прав для использования данной команды!`)
    			.then(m => m.delete({timeout:5000}))
    			.catch(err => console.log(err));
    	}
}

    /* Команда для кика пользователя с привата */
if(message.content.startsWith(`${prefix}pkick`)) {
    	if(message.channel.id === "723927916605603890") {
    		if(message.member.voice.channel == null) {
    			message.delete({timeout:10});
    			return message.channel.send(`\`\`Вашего канала не существует!\`\``)
    				.then(m => m.delete({timeout:5000}));

    		}
    		else if (message.member.voice.channel.name === message.member.displayName) {
    			const args = message.content.slice(`${prefix}pkick`).trim().split(/ +/g);
    			if(!args[1]) {
    				message.delete({timeout:10})
    				return message.channel.send(`\`\`Укажите пользоватеся которого хотите исключить из привата!\`\` `)
    						.then(m => m.delete({timeout:5000}));
    			}
    			if(args[2]) {
    				return message.delete({timeout:10});
    			}

    			const kickMember = message.mentions.members.first();
	    		const privatChannelToKick = message.guild.channels.cache.find(channel => channel.name === message.member.displayName);
	    		await privatChannelToKick.updateOverwrite(kickMember, {
									  'SEND_MESSAGES':false,
									  'CONNECT':false,
									  'VIEW_CHANNEL':false,
									  'SPEAK':false,
									  'STREAM':false,
									},"Add Member to Privat Channel")
					.then(channel => console.log(channel.permissionOverwrites.get(kickMember)))
					.catch(console.error);
				await kickMember.voice.setChannel(null,"Kick Member From The Channel");
				await message.channel.send(`\`\`Вы кикнули из привата:\`\` <@${kickMember.id}>`)
						.then(m => m.delete({timeout:5000}));
    		}
    	}
    	else {
    		return message.channel.send(`\`\`Вы не можете использоваь данную команду здесь!\`\``)
    				.then(m => m.delete({timeout:5000}));
    	}
}

    /* Выдать бан */
if(message.content.startsWith(`${prefix}ban`)) {
	if (message.member.hasPermission("ADMINISTRATOR") || message.author.id == '422109629112254464' || message.author.id == '407228819498336256') {
			const args = message.content.slice(`${prefix}ban`).trim().split(/ +/g);
			if(!args[1]) {
				message.delete({timeout:10})
				return message.channel.send(`\`\`Упомяните человека! \`\` `)
						.then(m => m.delete({timeout:5000}))
			}
			if(!args[2]) {
				message.delete({timeout:10})
				return message.channel.send(`\`\`Укажите причину! \`\` `)
						.then(m => m.delete({timeout:5000}))
			}
			const toBanMember = message.mentions.members.first() || message.guild.members.get(args[1]);
			if(!toBanMember) {
				message.delete({timeout:10})
				return message.channel.send(`\`\`Человек не найден на сервере! \`\` `)
						.then(m => m.delete({timeout:5000}))
			}
			if(toBanMember.id === message.author.id) {
				message.delete({timeout:10})
				return message.channel.send(`\`\`Вы не можете снять все роли у самого себя!\`\` `)
						.then(m => m.delete({timeout:5000}))
			}
			if(message.member.roles.highest.position <= toBanMember.roles.highest.position) {
				message.delete({timeout:10})
				return message.channel.send(`\`\`Даже не думай снять роли у того кто выше!\`\` `)
						.then(m => m.delete({timeout:5000}))
			}
			const embedBan = new Discord.MessageEmbed()
				.setColor("#ff4a4d")
				.setTitle("Moderation >> Ban")
	            .setThumbnail(toBanMember.user.displayAvatarURL)
	            .setFooter(message.member.displayName, message.author.displayAvatarURL)
	            .setTimestamp()
	            .setDescription(stripIndents`**> Забанен пользователь:** ${toBanMember} (${toBanMember.id})
	            **> Забанен модератором:** ${message.member} (${message.member.id})
	            **> Причина:** ${args.slice(2).join(" ")}`);
	        message.guild.members.cache.find(mem => mem.id === toBanMember.id).roles.set(['720246252067094650'])
	        message.channel.send(`<@${message.member.id}>`,embedBan);
	        message.delete({timeout:10});
	}
	else {
		message.delete({timeout:10})
		return message.channel.send(`\`\`У вас нет прав для использования данной команды! \`\` `)
				.then(m => m.delete({timeout:5000}))
	}
}
	/* Выдать варн */
if(message.content.startsWith(`${prefix}warn`)) {
	if(message.member.roles.highest.position >= 53) {
		const args = message.content.slice(`${prefix}warn`).trim().split(/ +/g);
		if(!args[1]) {
			message.delete({timeout:10})
			return message.channel.send(`\`\`Упомяните человека! \`\` `)
					.then(m => m.delete({timeout:5000}))
		}
		if(!args[2]) {
			message.delete({timeout:10})
			return message.channel.send(`\`\`Укажите причину! \`\` `)
					.then(m => m.delete({timeout:5000}))
			}
		const toWarnMember = message.mentions.members.first() || message.guild.members.get(args[1]);
		if(!toWarnMember) {
				message.delete({timeout:10})
				return message.channel.send(`\`\`Человек не найден на сервере! \`\` `)
						.then(m => m.delete({timeout:5000}))
			}
			if(toWarnMember.id === message.author.id) {
				message.delete({timeout:10})
				return message.channel.send(`\`\`Вы не можете снять все роли у самого себя!\`\` `)
						.then(m => m.delete({timeout:5000}))
			}
			if(message.member.roles.highest.position <= toWarnMember.roles.highest.position) {
				message.delete({timeout:10})
				return message.channel.send(`\`\`Даже не думай снять роли у того кто выше!\`\` `)
						.then(m => m.delete({timeout:5000}))
			}
		const warnEmbed = new Discord.MessageEmbed()
				.setColor("#ff4a4d")
				.setTitle("Moderation >> Warn")
	            .setThumbnail(toWarnMember.user.displayAvatarURL)
	            .setFooter(message.member.displayName, message.author.displayAvatarURL)
	            .setTimestamp()
	            .setDescription(stripIndents`**> Варн пользователю:** ${toWarnMember} (${toWarnMember.id})
	            **> Варн выдан модератором:** ${message.member} (${message.member.id})
	            **> Причина:** ${args.slice(2).join(" ")}
	            **> Количество текущих варнов:** ${warnMembers.get(toWarnMember.id)+1}`);
		if(warnMembers.get(toWarnMember.id) === 0) {
			message.delete({timeout:10});
			message.channel.send(warnEmbed);
			return warnMembers.set(toWarnMember.id,1);
		}
		if(warnMembers.get(toWarnMember.id) === 1) {
			message.delete({timeout:10});
			message.channel.send(warnEmbed);
			return warnMembers.set(toWarnMember.id,2);
		}
		if(warnMembers.get(toWarnMember.id) === 2) {
			message.delete({timeout:10});
			const finalWarnEmb = new Discord.MessageEmbed()
				.setColor("#ff4a4d")
				.setTitle("Moderation >> Warn")
				.addField("**Забанен**", `<@${toWarnMember.id}>`,true)
				.addField("**Причина**", `Warns 3/3`)
				.setFooter(message.member.displayName, message.author.displayAvatarURL);
			await message.channel.send(finalWarnEmb);
			await toWarnMember.roles.set(['720246252067094650']);
			return warnMembers.delete(toWarnMember.id);
		}

	}
	else {
		message.delete({timeout:10})
		return message.channel.send(`\`\`У вас нет прав для использования данной команды! \`\` `)
				.then(m => m.delete({timeout:5000}))
	}
}
	/* Внести/обновить список учсников гильдии для варнов */
if(message.content.startsWith(`${prefix}sobr`)) {
	if(message.member.hasPermission("ADMINISTRATOR") || message.author.id == '422109629112254464' || message.author.id == '407228819498336256') {
		message.delete();
		await message.guild.members.cache.each(member => warnMembers.set(member.id,0));
		await message.guild.members.cache.each(member => membersValue.set(member.id,0));
		await message.channel.send("Готово!")
			.then(m => m.delete({timeout:2000}));
	}
	else {
		return message.delete();
	}
}
if (message.content.startsWith(`${prefix}info`)) {
	if (message.channel != message.guild.channels.cache.get("719986243160506571")) {
		message.delete();
		return message.channel.send(`\`\`Комадны можно использовать только в канале:\`\`<#719986243160506571>`)
			.then(m => m.delete({timeout:5000}));
	}
	const rolesForAuthor = message.member.roles.cache
				.filter(r => r.id !== message.guild.id)
                .map(r => r).join("\n") || 'none';
	const infoEmbed = new Discord.MessageEmbed()
		.setTitle("Moderation >> Info")
		.setDescription("Информация о пользователе")
		.setColor("#ff4a4d")
		.addField("**Никнейм**", `\`\`${message.member.displayName}\`\``)
		.addField("**Ид пользоваателя**", `\`\`${message.author.id}\`\``)
		.addField("**Роли**", `${rolesForAuthor}`)
		.addField("**На сервере с**", `\`\`${formatDate(message.member.joinedAt)}\`\``,true)
		.setFooter(`© Info | All Gamers`)
		.setTimestamp();
	const args = message.content.slice(`${prefix}info`).trim().split(/ +/g);
	if(!args[1]) {
		message.delete();
		return message.channel.send(infoEmbed)

	}
	if(args[2]) {
		return
	}
	message.delete()
	const memberInfo = message.guild.member(message.mentions.users.first());
	const rolesForMember = memberInfo.roles.cache
				.filter(r => r.id !== message.guild.id)
                .map(r => r).join("\n") || 'none';
	const memberInfoEmbed = new Discord.MessageEmbed()
		.setTitle("Moderation >> Info")
		.setDescription("Информация о пользователе")
		.setColor("#ff4a4d")
		.addField("**Никнейм**", `\`\` ${memberInfo.displayName}\`\``)
		.addField("**Ид пользоваателя**", `\`\`${memberInfo.user.id}\`\``)
		.addField("**Роли**", `${rolesForMember}`,true)
		.addField("**На сервере с**", `\`\`${formatDate(memberInfo.joinedAt)}\`\``,true)
		.setFooter(`© Info | All Gamers`)
		.setTimestamp();
	return message.channel.send(memberInfoEmbed);
}
/*Система репорта*/
if(message.content.startsWith(`${prefix}report`)) {
	if (message.channel != message.guild.channels.cache.get("719986243160506571")) {
		message.delete();
		return message.channel.send(`\`\`Комадны можно использовать только в канале:\`\`<#719986243160506571>`)
			.then(m => m.delete({timeout:5000}));
	}
	const memberCollDown = reportCullDown.get(message.author.id);
	if(memberCollDown) {
		const remaining = humanizeDuration(memberCollDown - Date.now(),{ language: "ru" });
		return message.channel.send(`\`\`Вы можете использовать команду через:${remaining}\`\``)
			.then(m => m.delete({timeout:5000}));
	}
	else {
		const args = message.content.slice(`${prefix}report`).trim().split(/ +/g);
		if (!args[1]) {
			message.delete();
			return message.channel.send(`\`\`Упомяните человека на которого вы отсылаете репорт!\`\` `)
				.then(m => m.delete({timeout:5000}));
		}
		if (!args[2]) {
			message.delete();
			return message.channel.send(`\`\`Напишите причину репорта! (от 2-ух слов)\`\` `)
				.then(m => m.delete({timeout:5000}));
		}
		await message.delete({timeout:10});
		await message.channel.send(`\`\`Ваша жалоба отправленя ожидайте модератор с вами свяжется!\`\``)
			.then(m => m.delete({timeout:10000}));
		const toChannelReport = new Discord.MessageEmbed()
			.setTitle("Report >> All Gamers")
			.setColor("#ff4a4d")
			.addField("**Вы отправили жалобу на**",`<@${message.mentions.members.first().id}>`)
			.addField("**С причиной**",`${args.slice(2).join(" ")}`)
			.addField("**Вашу жалобу рассмотрят**", `<@&723567087850750013> - \`\`Модераторы\`\` \n <@&720334176041173132> - \`\`Инспекторы\`\``)
			.addField("**Ожидайте**",`\`\`Ваша жалоба будет рассмотренна в тичении 30 минут.\`\` `)
			.setFooter("© Report | All Gamers")
		const reportEmbed = new Discord.MessageEmbed()
			.setTitle("Report >> All Gamers")
			.setColor("#ff4a4d")
			.setImage("https://webmasterie.ru/wp-content/uploads/2018/06/Moderator.jpg")
			.addField("**Жалоба от пользователя**",`<@${message.author.id}>`)
			.addField("**Отправлена с канала**", `<#${message.channel.id}>`)
			.addField("**Жалоба на пользователя**", `<@${message.mentions.members.first().id}>`)
			.addField("**Текст жалобы**", `${args.slice(2).join(" ")}`)
			.addField("**Жалобу рассмотрят**", `<@&723567087850750013> - \`\`Модераторы\`\` \n <@&720334176041173132> - \`\`Инстпекторы\`\` \n **Человек уже ждет рассмотрения своей жалобы!**`)
			.setFooter("© Report | All Gamers")
		const reportChannel = message.guild.channels.cache.find(r => r.name === "┃📝┃reports");
		message.channel.send(`<@${message.member.id}>`,toChannelReport)
			.then(m => m.delete({timeout:10000}));
		reportChannel.send(reportEmbed);
		reportCullDown.set(message.author.id, Date.now() + 300000);
		setTimeout(() => reportCullDown.delete(messasge.author.id), 300000);

	}

}
if(message.content.startsWith(`${prefix}inrole`)) {
	if (message.channel != message.guild.channels.cache.get("719986243160506571")) {
		message.delete();
		return message.channel.send(`\`\`Комадны можно использовать только в канале:\`\`<#719986243160506571>`)
			.then(m => m.delete({timeout:5000}));
	}
	if(message.member.roles.highest.position >= 49) {
		const args = message.content.slice(`${prefix}inrole`).trim().split(/ +/g);
		if(!args[1]) {
			message.delete();
			return message.channel.send("\`\`Укажите ид роли которую хотите проверить!\`\`")
				.then(m => m.delete({timeout:5000}));
		}
		const role = message.guild.roles.cache.find(r => r.id === args[1]);
		if(!role) {
			message.delete();
			return message.channel.send("\`\`Укажите ид роли корректно!\`\`")
				.thne(m => m.delete({timeout:5000}));
		}
		const rolesEmbed = new Discord.MessageEmbed() 
			.setTitle("Roles >> All Gamesrs")
			.setColor("#ff4a4d")
			.setFooter("© Inrole | All Gamers") 
		await message.delete();
		await role.members.each(member => rolesEmbed.addField(`-${member.user.tag}`,`-`));
		await message.channel.send(rolesEmbed);


	}
	else {
		return message.channel.send("\`\`Вы не можете использовать данную команду! \`\`")
	}
} 
 /* Выдать мут */
if(message.content.startsWith(`${prefix}mute`)) {
	if(message.member.roles.highest.position >= 53) {
		const args = message.content.slice(`${prefix}mute`).trim().split(/ +/g);
		if(!args[1]) {
			await message.delete();
			return await message.channel.send(`\`\` Упомяните пользователя которого хотите замутить!\`\``)
				.then(m => m.delete({timeout:5000}));
		}
		if(!args[2]) {
			await message.delete();
			return await message.channel.send(`\`\`Укажите время мута.\`\``)
				.then(m => m.delete({timeout:5000}));
		}
		if(!args[3]) {
			await message.delete();
			return await message.channel.send(`\`\`Укажите причину мута! \`\``)
				.then(m => m.delete({timeout:5000}));
		}
		const memberToMute = message.mentions.members.first();
		if(!memberToMute) {
			await message.delete();
			return await message.channel.send(`\`\`Пользователь не найден! \`\``);
		}
		const muteRole = message.guild.roles.cache.find(r => r.id === "725667512355651584");
		const muteEmbed = new Discord.MessageEmbed()
			.setTitle("Mute >> All Gamers")
			.setDescription(`\`\`Информация о муте\`\``)
			.setColor("#ff4a4d")
			.addField("\`\`Замучен пользователь\`\`", `<@${memberToMute.id}>`,true)
			.addField("\`\`Модератором\`\`", `<@${message.author.id}>`,true)
			.addField("\`\`Время\`\`", `${ms(ms(args[2]))}`,true)
			.addField("\`\`Причина\`\`", `${args.slice(3).join(" ")}`,true)
			.addField("\`\`Статус\`\`", `<a:emoji_42:714016857925091358>`,true)
			.setFooter("© Mute | All Gamers")
		await message.delete();
		await memberToMute.roles.add(muteRole.id);
		await message.channel.send(muteEmbed);

		setTimeout(function() {
			memberToMute.roles.remove(muteRole.id);
			message.guild.channels.cache.get("719986243160506571").send(`<@${memberToMute.id}> \`\`Был размучен!\`\``);			
		}, ms(args[2]));

	}
	else {
		await message.delete();
		await message.channel.send(`\`\`У вас нет прав для использования данной команды! \`\` `)
			.then(m => m.delete({timeout:5000}));
	}
}
    /* Посмтортеть активные наказания */

    if(message.content.startsWith(`${prefix}history`)) {
    	if(message.member.roles.highest.position >= 53) {
    		const args = message.content.slice(`${prefix}history`).trim().split(/ +/g);
    		if(!args[1]) {
    			message.delete()
    			return message.channel.send(`\`\`Упомяните пользователя у кого хотите посмтортеть историю предупреждений! \`\``)
    				.then(m => m.delete({timeout:5000}));
    		}
    		const historyMember = message.mentions.members.first();
    		if(!historyMember) {
    			message.delete()
    			return message.channel.send(`\`\`Неверно указан пользователь!\`\` `)
    				.then(m => m.delete({timeout:5000}))
    		}
    		if(warnMembers.get(historyMember.id) > 0) {
	    		const isHasWarn = new Discord.MessageEmbed()
	    			.setTitle("History >> All Gamers")
	    			.setColor("#ff4a4d")
	    			.setDescription("Информация про наказания пользователя")
	    			.addField("**Информация о пользователе**", `<@${historyMember.id}>`)
	    			.addField("**Активных Варнов**", `\`\`${warnMembers.get(historyMember.id)}\`\``)
	    			.setFooter(`© History >> All Gamers`)
	    		await message.delete();
	    		return await message.channel.send(isHasWarn)
	    			.then(m => m.delete({timeout:10000}));
	    	}
	    	if(warnMembers.get(historyMember.id) == 0 || warnMembers.get(historyMember.id) == undefined) {
	    		const hasNoWarn = new Discord.MessageEmbed()
	    			.setTitle("History >> All Gamers")
	    			.setColor("#ff4a4d")
	    			.setDescription("Информация про наказания пользователя")
	    			.addField("**Информация о пользователе**", `<@${historyMember.id}>`)
	    			.addField("**Активных Варнов**", `\`\`Пользователь не имеет активных варнов!\`\``)
	    			.setFooter(`© History >> All Gamers`)
	    		await message.delete();
	    		return await message.channel.send(hasNoWarn)
	    			.then(m => m.delete({timeout:10000}));
	    	}
    	}
    	else {
    		message.delete();
    		message.channel.send(`\`\`Нет прав для выполнения команды\`\``);
    	}
    }


/*
*			
*
*		Економика сервера >> Все команды
*
*
*/
    	/*Проверка баланса счета*/
    if(message.content.startsWith(`${prefix}$`)) {
    	if (membersValue.has(message.author.id)) {
    		return message.channel.send(`\`\`На вашем счету: ${membersValue.get(message.author.id)} 🎃\`\``)
    	}
  		membersValue.set(message.author.id, 0);
  		message.channel.send("\`\`Вы были записаны в банк 🎃!\`\`");
    }
    /*Выдача валюты (ТОЛЬКО ДЛЯ АДМИНОВ!)*/
    if(message.content.startsWith(`${prefix}give`)) {
    	if (message.member.hasPermission("ADMINISTRATOR") || message.author.id == '422109629112254464' || message.author.id == '407228819498336256') {
    	if (!membersValue.has(message.author.id)) {
    		message.delete({timeout:10});
    		return message.channel.send(`\`\`У человека нет записи в банке! Что-бы запсатся используйте:${prefix}$ \`\``)
    			.then(m => m.delete({timeout:5000}))
    	}
    	const args = message.content.slice(`${prefix}give`).trim().split(/ +/g);
    	if(!args[1]) {
    		message.delete({timeout:10});
    		return message.channel.send("\`\`Упомяните человека которому хотите выдать 🎃!\`\`")
    				.then(m => m.delete({timeout:5000}))
    				.catch(err => console.log(err));
    	}
    	if(!args[2]) {
    		message.delete({timeout:10});
    		return message.channel.send("\`\`Укажите количество тыкв которые нужно выдать!\`\`")
    				.then(m => m.delete({timeout:5000}))
    				.catch(err => console.log(err));
    	}
    	if (isNaN(parseInt(args[2]))) {
    		message.delete({timeout:10});
    		return message.channel.send("\`\`Количество 🎃 принимается только в цыфрах!\`\`")
    				.then(m => m.delete({timeout:5000}))
    				.catch(err => console.log(err));

    	}
    	const memberToSetValue = message.mentions.members.first();
    	if(!memberToSetValue) {
    		await message.delete();
    		return await message.channel.send(`\`\`Вы не правельно указали пользователя для выдачи!\`\` `)
    			.then(m => m.delete({timeout:5000}));
    	}
    	message.channel.send(`<@${memberToSetValue.id}> было выдано ${args[2]} 🎃`)
    	membersValue.set(memberToSetValue.id, args[2])
    }
    else {
    	await message.delete();
    	message.channel.send(`\`\`Нет прав для выполнения данной команды!\`\``)
    		.then(m => m.delete({timeout:5000}))
    }
   }
    /*Передача валюты другому человеку*/
    if(message.content.startsWith(`${prefix}pay`)) {
    	if (!membersValue.has(message.author.id)) {
    		message.delete({timeout:10});
    		return message.channel.send(`\`\`У человека нет записи в банке! Что-бы запсатся используйте:${prefix}$ \`\``)
    			.then(m => m.delete({timeout:5000}))
    	}
    	const args = message.content.slice(`${prefix}pay`).trim().split(/ +/g);
    	if(!args[1]) {
    		await message.delete();
    		return await message.channel.send(`\`\`Упомяните человека которому вы хотите передать 🎃!\`\``)
    			.then(m => m.delete({timeout:5000}));
    	}
    	if(!args[2]) {
    		await message.delete();
    		return await message.channel.send(`\`\`Укажите количество 🎃!\`\``)
    			.then(m => m.delete({timeout:5000}));
    	}
    	const payMember = message.mentions.members.first();
    	if(!payMember) {
    		await message.delete();
    		return await message.channel.send(`\`\`Неверно указан пользователь для передачи!\`\``)
    			.then(m => m.delete({timeout:5000}));
    	}
    	if (isNaN(parseInt(args[2]))) {
    		await message.delete();
    		return await message.channel.send("\`\`Количество 🎃 принимается только в цыфрах!\`\`")
    				.then(m => m.delete({timeout:5000}))
    				.catch(err => console.log(err));
    	}
    	if(membersValue.get(message.author.id) < parseInt(args[2])) {
    		await message.delete();
    		return await message.channel.send(`\`\`Выдать не возможно у вас не достаточно 🎃 \`\` `)
    			.then(m => m.delete({timeout:5000}));
    	}
    	await message.delete();
    	await membersValue.set(message.author.id,membersValue.get(message.author.id) - parseInt(args[2]));
    	await membersValue.set(payMember.id, membersValue.get(payMember.id) + parseInt(args[2]));
    	await message.channel.send(`\`\`Успешно передано ${args[2]} 🎃\`\``);

    }
    /* Автовыдача Тыкв */
    if(message.content.startsWith(`${prefix}work`)) {
    	const cooldown = workCoolDown.get(message.author.id);
		if(cooldown) {
			await message.delete()
			const remain = humanizeDuration(workCoolDown - Date.now(),{ language: "ru" });
			return await message.channel.send(`\`\`Вы можете использовать команду через:${remain}\`\``)
				.then(m => m.delete({timeout:5000}));
		}
		if(!membersValue.has(message.author.id)) {
			await message.delete()
			return await message.channel.send(`\`\`У человека нет записи в банке! Что-бы запсатся используйте:${prefix}$ \`\``)
				.then(m => m.delete({timeout:5000}));
		}
		await message.delete();
		await membersValue.set(message.author.id, membersValue.get(message.author.id) + 20);
		await message.channel.send(`\`\` Вам было начислено 20 подарочных 🎃!\`\` `)
		await workCoolDown.set(message.author.id, Date.now() + 21600000);
		setTimeout(() => workCoolDown.delete(messasge.author.id), 21600000);

    }
});
const costil = [];
/*Создание привата*/
    bot.on('voiceStateUpdate', async (oldState,newState) => {
    	if(newState.channelID === "720357135669526558") {
    		const oldChannel = newState.guild.channels.cache.get("720357134793048155");
    		if(oldChannel.children.some(channel => channel.name === `${newState.member.displayName}`)) {
	    		await newState.guild.channels.cache.find(c => c.name === `${newState.member.displayName}`).delete();
	    		return newState.member.send(`\`\`Нельзя создать более одного привата! \`\``)
    		}
    		 const newPrivateChannel = await newState.guild.channels.create(newState.member.displayName, {
    			type:"voice",
    			topic:"Privat Channel",
    			nsfw:false,
    			bitrate:64000,
    			userLimit:2,
    			parent:"720357134793048155",
    			permissionOverwrites:[
    			{
    				id:newState.id,
    				allow:["VIEW_CHANNEL","CONNECT","SPEAK","STREAM","SEND_MESSAGES","MANAGE_CHANNELS"],
    				deny:["ADMINISTRATOR","KICK_MEMBERS","BAN_MEMBERS","MANAGE_GUILD"],
    				type:"member",
    			},
    			{
    				id:"711648783125184620",
    				allow:["CONNECT","SPEAK","STREAM","VIEW_CHANNEL"],
    				deny:["ADMINISTRATOR","KICK_MEMBERS","BAN_MEMBERS","MANAGE_GUILD","SEND_MESSAGES","MANAGE_CHANNELS"],
    				type:"role",
    			},
    			{
    				id:"720010556542812231",
    				allow:["CONNECT","SPEAK","STREAM","VIEW_CHANNEL","MANAGE_CHANNELS"],
    				deny:["ADMINISTRATOR","KICK_MEMBERS","BAN_MEMBERS","MANAGE_GUILD","SEND_MESSAGES"],
    				type:"role",
    			},
    			{
    				id:"723567163373256735",
    				allow:["CONNECT","SPEAK","STREAM","VIEW_CHANNEL","MANAGE_CHANNELS"],
    				deny:["ADMINISTRATOR","KICK_MEMBERS","BAN_MEMBERS","MANAGE_GUILD","SEND_MESSAGES"],
    				type:"role",
    			}
    		],
    	});
    	await newState.setChannel(newPrivateChannel,"Moved to Privat Channel");
    	await costil.push(newPrivateChannel.id);
    }
    if(oldState.channelID == costil[0] && newState.guild.channels.cache.find(z => z.id === costil[0]).members.array().length == 0) {
    	await costil.shift();
    	await oldState.channel.delete();
    		if(newState.channelID === "720357135669526558") {
    			return;
    		}
	}

 });
