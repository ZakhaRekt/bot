const Discord = require('discord.js');
const User = require("../../data/user.js");
const Promo = require("../../data/promocodes.js");


module.exports = {
    name: "promo",
    category: "economy",
    description: "Команда для использования промокода",

    async run(bot, message, args) {
        if (!args[0]) {
            await message.delete();
            return await message.channel.send(`\`\`Укажите промокод который хотите использовать!\`\``)
                .then(msg => msg.delete({ timeout: 5000 }));
        }
        Promo.findOne({ name: args[0] }, async (err, data) => {
            if(err) console.log(err);
            if (!data) {
                return await message.channel.send('**Промокод не найден в базе!**');
            }
            if (data.IsPromoUser == 1) {
                if (data.promoUsers.includes(message.author.id)) {
                    return await message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`**Вы уже использовали данный промокод!**`)
                        .setColor(`${message.member.displayHexColor}`));
                }
                if (data.promoLevel == 1) {
                    User.findOne({ userID: message.author.id }, async (err, userData) => {
                        if (!userData) {
                            return await message.channel.send(`Ошибка! No userData found!`);
                        }
                        if(data.owner === message.author.id) {
                            return message.channel.send(`\`\`Нельзя использовать свой промокод!\`\``)
                        }
                        if(userData.userPromo != "") return message.channel.send(`\`\`У вас уже есть использованный промокод!\`\``)
                        userData.coins += 2;
                        userData.userPromo = args[0];
                        data.promoUsers.push(message.author.id);
                        await userData.save();
                        await data.save();
                        await message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`**Вы использовали промокод: ${args[0]}. Всего использований: ${data.promoUsers.length}**`)
                            .setColor(`${message.member.displayHexColor}`)
                        );
                    });
                }
                else if (data.promoLevel == 2) {
                    User.findOne({ userID: message.author.id }, async (err, userData) => {
                        if (!userData) {
                            return await message.channel.send(`Ошибка! No userData found!`);
                        }
                        if(data.owner === message.author.id) {
                            return message.channel.send(`\`\`Нельзя использовать свой промокод!\`\``)
                        }
                        if(userData.userPromo != "") return message.channel.send(`\`\`У вас уже есть использованный промокод!\`\``)
                        userData.coins += 4;
                        userData.userPromo = args[0];
                        data.promoUsers.push(message.author.id);
                        await userData.save();
                        await data.save();
                        await message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`**Вы использовали промокод: ${args[0]}. Всего использований: ${data.promoUsers.length}**`)
                            .setColor(`${message.member.displayHexColor}`)
                        );
                    });
                }
                else {
                    User.findOne({ userID: message.author.id }, async (err, userData) => {
                        if (!userData) {
                            return await message.channel.send(`Ошибка! No userData found!`);
                        }
                        if(data.owner === message.author.id) {
                            return message.channel.send(`\`\`Нельзя использовать свой промокод!\`\``)
                        }
                        if(userData.userPromo != "") return message.channel.send(`\`\`У вас уже есть использованный промокод!\`\``)
                        userData.coins += 6;
                        userData.userPromo = args[0];
                        data.promoUsers.push(message.author.id);
                        await userData.save();
                        await data.save();
                        await message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`**Вы использовали промокод: ${args[0]}. Всего использований: ${data.promoUsers.length}**`)
                            .setColor(`${message.member.displayHexColor}`)
                        );
                    });
                }
            }else {
                if (data.amountUses <= 0) {
                    await data.remove({ name: args[0] });
                    return await message.channel.send(`**Промокод не действителен!**`);
                }
                if (data.promoUsers.includes(message.author.id)) {
                    return await message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`**Вы уже использовали данный промокод!**`)
                        .setColor(`${message.member.displayHexColor}`));
                }
                User.findOne({ userID: message.author.id }, async (err, userData) => {
                    if (!userData) {
                        return await message.channel.send(`Ошибка! No userData found!`);
                    }
                    userData.coins += data.coinsPerUse;
                    data.promoUsers.push(message.author.id);
                    data.amountUses--;
                    await userData.save();
                    await data.save();
                    await message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`**Вы использовали промокод: ${args[0]}. Осталось промокодов: ${data.amountUses}**`)
                        .setColor(`${message.member.displayHexColor}`)
                    );
                });
            }
        });

    }
};
