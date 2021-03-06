import React from "react"
import { withRouter, Prompt } from "react-router-dom"
import { Spin, Skeleton, Dropdown, Modal, Select,
         Menu, message, TimePicker, Button, Input } from "antd"
import { SearchOutlined, SettingFilled, PlusOutlined, PushpinOutlined,
         PushpinFilled, EditOutlined } from '@ant-design/icons'
import moment from 'moment'

import Logo from "./components/Logo"
import { getYTDetails, isEmpty, msToMins, secToStr, strToSec, randstr } from "./utils"
import data from "./data"

import "./VideoNotes.css"
const { TextArea } = Input

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
  localStorage.setItem("data", JSON.stringify(data))
}

// get's all the courses in options format
function getCourseOpts(){
  const cids = Object.keys(data)
  let opts = []
  for(let cid of cids){
    let label = `${data[cid].code} : ${data[cid].name}`
    opts.push({value:cid, label:label})
  }
  return opts
}

// get's all the unique tags for a course in options format
function getTagsOpts(cid) {
  let videos = data[cid].videos
  let tagOptions = []
  let tags = {}
  videos.map(video =>
    video.notes.map(note =>
      note.tags.map(tag => tags[tag] = true)
    )
  )
  Object.keys(tags).map(tag => tagOptions.push({label:tag, value:tag}))
  return tagOptions
}

// replace the entry in data[cid].videos array where video.id = vid
function editVideoDetails(videoDetails){
  let course = getVideoCourse(videoDetails.id)
  let uIndex = course.videos.findIndex((video) => video.id == videoDetails.id)
  course.videos[uIndex] = videoDetails
  localStorage.setItem("data", JSON.stringify(data))
}

// checks if note has at least one tag of tags
function noteHasTag(note, tags){
  return tags.some(tag => note.tags.includes(tag))
}

class VideoNotes extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      ytDetails: {}, //remote data - url
      lectureDetails: {}, //data[cid].videos[vid]
      editingNote: null, //nid of note being edited
      newNote: false, //whether we're editing a newly create note (just after '+')
      editingLecture: false, //whether I'm editing title & class of lecture
      search:[],
      pinned: true // is the video pinned?
    }
    this.tempEdits = {} //temp data to hold title & class edit details
    this.filterTags = []
    this.filterOpen = false
  }

  goToHome = () => this.props.history.push("/")

  getVideoId = () => this.props.match.params["videoId"]

  getNav = () => {
    let {cid} = getVideoCourse(this.getVideoId())
    let options = getTagsOpts(cid)
    return (
    <nav className="notes-nav">
      <Logo style={{height: "36px", width:"36px", padding:"3px"}} onClick={this.goToHome}/>
      <div className="filter-select">
        <Select 
          mode="tags"
          className="filter-tags specificiy"
          placeholder="Search by tags"
          showSearch={true}
          allowClear
          options={options}
          onDropdownVisibleChange={(open) => {
            this.filterOpen = open
            if(!open) this.updateFilter()
          }}
          onChange={(tags) => {
            this.filterTags = tags
            if(!this.filterOpen) this.updateFilter()
          }}
        >
        </Select>
        <SearchOutlined style={{fontSize: "22px"}}/>
      </div>
    </nav>
  )}

  updateFilter = () => {
    this.setState({search:this.filterTags})
  }

  componentDidMount() {
    const vid = this.getVideoId()
    // get the details
    let lecture = getVideoDetails(vid)

    // get the media details
    getYTDetails(vid).then(data => {
      if(isEmpty(lecture)){
        // create a lecture entry with defaults
        let length = msToMins(parseInt(data["approxDurationMs"]) || 0)
        lecture = {id:vid, title:data.title, notes:[], image:data.thumbnail, length}
        createVideoEntry("unclassified", lecture)
      }
      this.setState({ytDetails:data, lectureDetails:lecture})
    })
  }

  onNoteEditing = (nid) => {
    this.setState({editingNote: nid})
  }

  onNoteEdited = (update, uNote) => {
    if(update){
      let notes = this.state.lectureDetails.notes
      let i = notes.findIndex(note => note.id === uNote.id)
      notes[i] = uNote
      notes.sort((n1, n2) => n1.timestamp - n2.timestamp)
      /* bad practice ¯\_(ツ)_/¯
      // I should actually update lectureDetails, but this works?
      // I'm actually supposed to do what I did in "onNoteDeleted"
        uNotes = [...notes]
        uLecture = {...lecture, notes:uNotes}
        editVideoDetails(newLecture)
        this.setState({lectureDetails: newLecture})
       */
      localStorage.setItem("data", JSON.stringify(data))
    }
    this.setState({editingNote:null, newNote:false})
    if (update)
      message.success(`Note "${secToStr(uNote.timestamp)}" successfully edited!`)
  }

  onNoteDeleted = (nid) => {
    let lecture = this.state.lectureDetails
    let notes = lecture.notes.filter(note => note.id !== nid)
    let newLecture = {...lecture, notes:notes}
    editVideoDetails(newLecture)
    this.setState({lectureDetails: newLecture, newNote:false, editingNote:null})
    message.success("Note successfully deleted!")
  }

  onNoteAdded = () => {
    let id = "nid-" + randstr()
    let timestamp = Math.round(document.querySelector("#vid").currentTime)
    let newNote = {id, timestamp, content:"", tags:[]}
    let notes = this.state.lectureDetails.notes
    notes.push(newNote)
    notes.sort((n1, n2) => n1.timestamp - n2.timestamp)
    localStorage.setItem("data", JSON.stringify(data))
    this.setState({editingNote:id, pinned:false, newNote:true})
    document.querySelector("#vid").pause()
  }

  updateTitleClass = () => {
    // update the title or class
    let oldCid = getVideoCourse(this.getVideoId()).cid
    let newCid = this.tempEdits.class
    if(newCid && (newCid!== oldCid)){
      // remove video from old cid
      data[oldCid].videos = data[oldCid].videos.filter(v => 
                                              v.id !== this.getVideoId())

      // move it into new cid
      data[newCid].videos.unshift(this.state.lectureDetails)
      localStorage.setItem("data", JSON.stringify(data))
    }
    if(this.tempEdits.title){
      // bad practice ¯\_(ツ)_/¯
      // should setState + update data with new obj
      this.state.lectureDetails.title = this.tempEdits.title
      localStorage.setItem("data", JSON.stringify(data))
    }

    this.setState({editingLecture:false})
    this.tempEdits = {}
  }

  getTitleModal = () => {
    let opts = getCourseOpts()
    let {cid} = getVideoCourse(this.getVideoId())

    return (
      <Modal 
        title="Edit lecture details"
        visible={this.state.editingLecture}
        okText="Update"
        cancelText="Discard changes"
        onCancel={() => {
          this.setState({editingLecture:false})
          this.tempEdits = {}
        }}
        onOk={this.updateTitleClass}
        destroyOnClose
        className="lecture-edit-modal"
      >
        <div className="lecture-edit-body">
          <p className="label">Title</p>
          <Input  placeholder="Lecture Title"
                  className="title-input"
                  defaultValue={this.state.lectureDetails.title}
                  onChange={(e) => this.tempEdits.title = e.target.value}/>
          <p className="label">Course</p>
          <Select
            defaultValue={cid}
            options={opts}
            onChange={(cid) => this.tempEdits.class = cid}>
          </Select>
        </div>
      </Modal>
    )
  }

  getLoadingDOM = () => <Skeleton active/>

  render(){
    let { lectureDetails, ytDetails:{url}, editingLecture,
          editingNote, pinned, search, newNote } = this.state
    const vid = this.getVideoId()
    const loading = isEmpty(lectureDetails)
    let course = getVideoCourse(vid)
    let notes = lectureDetails.notes
    if(search.length>0)
      notes = notes.filter(note => noteHasTag(note,search))

    // if a note is bring edited or if search is active, can't edit
    const editable = (editingNote || search.length > 0) ? false : true
    return (
      <div className="notes-shell">
        {this.getNav()}
        <VideoPlayer url={url} pinned={pinned}/>
        {loading? this.getLoadingDOM() :
        (<>
        <div className="notes-content-wrapper">
          <div className="lecture-details">
            <div>
              <h2 className="lecture-title">{lectureDetails.title}</h2>
              <span className="lecture-course">{course.code} <b>·</b> {course.name}</span>
            </div>
            <EditOutlined 
              style={{fontSize:"20px", padding:"0 10px", cursor:"pointer"}}
              onClick={() => this.setState({editingLecture: true, tempEdits: {}})}
            />
            {this.getTitleModal()}
          </div>
          <Prompt
            when={(editingNote || editingLecture)?true:false}
            message={_ => "You have unsaved edits! Are you sure you want to move away?"}
          />
          {
            search.length > 0? <div className="search-results">You are currently searching for &nbsp;
                    {search.map(s => <span className="s-tag" key={s}>{s}</span>)}
                <br/>
                <span style={{color:"gray"}}>To edit or create new notes, please clear the search.</span>
            </div> 
            : null
          }
          <div className="notes-container">
            {notes.map(note => (
                  <Note
                    key={note.id}
                    data={note}
                    vid={vid}
                    editMode={editingNote == note.id}
                    editable={editable}
                    newNote={newNote}
                    onEditing={() => this.onNoteEditing(note.id)}
                    onDeleted={() => this.onNoteDeleted(note.id)}
                    onEdited={this.onNoteEdited}
                  />)
            )}
          </div>
        </div>
        <div className="notes-footer">
          <div className="left-side">
          {editable? <PlusOutlined onClick={this.onNoteAdded} style={{marginRight:"18px"}}/> : null}
          </div>
          <div className="right-side">
          { pinned? <PushpinFilled onClick={() => this.setState({pinned:false})}/> :
                    <PushpinOutlined onClick={() => this.setState({pinned:true})}/> }
          </div>
        </div>
        </>)}
      </div>
    )
  }
}

export default withRouter(VideoNotes)


class Note extends React.Component {
  constructor(props){
    super(props)
    this.editData = {} //props.data being edited
    this.note = React.createRef()
  }

  componentDidUpdate(oProps){
    if(oProps.editMode != this.props.editMode)
      this.note.current.scrollIntoView({behavior:"smooth", block:"center"})
  }

  componentDidMount(){
    if(this.props.editMode == true)
      this.note.current.scrollIntoView({behavior:"smooth", block:"center"})
  }

  onTimestamp = (sec) => {
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
      <Menu.Item onClick={this.props.onEditing}>
        Edit Note
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item danger onClick={this.onDeleteing}>
        Delete Note
      </Menu.Item>
    </Menu>
  )

  onDone = (update) => {
    if(update){
      let newNote = {...this.props.data, ...this.editData}
      this.props.onEdited(update, newNote)
    }
    else if(this.props.newNote) {
      // if this is a new note and you're "discarding" it,
      // just delete it.
      this.props.onDeleted()
    }
    else{
      this.props.onEdited(update, null)
    }
    this.editData = {}
  }

  timeUpdated = (_, timeStr) => this.editData.timestamp = strToSec(timeStr)
  contentUpdated = (e) => this.editData.content = e.target.value

  getEditBody = () => {
    let {timestamp, content, tags} = this.props.data
    const isNew = this.props.newNote
    
    // get moment object for default HH:mm:ss - tricky to deal with the formats
    let timeFormat = timestamp >= 3600 ? "hh:mm:ss" : "mm:ss"
    let defaultTime = moment(secToStr(timestamp), timeFormat)
    // save and discard button
    let buttons = (
            <div>
              <Button danger onClick={()=>this.onDone(false)} style={{marginRight: "10px"}}>
                Discard
              </Button>
              <Button type="primary" onClick={()=>this.onDone(true)}>
                {isNew? "Create": "Save" }
              </Button>
            </div>
    )

    let {cid} = getVideoCourse(this.props.vid)
    let options = getTagsOpts(cid)

    return (
    <>
      <div className="note-top-edit">
        <TimePicker defaultValue={defaultTime} format={timeFormat} 
                    showNow={false} onChange={this.timeUpdated} 
        />
        {buttons}
      </div>
      <div className="note-content-edit">
        <TextArea rows={3} defaultValue={content?content:""} onChange={this.contentUpdated}/>
      </div>
      <div className="note-tags-edit">
        <Select 
          mode="tags" 
          className="edit-tags"
          placeholder="add tags"
          showSearch={true}
          options={options}
          defaultValue={tags}
          onChange={(tags) => this.editData.tags = tags}
        >
        </Select>
        <PlusOutlined />
      </div>
    </>
    )
  }

  render(){
    // editMode => is this note being edited, show the edit interface
    // editable => if any other note is being edited don't show edit icon
    const {editMode, editable} = this.props
    const {tags, timestamp, content=""} = this.props.data

    return (
      <div className="note-item" ref={this.note}>
        {editMode? this.getEditBody() :
        (<>
          <div className="note-top">
            <div className="note-ts" onClick={()=>this.onTimestamp(timestamp)}>{secToStr(timestamp)}</div>
            <div className="note-edit" style={editable? {}: {display:"none"}}>
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
            {content}
          </div>
          <div className="note-tags">
            {tags.map(tag => <div className="note-tag" key={tag}>#{tag}</div>)}
          </div>
        </>)
        }
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
    let params = new URLSearchParams(window.location.search)
    let time = 0
    if (params.get('t') != null) time = parseInt(params.get('t'))
    const src = this.props.url || ""
    const height = `${this.state.width * (9/16)}px`
    return <video id='vid' autoPlay controls src={`${src}#t=${time}`} style={{height}} />
  }

  getLoadingDOM = () => {
    return <Spin tip="Loading..."/>
  }

  render(){
    const { width } = this.state
    const { url, pinned } = this.props
    const content = url? this.getVideoDOM() : this.getLoadingDOM()
    const height = `${this.state.width * (9/16)}px`
    const rootClass = pinned? "video-player pinned" : "video-player"
    return (
      <div className={rootClass} ref={this.player} >
       { width && 
        <div className="video-container" style={{height}}>
          {content}
        </div>
      }
      </div>
    )
  }
}

