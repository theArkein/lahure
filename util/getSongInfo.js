const yts = require( 'yt-search' )

exports.getSongInfo = async (query)=>{
    let results = await yts(query)
    if(!results.videos.length){
      return null
    }
    let song = results.videos[0]
    return {
      title: song.title || "Title not found",
      url: song.videoId
    };
  }