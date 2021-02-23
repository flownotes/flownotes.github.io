import React from "react"
import Logo from "./components/Logo"
import { Select } from "antd"
import { SearchOutlined } from '@ant-design/icons'
import { withRouter, useHistory } from "react-router-dom";
import data from "./data"

import "./AllVideos.css"

// For search + autocomplete
// https://ant.design/components/auto-complete/#components-auto-complete-demo-certain-category
// What I can do is "enter text or # for tags", i.e. user can either search by text or by tag
// I can show dropdown when user starts the search with "#" but still doesn't solve search - 
// when to search text vs tags? how to search text? above UI doesn't solve multiple tags.
// *** one option is to have a switch between text and tags ***

class AllVideos extends React.Component {
  constructor(props){
    super(props)
    this.filterTags = []
  }

  goToHome = () => this.props.history.push("/")
  getCid = () => this.props.match.params["courseId"]
  getTagsOpts = () => {
    let cid = this.getCid()
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


  getNav = () => {
    const options = this.getTagsOpts()
    return (
    <nav className="all-videos-nav">
      <Logo style={{height: "36px", width:"36px", padding:"3px"}} onClick={this.goToHome}/>
      <Select 
        mode="tags" 
        className="filter-tags"
        placeholder="Search by tags"
        showSearch={true}
        allowClear
        suffixIcon={<SearchOutlined style={{fontSize: "22px"}}/>}
        options={options}
        onChange={(tags) => this.filterTags = tags}
      >
      </Select>
    </nav>
  )}

  render(){
    let cid = this.props.match.params["courseId"]
    const course = data[cid]
    const videos = course.videos
    return (
      <div className="videos-shell">
        {this.getNav()}
        <div className="video-container">
          <h2 className="course-title">{course.code}: {course.name}</h2>
          { videos.map(video => <Video key={video.id} video={video}/>)}
        </div>
      </div>
    )
  }
}

export default withRouter(AllVideos)


// the card ui for a single video lecture
function Video({video}){
  const {id, title, length, image, notes} = video
  const ncount = notes.length

  let history = useHistory()
  const goToCourse = () => {
    history.push(`/video/${id}`)
  }

  let h = Math.floor(length / 60)
  let m = length % 60
  const time = h > 0? `${h} hours ${m} min` : `${m} min`

  return(
    <div className="video-card" onClick={goToCourse}>
      <div className="video-card-header">
        <h2 className="video-title">{title}</h2>
      </div>
      {/* should the card also hold some description? user defined? taken from youtube? */}
      <p  className="video-details">{ncount} Notes <b>·</b> {time}</p>
      <img src={image} className="thumbnail" alt={`Thumbnail for ${title}`}/>
    </div>
  )
}
