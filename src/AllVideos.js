import React from "react"
import Logo from "./components/Logo"
import { Select, Collapse } from "antd"
import { SearchOutlined } from '@ant-design/icons'
import { withRouter, useHistory } from "react-router-dom"
import { secToStr } from "./utils"
import data from "./data"
import "./AllVideos.css"


const { Panel } = Collapse;
function filterNotesByTags(notes, tags){
  return notes.filter(note => tags.some(tag => note.tags.includes(tag)))
}

class AllVideos extends React.Component {
  constructor(props){
    super(props)
    this.filterTags = [] // this is to keep track of as select changes

    let q = this.props.location.search || ""
    let params = new URLSearchParams(q)
    let tags = params.getAll("tags")
    if(tags.length > 0){
      this.filterTags= tags
    }

    this.state = {filterTags: this.filterTags} // this is to trigger render when
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

  // we only want to apply the values once the user is done selecting,
  // hence only once the dropdown is gone, we update state and the view.
  updateFilter = (e) => {
    const {history, location} = this.props
    if(!e){
      this.setState({filterTags:this.filterTags})
      let params = new URLSearchParams("")
      this.filterTags.forEach(tag => params.append("tags", tag))
      history.replace(`${location.pathname}?${params}`)
    }
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
        defaultValue={this.filterTags}
        options={options}
        onDropdownVisibleChange={this.updateFilter}
        onClear={() => {this.filterTags=[]; this.updateFilter(false)} }
        onChange={(tags) => {this.filterTags = tags}}
      >
      </Select>
      <SearchOutlined style={{fontSize: "22px"}}/>
    </nav>
  )}

  getSearchResults = (videos, tags) => {
    return (
    <>
      <div className="search-results">
        You are currently searching for &nbsp;
        {tags.map(s => <span className="s-tag" key={s}>{s}</span>)}
      </div>
      <Collapse
        ghost
        expandIconPosition="right"
        className="video-search-collapse"
      >
        { 
          videos.map(video => (
            <Panel key={video.id} header={video.title}>
              {filterNotesByTags(video.notes, tags).map(note =>
                  <Note key={note.id} data={note} vid={video.id}/>
              )}
            </Panel>
            )
          )
        }
      </Collapse>
    </>
    )
  }

  render(){
    let cid = this.props.match.params["courseId"]
    const {filterTags} = this.state
    const course = data[cid]
    const videos = course.videos
    return (
      <div className="videos-shell">
        {this.getNav()}
        <div className="video-container">
          <h2 className="course-title">{course.code}: {course.name}</h2>
          {filterTags.length? this.getSearchResults(videos, filterTags)
            : videos.map(video => <Video key={video.id} video={video}/>)}
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


/*
NOTE : CSS is a part of VideoNotes.css
*/
function Note(props) {
  let history = useHistory()
  const onTimestamp = (sec) => {
    // should do a history.push(/video/vid?t=sec)
    history.push(`/video/${props.vid}?t=${sec}`)
  }
  const {tags, timestamp, content=""} = props.data
  return (
    <div className="note-item">
        <div className="note-top">
          <div className="note-ts" onClick={()=>onTimestamp(timestamp)}>{secToStr(timestamp)}</div>
        </div>
        <div className="note-content">
          {content}
        </div>
        <div className="note-tags">
          {tags.map(tag => <div className="note-tag" key={tag}>#{tag}</div>)}
        </div>
    </div>
  )
}