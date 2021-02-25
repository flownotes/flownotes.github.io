export function randstr(){
    return Math.random().toString(36).replace('0.','')
}

export function isEmpty(obj){
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}

//takes in time in ms, returns rounded up in min
export function msToMins(ms) {
  return Math.round(ms/(1000*60))
}

export async function getYTDetails(video_id) {
  const decodeQueryString = (queryString) => {
    let key, keyValPair, keyValPairs, r, val, _i, _len
    r = {}
    keyValPairs = queryString.split("&");
    for (_i = 0, _len = keyValPairs.length; _i < _len; _i++) {
      keyValPair = keyValPairs[_i];
      key = decodeURIComponent(keyValPair.split("=")[0]);
      val = decodeURIComponent(keyValPair.split("=")[1] || "")
      if (key == "url") {
        let urlParams = new URLSearchParams(val)
        let lsig = urlParams.get('lsig')
        r.lsig = lsig
      }
      r[key] = val
    }
    return r
  }

  const decodeStreamMap = (player_response) => {
    let quality, type, _i, _len, _ref
    let sources = {}
    _ref = player_response.streamingData.formats
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      let stream = _ref[_i]
      type = stream.mimeType.split(";")[0]
      quality = stream.quality
      stream.original_url = stream.url
      sources["" + type + " " + quality] = stream
    }
    return sources
  }

  const getSource = (video, type, quality) => {
    let exact, key, lowest, source, _ref;
    lowest = null;
    exact = null;
    _ref = video.sources;
    for (key in _ref) {
      source = _ref[key];
      if (source.mimeType.includes(type)) {
        if (source.quality.match(quality)) {
          exact = source;
        } else {
          lowest = source;
        }
      }
    }
    return exact || lowest;
  }

  const response = await fetch(`https://at8u8s124e.execute-api.eu-west-1.amazonaws.com/prod?video_id=${video_id}`,
                    {headers: { 'Content-Type' : 'text/plain'}})
  const video_info = await response.text()
  let video = decodeQueryString(video_info);
  if (video.status === 'fail') {
    console.error("ERROR, failed to get video details")
    return video
  }
  video.sources = decodeStreamMap(JSON.parse(video.player_response))
  return getSource(video, "video/mp4", "hd720")

  /* SAMPLE RESULTS returned
  {
    "itag": 22,
    "url": "https://r1---sn-q0cedn7s.googlevideo.com...",
    "mimeType": "video/mp4;+codecs=\"avc1.64001F,+mp4a.40.2\"",
    "bitrate": 700788,
    "width": 1280,
    "height": 720,
    "lastModified": "1609999185256509",
    "quality": "hd720",
    "fps": 24,
    "qualityLabel": "720p",
    "projectionType": "RECTANGULAR",
    "audioQuality": "AUDIO_QUALITY_MEDIUM",
    "approxDurationMs": "162887",
    "audioSampleRate": "44100",
    "audioChannels": 2,
    "original_url": "https://r1---sn-q0cedn7s.googlevideo.com/..."
  }
  */
}

//https://github.com/gurumukhi/youtube-screenshot
export function captureScreenshot() {
    let canvas = document.createElement("canvas")
    let video = document.querySelector("video")
    let ctx = canvas.getContext("2d")
    canvas.width = parseInt(video.style.width)
    canvas.height = parseInt(video.style.height)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL()
}
