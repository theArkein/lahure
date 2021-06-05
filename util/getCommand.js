const fs = require('fs')
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

let commandMap = []

for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
    commandMap.push(
        {
            command: `${command.name}`,
            alias: command.alias
        }
    )
}

const check = (command, commandMap)=>{
    let mappedCommand = null
    for(let i=0; i<commandMap.length; i++){
        // check if command exists
        if(commandMap[i].alias.includes(command)){
            mappedCommand = commandMap[i].command
            break;
        }
    }
    return mappedCommand
}

module.exports = (command)=>{
    return check(command, commandMap)
}