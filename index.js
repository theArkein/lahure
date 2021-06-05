const fs = require('fs')
const express = require('express')
const Discord = require('discord.js');
const Client = require('./client/Client');
const getCommand = require('./util/getCommand');
require('dotenv').config()

const app = express()

app.get('/', (req, res) => {
  res.send('lahure Discord bot')
})

app.listen(process.env.PORT, () => {
  console.log(`Running on port: ${process.env.PORT}`)
})

const {
	prefix
} = require('./config.json');

const token = process.env.TOKEN

const config = {
	autoplay: true
}

const client = new Client(config);
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

console.log(client.commands);

client.once('ready', () => {
	console.log('Ready!');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', async message => {
	const content = message.content.toLowerCase()
	const args = content.split(" ");
	let commands = args.filter(arg=>arg[0]==='-')
	let query = args.filter(arg=>arg[0]!=='-')
	
	commands = commands.map(command=>command.slice(prefix.length))
	query = query.join(" ")
	message.input = {}
	message.input.commands = commands
	message.input.query = query
	
	commandName = getCommand(commands[0])
	const command = client.commands.get(commandName);

	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	try {
		if(commandName == "ban" || commandName == "userinfo") {
			command.execute(message, client);
		} else {
			command.execute(message);
		}
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});


client.login(token);