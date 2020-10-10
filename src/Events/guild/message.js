const Discord = require('discord.js');
const User = require('../../data/user.js');
const Achive = require('../../data/achivement.js');
const Guild = require('../../data/guild.js');
const Report = require('../../data/report.js');
const { randomColor, getRandomInt } = require("../../../functions.js");


const serverid = '325607843547840522';




let tags = ({
    "АП": "★ Администрация Президента ★",
    "ФСБ": "★ ФСБ ★",
    "НА" : "★ Новостное агентство \"Дождь\" ★",
    "РЦ" : "★ Радиостанция \"Рокс\" ★",
    "ГУВД-А": "★ ГУВД г.Арзамас ★",
    "УВД-Э": "★ УВД г.Эдово ★",
    "УВД-Л": "★ УВД г.Лыткарино ★",
    "СМП": "★ Больница г.Арзамас ★",
    "ГБЭ": "★ Больница г.Эдово ★",
    "ВМУ": "★ Главное военно-медицинское управление ★",
    "ВС": "★ Вооруженные силы ★",
    "ФСИН": "★ ФСИН ★",
    "МРЭО": "★ МРЭО ★",
    "ЦБ": "★ Сбербанк ★",

    "ФМ": "❖ ОПГ ❖",
    "СТ": "❖ ОПГ ❖",
    "СБ": "❖ ОПГ ❖",
    "ЧК": "❖ ОПГ ❖",

    "КМ": "❖ Мафии ❖",
    "УМ": "❖ Мафии ❖",
    "РМ": "❖ Мафии ❖",
});
let manytags = [
    "АП",
    "ФСБ",
    "НА",
    "РЦ",
    "ГУВД-А",
    "УВД-Э",
    "УВД-Л",
    "СМП",
    "ГБЭ",
    "ВМУ",
    "ВС",
    "ФСИН",
    "МРЭО",
    "ЦБ",


    "ФМ",
    "СТ",
    "СБ",
    "ЧК",

    "КМ",
    "УМ",
    "РМ"
];
const rolesgg = [
    "★ Администрация Президента ★",
    "★ ФСБ ★",
    "★ Новостное агентство \"Дождь\" ★",
    "★ Радиостанция \"Рокс\" ★",
    "★ ГУВД г.Арзамас ★",
    "★ УВД г.Эдово ★",
    "★ УВД г.Лыткарино ★",
    "★ Больница г.Арзамас ★",
    "★ Больница г.Эдово ★",
    "★ Главное военно-медицинское управление ★",
    "★ Вооруженные силы ★",
    "★ ФСИН ★",
    "★ МРЭО ★",
    "★ Сбербанк ★",
    "❖ ОПГ ❖",
    "❖ Мафии ❖"
];
let gos = [
    "★ Администрация Президента ★",
    "★ ФСБ ★",
    "★ Новостное агентство \"Дождь\" ★",
    "★ Радиостанция \"Рокс\" ★",
    "★ ГУВД г.Арзамас ★",
    "★ УВД г.Эдово ★",
    "★ Главное военно-медицинское управление ★",
    "★ Больница г.Арзамас ★",
    "★ Больница г.Эдово ★",
    "★ Больница г.Лыткарино ★",
    "★ Вооруженные силы ★",
    "★ ФСИН ★",
    "★ МРЭО ★",
    "★ Сбербанк ★"
];

let canremoverole = [
    "❖ Заместитель нелегальной орг. ❖",
    "★ Заместитель государственной орг. ★",
    "★ Лидер организации ★",
    "★ Модератор ★",
    "★ Старший Модератор ★",
    "⚒ Support Team Discord ⚒"
];
const achives = [
    "Написать 2000 сообщений",
    "Написать 5000 сообщений",
    "Сыграть в казино 20 раз",
    "Сыграть в казино 50 раз"
];


module.exports = async (bot,message) => {
    //if(message.guild.id != serverid) return;
    if(message.type === "PINS_ADD") return message.delete();
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return; 

    /*
    *
    *
    *    Системы
    *
    */

    Guild.findOne({guildID: message.guild.id}, (err,res) => {
        if(err) console.log(err);
        if(!res) {
            let guild = new Guild({
                guildID: message.guild.id,
                ownerID: message.guild.ownerID,
                guildName: message.guild.name
            });
            message.guild.fetchInvites()
                .then(invites => invites.each(inv => console.log(inv.url)))
            console.log(`В базу данных добавленна гильдия ${message.guild.name}`);
           return guild.save().catch(err => message.channel.send(`\`[❌DataBase]\` Произошла ошибка при сохранении данных в базу-данных. Ошибка: \`\`\`${err}\`\`\``));
        }
    });
    User.findOne({userID: message.author.id}, (err,res) => {
    if(err) return message.channel.send(`\`[❌DataBase]\` Произошла ошибка при добавлении пользователя в базу-данных`);
    if(!res) {
      let user = new User({userID: message.author.id})
      user.save().catch(err => message.channel.send(`\`[❌DataBase]\` Произошла ошибка при сохранении данных в базу-данных. Ошибка: \`\`\`${err}\`\`\``));
    }
    else {
        Achive.findOne({userID: message.author.id}, (err,data) => {
            if(!data) {
                let achiveUser = new Achive({userID: message.author.id});
                return achiveUser.save();
            }
            if(res.messages == 2000) {
                message.channel.send(`Вы выполнили ачивку ${achives[0]}`);
                data.one = true;
                data.save();
                res.coins += 10;
                res.messages += 1;
                return res.save();
            }
            if(res.messages == 5000) {
                message.channel.send(`Вы выполнили ачивку ${achives[1]}`);
                data.two = true;
                data.save();
                res.coins += 20;
                res.messages += 1;
                return res.save();
            }
            res.messages += 1;
            res.save();
        });
    }
});

    if (message.content.toLowerCase().includes("сними") || message.content.toLowerCase().includes("снять")) {
        Guild.findOne({guildID:message.guild.id}, async (err,data) => {
        if (!message.member.roles.cache.some(r => canremoverole.includes(r.name)) && !message.member.hasPermission("MANAGE_ROLES")) return
        const args = message.content.split(/ +/);
        let onebe = false;
        let twobe = false;
        args.forEach(word => {
            if (word.toLowerCase().includes(`роль`)) onebe = true
            if (word.toLowerCase().includes(`у`)) twobe = true
        })
        if (!onebe || !twobe) return
        if (message.mentions.users.size > 1) return message.react(`📛`)
        let user = message.guild.member(message.mentions.users.first());
        if (!user) return message.react(`📛`)
        if (data.snyatie.includes(message.author.id + `=>` + user.id)) return message.react(`🕖`)
        let reqchat = message.guild.channels.cache.find(c => c.name == `🎫requests-for-roles`); // Найти чат на сервере.
        if (!reqchat) {
            message.reply(`\`Ошибка выполнения. Канал 🎫requests-for-roles не был найден!\``)
            return console.error(`Канал 🎫requests-for-roles не был найден!`)
        }
        let roleremove = user.roles.cache.find(r => rolesgg.includes(r.name));
        if (!roleremove) return message.react(`📛`)

        message.reply(`\`напишите причину снятия роли.\``).then(answer => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then((collected) => {
                const embed = new Discord.MessageEmbed()
                    .setTitle("`Discord » Запрос о снятии роли.`")
                    .setColor("#483D8B")
                    .addField("Отправитель", `\`Пользователь:\` <@${message.author.id}>`)
                    .addField("Кому снять роль", `\`Пользователь:\` <@${user.id}>`)
                    .addField("Роль для снятия", `\`Роль для снятия:\` <@&${roleremove.id}>`)
                    .addField("Отправлено с канала", `<#${message.channel.id}>`)
                    .addField("Причина снятия роли", `${collected.first().content}`)
                    .addField("Информация", `\`[✔] - снять роль\`\n` + `\`[❌] - отказать в снятии роли\`\n` + `\`[D] - удалить сообщение\``)
                    .setFooter("© Support Team | by Kory_McGregor")
                    .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    answer.delete();
                    collected.first().delete();
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                data.snyatie.push(message.author.id + `=>` + user.id);
                data.save();
                return message.react(`📨`);
            }).catch(() => {
                return answer.delete()
            });
        });
    });
}



if (message.content.toLowerCase().includes("роль") && !message.content.toLowerCase().includes(`сними`) && !message.content.toLowerCase().includes(`снять`)) {
       Guild.findOne({guildID:message.guild.id}, async (err,data) => {
           if(err) console.log(err);
           if(!data) {
               console.log(`No message data for ${message.guild.name}`);
           }
           // Проверить невалидный ли ник.
        if (data.nrpnames.includes(message.member.displayName)) {
            if (message.member.roles.cache.some(r => rolesgg.includes(r.name))) {
                for (var i in rolesgg) {
                    let rolerem = bot.guilds.cache.find(g => g.id == message.guild.id).roles.cache.find(r => r.name == rolesgg[i]);
                    if (message.member.roles.cache.some(role => [rolesgg[i]].includes(role.name))) {
                        await message.member.roles.remove(rolerem); // Забрать роли указанные ранее.
                    }
                }
            }
            let govrole = message.guild.roles.cache.find(r => r.name == `★ Государственные структуры ★`);
            if (message.member.roles.cache.some(r => r == govrole)) {
                await message.member.roles.remove(govrole)
            }
            message.react(`📛`) // Поставить знак стоп под отправленным сообщением.
            return // Выход
        }
        // Проверить все доступные тэги
        for (var i in manytags) {
            let nicknametest = message.member.displayName.toLowerCase();
            nicknametest = nicknametest.replace(/ /g, '');
            if (nicknametest.includes("[" + manytags[i].toLowerCase()) || nicknametest.includes(manytags[i].toLowerCase() + "]") || nicknametest.includes("(" + manytags[i].toLowerCase()) || nicknametest.includes(manytags[i].toLowerCase() + ")") || nicknametest.includes("{" + manytags[i].toLowerCase()) || nicknametest.includes(manytags[i].toLowerCase() + "}")) {
                let rolename = tags[manytags[i].toUpperCase()] // Указать название роли по соответствию с тэгом
                let role = message.guild.roles.cache.find(r => r.name == rolename); // Найти эту роль на discord сервере.
                let reqchat = message.guild.channels.cache.find(c => c.name == `🎫requests-for-roles`); // Найти чат на сервере.
                if (!role) {
                    message.reply(`\`Ошибка выполнения. Роль ${rolename} не была найдена.\``)
                    return console.error(`Роль ${rolename} не найдена!`);
                } else if (!reqchat) {
                    message.reply(`\`Ошибка выполнения. Канал 🎫requests-for-roles не был найден!\``)
                    return console.error(`Канал 🎫requests-for-roles не был найден!`)
                }
                if (message.member.roles.cache.some(r => [rolename].includes(r.name))) {
                    return message.react(`👌`) // Если роль есть, поставить окей.
                }
                if (data.sened.includes(message.member.displayName)) return message.react(`🕖`) // Если уже отправлял - поставить часы.
                let nickname = message.member.displayName;
                const embed = new Discord.MessageEmbed()
                    .setTitle("`Discord » Проверка на валидность ник нейма.`")
                    .setColor("#483D8B")
                    .addField("Аккаунт", `\`Пользователь:\` <@${message.author.id}>`, true)
                    .addField("Никнейм", `\`Ник:\` ${nickname}`, true)
                    .addField("Роль для выдачи", `\`Роль для выдачи:\` <@&${role.id}>`)
                    .addField("Отправлено с канала", `<#${message.channel.id}>`)
                    .addField("Информация по выдачи", `\`[✔] - выдать роль\`\n` + `\`[❌] - отказать в выдачи роли\`\n` + `\`[D] - удалить сообщение\``)
                    .setFooter("© Support Team | by Kory_McGregor")
                    .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                data.sened.push(message.member.displayName); // Пометить данный ник, что он отправлял запрос.
                data.save();
                return message.react(`📨`);
            }
        }
       });
    }




     if(message.channel.name === "💰заказ-услуг") {
        if(message.guild.channels.cache.some(channel => channel.name === `${message.member.id}`)) {
            await message.delete();
            return await message.channel.send(`**Нельзя иметь более одного запроса!**`)
                .then(m => m.delete({timeout:5000}));
        }
        await message.delete();
        await message.channel.send(`**По вашему запросу создан канал снизу!**`)
            .then(m => m.delete({timeout:5000}));
        let embedForShop = await new Discord.MessageEmbed()
            .setTitle("Shop")
            .setColor("#FF0000")
            .setDescription("Покупка товара в магизине")
            .addField("**Вас проконсультируют продавцы:**", `<@&726804311325016077>`)
            .addField("**Информация о товарах находится в канале:**", `<#757601788307439766>`)
            .addField("**В данном канале вы можете:**", `\`\`Спросить у продавца подробную информацию про товар\`\`,\n\`\`Купить товар\`\`,\n\`\`Купить валюту\`\``)
            .addField("**Ожидайте**", `\`\`С вами свяжется 1 из продавцов нашей лавки!\`\``)
            .addField("**Если у вас нет вопросов:**",`\`\`Нажмите на черную галочку ниже что-бы закрыть обращение!\`\``)
            .setFooter("© Central District Shop | by Developer Montano")
        let member_shop_channel = await message.guild.channels.create(message.member.id, {
            type: "text",
            parent: "757598789157781585",
            permissionOverwrites:[
        {
            id:message.member.id,
            allow: ['VIEW_CHANNEL','SEND_MESSAGES','READ_MESSAGE_HISTORY','ATTACH_FILES',],
            deny: ['MANAGE_MESSAGES','MENTION_EVERYONE','CREATE_INSTANT_INVITE','MANAGE_CHANNELS']
        },
        {
            id:message.guild.roles.cache.find(role => role.name === "@everyone").id,
            allow: [],
            deny: ['MANAGE_MESSAGES','MENTION_EVERYONE','VIEW_CHANNEL','SEND_MESSAGES','READ_MESSAGE_HISTORY','CREATE_INSTANT_INVITE']
        },
        {
            id:message.guild.roles.cache.find(role => role.name === "❖ Продавец ❖").id,
            allow: ['VIEW_CHANNEL','SEND_MESSAGES','READ_MESSAGE_HISTORY','ATTACH_FILES','MANAGE_MESSAGES','MANAGE_CHANNELS'],
            deny: ['MENTION_EVERYONE','CREATE_INSTANT_INVITE']
        }
        ],
        reason: "Creating shop Channel"
    }
);
        await member_shop_channel.send(embedForShop)
            .then(async msg =>  {
                await msg.react('✔');
                await msg.pin();
                 const filter = (reaction, user) => reaction.emoji.name === '✔' && user.id === `${message.member.id}`
                    msg.awaitReactions(filter, {
                        max:1,
                        time:86400000,
                        errors:['time']  
                    }) 
                    .then(collected => {
                        member_shop_channel.delete();
                        message.member.send(`\`\`Вы закрыли свой запрос!\`\``);
                    })
                    .catch(console.error);
            })
            .catch(err => message.channel.send(`error`));
       
    }

    if (message.channel.id === "757601758091673732") {
        const reportAuthor = message.author.id;
        Report.findOne({reportUser: message.author.id}, (err,data) => {
            if(err) console.log(err);
            if(!data) {
                let newUser = new Report({reportUser: message.author.id});
                console.log('Добавлен репорт!')
                newUser.save();
                Guild.findOne({guildID:message.guild.id}, (err,guild) => {
                    if(err) console.log(err);
                    if(!guild) {
                        return console.log(`Сервер не найден`);
                    }
                    const tehchannel = message.guild.channels.cache.find(c=> c.name == `📜вопросы-и-жалобы`);
                    const supportedRoles = [
                        "⚒ Support Team Discord ⚒",
                        "@everyone",
                    ];
                    const moderRole = message.guild.roles.cache.find(r => r.name == supportedRoles[0]);
                    const embedFinish = new Discord.MessageEmbed() 
                            .setTitle("`Report » Поступила новый вопрос/жалоба.`")
                            .setColor(`${message.member.displayHexColor}`)
                            .addField("От", `\`Пользователя:\` <@${message.author.id}>`, true)
                            .addField("Отправлено с канала", `<#${message.channel.id}>`)
                            .addField("Вам помогут:", `<@&${moderRole.id}> - Модераторы`)
                            .addField("Если у вас не осталось вопросов", `\`\`Вы можете закрыть свое обращение нажав на \`\`  ✔`)
                            .setFooter("© Report | by Developer Montano")
                            .setTimestamp();
                    const generatedChannel = "вопрос-" + getRandomInt(1,11);
                    message.member.send(`\`\`Канал вашего обращения  - ${generatedChannel}\`\``)
                    if (message.guild.channels.cache.some(c => c.name === generatedChannel)) {
                        return message.channel.send(`Канал ${generatedChannel} уже существует`);
                    }
                   guild.countReports++;
                   guild.activeReports++; 
                    const supportEmbed = new Discord.MessageEmbed()
                       .setAuthor("Report » Обработчик репортов.","https://cdn.discordapp.com/avatars/509074641025892419/c6f9ba7a1038a81f9876d162df5a89a6.png")
                       .setTitle("Rodina Rp 01 | Report ")
                       .setColor(`${message.member.displayHexColor}`)
                       .addField("Правила подачи репорта:","\`\`\`1. Запрещено оскорбительное и неадекватное поведение.\n2. Запрещено создавать репорт с некорректным вопросом.\n3. После создания репорта сразу описывайте свою проблему. \n4. Запрещено флудить @упоминаниями.\n5. Запрещено оффтопить в канал репорта.\`\`\`")
                       .setImage("https://imgur.com/LKDbJeM.gif")
                       .addField("Всего", `\`Обработанных запросов:\` ${guild.countReports}`, true)
                       .addField("Всего",`\`Активных запросов:\` ${guild.activeReports}`,true) 
                       .addField("Всего",`\`Закрытых запросов:\` ${guild.closedReports}`,true)
                       .addField("Последний репорт от пользователя:", `<@${message.author.id}>`, true)                       
                       .setFooter("© Report | by Developer Montano")
                       .setTimestamp();      
                   tehchannel.messages.fetch('758000475961294889')
                    .then(message => message.edit("", {embed: supportEmbed}))
                    .catch(err => message.channel.send(err));
                    const newChannel = message.guild.channels.create(generatedChannel,{type:'text'})
                    .then(r => r.setParent("757598790197706763"))
                    .then(m => m.createOverwrite(message.author, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: true,
                            READ_MESSAGE_HISTORY:true
                        }))
                    .then (i => i.createOverwrite(message.guild.roles.cache.find(role => role.name === supportedRoles[1]), {
                        VIEW_CHANNEL: false,
                        SEND_MESSAGES: false,
                    }))
                    .then(c => c.createOverwrite(message.guild.roles.cache.find(role => role.name === supportedRoles[0]), {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY:true
                    })).then(channel => channel.send(embedFinish))
                    .then(async msg =>  {
                        await msg.react('✔');
                        await msg.pin();
                         const filter = (reaction, user) => reaction.emoji.name === '✔' && user.id === `${message.member.id}`;
                            msg.awaitReactions(filter, {
                                max:1,
                                time:86400000,
                                errors:['time']  
                            }) 
                            .then(async collected => {
                                await collected.first().message.channel.delete();
                                await newUser.delete();
                                await guild.closedReports++;
                                await guild.activeReports--;
                                await guild.save();
                                await tehchannel.messages.fetch('758000475961294889')
                                            .then(message => message.edit(
                                                new Discord.MessageEmbed()
                                                   .setAuthor("Report » Обработчик репортов.","https://cdn.discordapp.com/avatars/509074641025892419/c6f9ba7a1038a81f9876d162df5a89a6.png")
                                                   .setTitle("Rodina Rp 01 | Report ")
                                                   .setColor(`#${randomColor()}`)
                                                   .addField("Правила подачи репорта:","\`\`\`1. Запрещено оскорбительное и неадекватное поведение.\n2. Запрещено создавать репорт с некорректным вопросом.\n3. После создания репорта сразу описывайте свою проблему. \n4. Запрещено флудить @упоминаниями.\n5. Запрещено оффтопить в канал репорта.\`\`\`")
                                                   .setImage("https://imgur.com/LKDbJeM.gif")
                                                   .addField("Всего", `\`Обработанных запросов:\` ${guild.countReports}`, true)
                                                   .addField("Всего",`\`Активных запросов:\` ${guild.activeReports}`,true) 
                                                   .addField("Всего",`\`Закрытых запросов:\` ${guild.closedReports}`,true)
                                                   .setFooter("© Report | by Developer Montano")
                                                   .setTimestamp()
                                                ))
                                            .catch(err => message.channel.send(err));
                                await message.member.send(`\`\`Вы закрыли свой запрос!\`\``);
                            })
                            .catch(console.error);
                    })
                    .catch(err => message.channel.send(`error`));
                    message.delete();
                guild.save();
            });
                

        }
            else {
                message.delete();
                return message.channel.send(`<@${reportAuthor}> \`\`Вы не можете создать репорт повторно! \`\`` )
                .then(msg => msg.delete({timeout:5000}));
            }
        });
            
    }
    




    /*
    *
    *
    *    Команды
    *
    */


    let prefix = "/";

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

      
    if (!command.startsWith(prefix)) return;
       
    let cmd = bot.commands.get(command.slice(prefix.length));

    if (!cmd) return;

    if (cmd) cmd.run(bot, message, args);
}
    
