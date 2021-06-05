const {google} = require ('googleapis');

google.options ({ auth: 'AIzaSyDHtc3nQrMZjlkWg3m1RbCE1V9SFoUGumc' });

const youtube = google.youtube('v3');

// Search Youtube -- callback is called on each found item (or error)
async function search_youtube (url) {
  let searchParams = {
    relatedToVideoId: url,
    part:             'snippet',
    type:             'video',
    maxResults:       1,
    order:            'date',
    safeSearch:       'moderate',
    videoEmbeddable:  true,
  };

  let res = await youtube.search.list (searchParams) 
  if(!res) {
    return null;
  }
  let results = res.data.items
  // results = results.map(item=>{
  //   let snippet = item.snippet || {title: "Title not found"};
  //   let title = snippet.title;
  //   return {
  //     url: item.id.videoId,
  //     title: title
  //   }
  // })
  let song = results[0]
  let snippet = song.snippet || {title: "Title not found"};
  let title = snippet.title;
  return {
    url: song.id.videoId,
    title: title
  }
}

exports.getRelatedSong = async (url)=>{
  return await search_youtube(url)
}