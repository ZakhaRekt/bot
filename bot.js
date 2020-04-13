
//Подключение discord.js
const config = require('./config.json');
const Discord = require('discord.js'); 
const { Client, Collection } = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commands = {};




const fs = require('fs');
const utils = require('util');

const readFileAsync = utils.promisify(fs.readFile);
const writeFileAsync = utils.promisify(fs.writeFile);
const readDirAsync = utils.promisify(fs.readdir);
const existsAsync = utils.promisify(fs.exists);




module.exports.readFileAsync = readFileAsync;
module.exports.writeFileAsync = writeFileAsync;
module.exports.readDirAsync = readDirAsync;
module.exports.existsAsync = existsAsync; 

//"достаём" токен и префикс
const { token } = require("./config.json"); 
const prefix = config.prefix;


client.commands = new Collection();


["command", "listener"].forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});



//создаём ссылку-приглашение для бота
client.on('ready', () => { 
    console.log(`Started ${client.user.username}`);
    client.generateInvite(["ADMINISTRATOR"]).then(link => { 
        console.log(link);
    });
});


//Загрузка команд
async function loadCommands(path) {
	console.log ("loading commands...");
	let files = await utils.readDirAsync(path);
	files.forEach(file => {
		if (file.endsWith('.js')) {
			let cname =file.toLowerCase().substring(0, file.lenght - 3);
			let command = require(`${path}/${file}`);
			commands[cname] = command;
		}
	});
}


//Команды
client.on('message', async msg => {
	if (msg.author.bot || msg.channel.type != "text") return;
	if (msg.content.toLowerCase().startsWith(prefix)) {
		let m = msg.content.slice(prefix.lenght);
		for(let cname in commands) {
			if (m.startsWith(cname)) {
				let args =  m.slice(cname.lenght).split(' ').filter(el => el != '');
				await commands[cname].run(client,msg,args);
			}
		}
	}
});


//Login client
client.login(token);