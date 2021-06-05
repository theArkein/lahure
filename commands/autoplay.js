const {getSongInfo} = require('../util/getSongInfo')
const {playSong} = require('../util/playSong')

module.exports = {
  name: "autoplay",
  description: "Auto play songs after queue is finished (Toggle)",
  alias: ['autoplay', 'auto', 'a', '-ap'],
  async execute(message) {
      try {
        const queue = message.client.queue;
        const serverQueue = message.client.queue.get(message.guild.id);
  
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
          return message.channel.send(
            "You need to be in a voice channel to play music!"
          );
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
          return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
          );
        }
        if(!serverQueue)
          return message.channel.send(
            "Provide a song to start with"
        );
      } catch (error){
        console.log(error);
        message.channel.send(error.message);
      }
    let commands = message.input.commands
    if(commands.length>1){
        let option = commands[1]
        if(option === "off")
            message.client.config.autoplay = false
        if(option === "on")
            message.client.config.autoplay = true
    }
    message.client.config.autoplay = !message.client.config.autoplay
    console.log(message.client.config.autoplay)
  },

};