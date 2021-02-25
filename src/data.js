let notes = [
  {
    "id":"nid1",
    "timestamp":"03:10",
    "content":"",
    "tags":[ "git", "html", "vcs"]
  },
  {
    "id":"nid2",
    "timestamp":"04:15",
    "content":"",
    "tags":[ "exam", "logistics"]
  },
  {
    "id":"nid3",
    "timestamp":"07:21",
    "content":"",
    "tags":["web","animation","git"]
  },
  {
    "id":"nid4",
    "timestamp":"09:50",
    "content":"",
    "tags":["css","js","design"]
  },
  {
    "id":"nid5",
    "timestamp":"11:10",
    "content":"",
    "tags":["exam"]
  },
  {
    "id":"nid6",
    "timestamp":"18:41",
    "content":"",
    "tags":["web","html","js"]
  },
  {
    "id":"nid7",
    "timestamp":"19:93",
    "content":"",
    "tags":["design","web","exam"]
  }
]

let videos = [
  {
    id : "90QvQ3p6brk",
    title: "L15 - Software Engineering in practice",
    length: 48, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th1.jpg"
  },
  {
    id : "LzELw8k1FEY",
    title: "L14 - Time management and estimation",
    length: 51, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th2.jpg"
  },
  {
    id : "eRcAf69IdCk",
    title: "L13 - Agile and sprints",
    length: 48, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th3.jpg"
  },
  {
    id : "TVpGb5Jj0GY",
    title: "L12 - Why your manager is wrong",
    length: 56, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th4.jpg"
  },
  {
    id : "kzvt3g8pUHQ",
    title: "L11 - Version control and automation",
    length: 43, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th5.jpg"
  },
  {
    id : "4NKaIclN2fk",
    title: "L10 - Software Engineering in practice",
    length: 58, //in min
    notes: JSON.parse(JSON.stringify(notes)),
    image: "/thumbnails/th6.jpg"
  },
]

let data = {
  cid1 : {
    code: "CSE 110",
    name: "Software Engineering",
    vcount: 14, //TODO: this should go, update AllCourses
    active: true,
    videos: JSON.parse(JSON.stringify(videos))
  },
  cid2 : {
    code: "CSE 141",
    name: "Introduction to Computer Architecture",
    vcount: 12,
    active: true,
    videos: JSON.parse(JSON.stringify(videos))
  },
  cid3 : {
    code: "CSE 121",
    name: "Systems Design",
    vcount: 15,
    active: true,
    videos: JSON.parse(JSON.stringify(videos))
  },
  cid4 : {
    code: "CSE 101",
    name: "Computational Thinking",
    vcount: 9,
    active: true,
    videos: JSON.parse(JSON.stringify(videos))
  },
  cid5 : {
    code: "CSE 100",
    name: "Basic CS stuff",
    vcount: 15,
    active: false,
    videos: JSON.parse(JSON.stringify(videos))
  },
  cid6 : {
    code: "CSE 111",
    name: "Web design and development",
    vcount: 9,
    active: false,
    videos: JSON.parse(JSON.stringify(videos))
  },
  unclassified : {
    code: "Unclassified",
    name: "Videos which belong to no class",
    vcount: 0,
    active: true,
    videos: []
  }
}

export default data

window.data = data