import React from "react"
import { withRouter } from "react-router-dom"
import { Spin, Skeleton, Dropdown, Modal, Menu, message } from "antd"
import { SearchOutlined, SettingFilled } from '@ant-design/icons'

import Logo from "./components/Logo"

import { getYTDetails, isEmpty, msToMins } from "./utils"
import data from "./data"

import "./VideoNotes.css"

/* LOGIC + Dataflow
  CURRENT : We have two different scenarios -
    1. Lecture Exists
      - VNotes makes the request for video details. Once it processes
          the return val, it hands over the 'url' to VPlayer.
      - The Vplayer shows a loading screen until it has props.url
      - The VNotes shows it's own loading for the title+class, and notes
          section on intial render, then in ComponentDidMount it fetches
          the data from local storage
    2. Additionally for New Lectures
      - Title and class are defaulted to "Title" and "unclassified"
      - The video object is created only on the first edit, viz on
          change of title, change of name or New note
      - The ID used is the same as the youtube video id of the url
      - During creation, 'length' for the Lecture is got as a part of
          the api request VNotes made earlier (to get the url).

  FINAL : later on if we have time
    1. Have our own backend (firebase function) which gets the url
        This will give us title, thumbnail and description?
    2. Reconsider auto-create for new videos

  There were a bunch of other considerations -
    1. Should 'id' be the same as youtube's video id? (currently : YES)
        After a lot of deleberation, yes, since otherwise you'd have to
        check for existance & generate a new uri at <Home/> and then also
        figure out a way for it to communicate the url id to <VideoNotes/>.
        Or you need to go to '/new' and then move to '/id' on save.
        Finally decided to have id = youtube id. Nothing to lose.
    2. Auto Create for new videos? (currently : NO)
        This is tricky as I need the length as a part of the {video} details.
        Creation should be done in ComponentDidMount, but I don't have the
        length. I guess I could create it after I get the request, but I'll
        think about it later.
*/

function getVideoDetails(vid){
  let cid, video, found = false
  for(cid in data){
    video = data[cid].videos.find(video => video.id === vid)
    if (video) {
      found = true
      break
    }
  }
  return found? video : {}
}

function getVideoCourse(vid){
  let cid, video, found = false
  for(cid in data){
    video = data[cid].videos.find(video => video.id === vid)
    if (video) {
      found = true
      break
    }
  }
  if (found){
    return {cid, ...data[cid]}
  }
  return {cid:"unclassified"}
}

// create a new video and adds it to data
function createVideoEntry(cid, lectureDetails){
  // were pushing the lecture directly, any changes
  // we make to it should also reflect on 'data'
  data[cid].videos.push(lectureDetails)
}

// replace the entry in data[cid].videos array where video.id = vid
function editVideoDetails(videoDetails){
  let course = getVideoCourse(videoDetails.id)
  let uIndex = course.videos.findIndex((video) => video.id == videoDetails.id)
  course.videos[uIndex] = videoDetails
}



class VideoNotes extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      ytDetails: {}, //remote data - url
      lectureDetails: {}, //data[cid].videos[vid]
      edit: null //nid of note being edited
    }
  }

  goToHome = () => this.props.history.push("/")

  getVideoId = () => this.props.match.params["videoId"]

  getNav = () => {
    return (
    <nav className="notes-nav">
      <Logo style={{height: "36px", width:"36px", padding:"3px"}} onClick={this.goToHome}/>
      <SearchOutlined style={{fontSize: "22px"}}/>
    </nav>
  )}

  componentDidMount() {
    const vid = this.getVideoId()
    // get the details
    let lecture = getVideoDetails(vid)

    // get the media details
    getYTDetails(vid).then(data => {
      if(isEmpty(lecture)){
        // create a lecture entry with defaults
        let length = msToMins(parseInt(data["approxDurationMs"]) || 0)
        lecture = {id:vid, title:"Title", notes:[], image:"/thumbnails/th1.jpg", length}
        createVideoEntry("unclassified", lecture)
      }
      this.setState({ytDetails:data, lectureDetails:lecture})
    })
  }

  onNoteEditing = (nid) => this.setState({edit: nid})

  onNoteEdited = (info) => console.log(info) //info note-obj

  onNoteDeleted = (nid) => {
    let lecture = this.state.lectureDetails
    let notes = lecture.notes.filter(note => note.id !== nid)
    let newLecture = {...lecture, notes:notes}
    editVideoDetails(newLecture)
    this.setState({lectureDetails: newLecture})
    message.success("Note successfuly deleted!")
  }

  getLoadingDOM = () => <Skeleton active/>

  render(){
    let { lectureDetails, ytDetails:{url} , edit} = this.state
    const vid = this.getVideoId()
    const loading = isEmpty(lectureDetails)
    let course = getVideoCourse(vid)
    let notes = lectureDetails.notes
    return (
      <div className="notes-shell">
        {this.getNav()}
        <VideoPlayer url={url}/>
        {loading? this.getLoadingDOM() :
        (<div className="notes-content-wrapper">
          <div className="lecture-details">
            <h2 className="lecture-title">{lectureDetails.title}</h2>
            <span className="lecture-course">{course.code} <b>·</b> {course.name}</span>
          </div>
          <div className="notes-container">
            {notes.map(note => (
                  <Note
                    key={note.id}
                    data={note}
                    editMode={edit == note.id}
                    onEditing={() => this.onNoteEditing(note.id)}
                    onDeleted={() => this.onNoteDeleted(note.id)}
                  />)
            )}
          </div>
        </div>)}
        {/* Footer comes here */}
      </div>
    )
  }
}

export default withRouter(VideoNotes)


class Note extends React.Component {
  onTimestamp = (ts) => {
    let time = ts.split(":").map(e => parseInt(e))
    let sec = time[0]*60 + time[1] // in sec

    // bad practice ¯\_(ツ)_/¯
    document.querySelector("#vid").currentTime = sec
  }

  onEditing = () => {
    this.props.onEditing()
  }
  onDeleteing = () => {
    Modal.confirm({
      title:"Are you sure you want to delete this note?",
      okText:"Delete",
      cancelText:"No, keep",
      okType:"danger",
      onOk:this.props.onDeleted
    })
  }

  // on edit: tell parent note 'id' is under edit, parent will update state => props.
  // on edit complete: tell parent {nid: new data}, parent will update state => props.
  // on delete complete : ask parent to delete note. parent will update state => props.
  getEditMenu = () => (
    <Menu onClick={(e) => e.domEvent.stopPropagation()}>
      <Menu.Item onClick={this.props.onNoteEditing}>
        Edit Note
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item danger onClick={this.onDeleteing}>
        Delete Note
      </Menu.Item>
    </Menu>
  )

  render(){
    const {tags, timestamp} = this.props.data
    return (
      <div className="note-item">
        <div className="note-top">
          <div className="note-ts" onClick={()=>this.onTimestamp(timestamp)}>{timestamp}</div>
          <div class="note-edit">
            <Dropdown 
              overlay={this.getEditMenu()}
              trigger={['click']}
              placement="bottomRight" 
              overlayClassName="note-item-edit"
            >
              <SettingFilled onClick={e => e.stopPropagation()} />
            </Dropdown>
          </div>
        </div>
        <div className="note-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec quam rhoncus
        sapien posuere venenatis. Vestibulum mattis imperdiet mi a blandit. Fusce ullamcorper
        ultricies dolor.
        </div>
        <div className="note-tags">
          {tags.map(tag => <div className="note-tag" key={tag}>#{tag}</div>)}
        </div>
      </div>
    )
  }
}

class VideoPlayer extends React.Component{
  constructor(props){
    super(props)
    this.player = React.createRef()
    this.state = {video:null, width:null}
  }

  componentWillUnmount(){
    delete this.observer
  }

  getTime(){
    //return current time
  }
  getLength(){

  }
  seek(){
  }
  play(status){
    // status=true => play; else pause
  }

  componentDidMount() {
    // set up the observable
    this.observer = new ResizeObserver(() => {
      let el = this.player.current
      if(el && (el.offsetWidth != this.state.width)){
        this.setState({width: this.player.current.offsetWidth})
      }
    })
    this.observer.observe(this.player.current)

    // setState the current width
    this.setState({
        width: this.player.current?.offsetWidth
    })
  }

  getVideoDOM = () => {
    const src = this.props.url || ""
    const height = `${this.state.width * (9/16)}px`
    return <video id='vid' controls src={src} style={{height}}/>
  }

  getLoadingDOM = () => {
    return <Spin tip="Loading..."/>
  }

  render(){
    const { width } = this.state
    const { url } = this.props
    const content = url? this.getVideoDOM() : this.getLoadingDOM()
    const height = `${this.state.width * (9/16)}px`
    return (
      <div className="video-player" ref={this.player} >
       { width && 
        <div className="video-container" style={{height}}>
          {content}
        </div>
      }
      </div>
    )
  }
}

