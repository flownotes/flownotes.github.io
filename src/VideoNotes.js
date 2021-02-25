import React from "react"
import { withRouter } from "react-router-dom"
import { Spin, Skeleton } from "antd"
import { SearchOutlined } from '@ant-design/icons'

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
  // this returns the cid
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

function editVideoDetails(){
  // need to call explicit render after this
}

class VideoNotes extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      ytDetails: {}, //remote data - url
      lectureDetails: {}, //data[cid].videos[vid]
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

  getLoadingDOM = () => <Skeleton active/>

  render(){
    let { lectureDetails, ytDetails:{url} } = this.state
    const vid = this.getVideoId()
    const loading = isEmpty(lectureDetails)
    let courseDetails = getVideoCourse(vid)
    return (
      <div className="notes-shell">
        {this.getNav()}
        <VideoPlayer url={url}/>
        {loading? this.getLoadingDOM() :
        (<>
          <div className="lecture-details">
            Lecture details
          </div>
          <div className="notes-container">
            <p>List of notes come here</p>
          </div>
        </>)}
      </div>
    )
  }
}

export default withRouter(VideoNotes)


class Note extends React.Component {

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

    // trigger the getYTDetails
    // const {vid} = this.props
    // getYTDetails(vid).then(data => this.setState({video:data}))

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

