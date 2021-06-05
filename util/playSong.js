const ytdl = require("ytdl-core");
const {getRelatedSong} = require("./getRelatedSong")

const play = (message, song)=>{
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);
    console.log(song)
    if (!song) {
      console.log("no song")
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url, { filter : 'audioonly' }))
      .on("finish", async () => {
        if(message.client.config.autoplay && serverQueue.songs.length===1){
          let song = await getRelatedSong(serverQueue.songs[0].url)
          serverQueue.songs.push(song);
        }
        serverQueue.songs.shift();
        play(message, serverQueue.songs[0]);
      })
      .on("error", error => console.error("error"));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Now playing: ${song.title}`);
}

exports.playSong = play