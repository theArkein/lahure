const {getSongInfo} = require('../util/getSongInfo')
const {playSong} = require('../util/playSong')

module.exports = {
  name: "play",
  description: "Play a song in your channel!!",
	alias: ['play', 'p'],
  async execute(message) {
    try {
      
      const query = message.input.query
      const guild = message.guild;
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

      // const songInfo = await ytdl.getInfo(songUrl);
      const song = await getSongInfo(query)
      if(!song){
        message.channel.send(`Found nothing`);
        voiceChannel.leave();
        queue.delete(guild.id);
        return 
      }
      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          playSong(message, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song);
        return message.channel.send(
          `${song.title} has been added to the queue!`
        );
      }
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },

};

