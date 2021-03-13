let notes = [
  {
    "id":"nid1",
    "timestamp":190,
    "content":"Test content",
    "tags":[ "git", "html", "vcs"]
  },
  {
    "id":"nid2",
    "timestamp":255,
    "content":"Test content",
    "tags":[ "exam", "logistics"]
  },
  {
    "id":"nid3",
    "timestamp":441,
    "content":"Test content",
    "tags":["web","animation","git"]
  },
  {
    "id":"nid4",
    "timestamp":590,
    "content":"Test content",
    "tags":["css","js","design"]
  },
  {
    "id":"nid5",
    "timestamp":681,
    "content":"Test content",
    "tags":["exam"]
  },
  {
    "id":"nid6",
    "timestamp":1220,
    "content":"Test content",
    "tags":["web","html","js"]
  },
  {
    "id":"nid7",
    "timestamp":1554,
    "content":"Test content",
    "tags":["design","web","exam"]
  }
]

let videos = [
  {
    id : "90QvQ3p6brk",
    title: "L15 - Web animation in practice",
    length: 48, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th1.jpg"
  },
  {
    id : "LzELw8k1FEY",
    title: "L14 - CSS and easing functions",
    length: 51, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th2.jpg"
  },
  {
    id : "eRcAf69IdCk",
    title: "L13 - Understading CSS animations",
    length: 48, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th3.jpg"
  },
  {
    id : "TVpGb5Jj0GY",
    title: "L12 - JS vs CSS animation",
    length: 56, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th4.jpg"
  },
  {
    id : "kzvt3g8pUHQ",
    title: "L11 - Animation to convey context",
    length: 43, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th5.jpg"
  },
  {
    id : "4NKaIclN2fk",
    title: "L10 - Intro to animation on the web",
    length: 58, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th6.jpg"
  },
]

let _data = {
  cid1 : {
    code: "CSE 110",
    name: "Web design",
    active: true,
    videos: JSON.parse(JSON.stringify(videos))
  },
  cid2 : {
    code: "CSE 141",
    name: "Introduction to Computer Architecture",
    active: true,
    videos: JSON.parse(JSON.stringify(videos))
  },
  cid3 : {
    code: "CSE 121",
    name: "Systems Design",
    active: true,
    videos: JSON.parse(JSON.stringify(videos))
  },
  cid4 : {
    code: "CSE 101",
    name: "Computational Thinking",
    active: true,
    videos: JSON.parse(JSON.stringify(videos))
  },
  cid5 : {
    code: "CSE 100",
    name: "Basic CS stuff",
    active: false,
    videos: JSON.parse(JSON.stringify(videos))
  },
  cid6 : {
    code: "CSE 111",
    name: "Web design and development",
    active: false,
    videos: JSON.parse(JSON.stringify(videos))
  },
  unclassified : {
    code: "Unclassified",
    name: "unclassified",
    active: true,
    videos: []
  }
}

// if LS is not set, set it to this default
if(!localStorage.getItem("data")){
  localStorage.setItem("data", JSON.stringify(_data))
}
// and initialise data to LS data
let data = JSON.parse(localStorage.getItem("data"))
window.data = data

export default data