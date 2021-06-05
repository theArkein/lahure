const ytdl = require("ytdl-core");
const yts = require( 'yt-search' )

module.exports = {
  name: "playfm",
  description: "Play FM in your channel!",
	alias: ['playfm', 'pf', 'pfm'],
  async execute(message) {
    try {
      const args = message.content.split("-playfm ");
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
      const songs = await this.getSongs(args[1])
      
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: songs,
        volume: 5,
        playing: true
      };

      queue.set(message.guild.id, queueContruct);
      // queueContruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        this.play(message, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }

    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },

  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);
    if (!song) {
      console.log("no song")
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url, { filter : 'audioonly' }))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on("error", error => console.error("error"));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Now playing: ${song.title}`);
  },

  async getSongs(query){
    let song = await this.getSongInfo(query)
    let songs = []
    songs.push(song)
    for(let i=0;i<4;i++){
      let song = await this.getNextSong(songs[i])
      songs.push(song)
    }
    return songs
  },

  async getSongInfo(query){
    let results = await yts(query)
    let song = results.videos[0]
  
    return {
      title: song.title,
      url: song.url
    };

  },
  
  async getNextSong(refSong){
    console.log("ref:", refSong)
    let queryResult = await ytdl.getInfo(refSong.url)
    console.log(queryResult.response.contents.twoColumnWatchNextResults.autoplay.autoplay.sets[0].autoplayVideo.watchEndpoint)
    let songurl = queryResult.response.contents.twoColumnWatchNextResults.autoplay.autoplay.sets[0].autoplayVideo.watchEndpoint.videoId
    // let song = this.getSongInfo(songurl)
    // return song
  }
};

