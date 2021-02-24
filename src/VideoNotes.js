import React from "react"
import Logo from "./components/Logo"
import { Select, Spin } from "antd"
import { SearchOutlined } from '@ant-design/icons'
import { withRouter } from "react-router-dom"
import data from "./data"
import { getVideoDetails } from "./utils"

import "./VideoNotes.css"


class VideoNotes extends React.Component {
  constructor(props){
    super(props)
  }

  getVideoId = () => this.props.match.params["videoId"]

  getNav = () => {
    return (
    <nav className="notes-nav">
      <Logo style={{height: "36px", width:"36px", padding:"3px"}} onClick={this.goToHome}/>
      <SearchOutlined style={{fontSize: "22px"}}/>
    </nav>
  )}

  getPlayerDOM = () => {
    const vid = this.getVideoId()
    return (
      <VideoPlayer vid={vid}/>
      // title and class dropdown come here?
    )
  }

  render(){
    return (
      <div className="notes-shell">
        {this.getNav()}
        {this.getPlayerDOM()}
        <div className="notes-container">
          <p>List of notes come here</p>
        </div>
      </div>
    )
  }
}

export default withRouter(VideoNotes)


class VideoPlayer extends React.Component{
  constructor(props){
    super(props)
    this.player = React.createRef()
    this.state = {video:null, width:null}
  }

  componentWillUnmount(){
    delete this.observer
  }

  componentDidMount() {
    // set up the observable
    this.observer = new ResizeObserver(() => {
      let el = this.player.current
      if(el && (el.offsetWidth != this.state.width)){
        console.log("obs")
        this.setState({width: this.player.current.offsetWidth})
      }
    })
    this.observer.observe(this.player.current)

    // trigger the getVideoDetails
    const {vid} = this.props
    getVideoDetails(vid).then(data => this.setState({video:data}))

    // setState the current width
    this.setState({
        width: this.player.current?.offsetWidth
    })
  }

  getVideoDOM = () => {
    const src = this.state.video && this.state.video.url || ""
    return <video id='vid' controls src={src} />
  }

  getLoadingDOM = () => {
    return <Spin tip="Loading..."/>
  }

  render(){
    const { width, video } = this.state
    const content = video? this.getVideoDOM() : this.getLoadingDOM()
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

