import React from "react"
import Logo from "./components/Logo"
import { Select, Collapse, Menu, Dropdown, Modal, Input } from "antd"
import { SearchOutlined, SettingFilled, PlusOutlined, CaretRightOutlined } from '@ant-design/icons'
import { withRouter, useHistory } from "react-router-dom"
import { secToStr, urlToVid } from "./utils"
import data from "./data"
import "./AllVideos.css"

const { Search } = Input
const { Panel } = Collapse
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
    //we don't apply filter when filter dropdown is open
    this.filterOpen = false

    this.state = {
      filterTags: this.filterTags,
      addingLecture: false, //modal that opens while adding lecture
      lectureValid: true,
    }
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
  // hence cache in this.filterTags, and update state when necessary.
  updateFilter = () => {
    const {history, location} = this.props
    this.setState({filterTags:this.filterTags})
    let params = new URLSearchParams("")
    this.filterTags.forEach(tag => params.append("tags", tag))
    history.replace(`${location.pathname}?${params}`)
  }

  onVideoDeleted = (vid) => {
    const cid = this.getCid()
    data[cid].videos = data[cid].videos.filter(video => video.id != vid)
    localStorage.setItem("data", JSON.stringify(data))
    this.forceUpdate()
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
        onDropdownVisibleChange={(open) => {
          this.filterOpen = open
          if(!open) //dropdown just closed
            this.updateFilter()
        }}
        onChange={tags => {
          this.filterTags = tags
          if(!this.filterOpen) //change without open dropdown
            this.updateFilter() //update immediately
        }}
      >
      </Select>
      <SearchOutlined style={{fontSize: "22px"}}/>
    </nav>
  )}

  getAddModal = () => {
    const errMsg = <p className="err-msg">Please ensure that the URL is formatted correctly!</p>
    return (
      <Modal
        className="add-lecture-modal"
        title="Add a new lecture"
        onCancel={() => this.setState({addingLecture:false})}
        visible={this.state.addingLecture}
        destroyOnClose
        footer={null}
      >
        <h3 style={{textAlign:"center", marginBottom:"15px"}}> Video Link </h3>
        <Search
          placeholder="Enter video link"
          allowClear
          enterButton={<CaretRightOutlined />}
          onSearch={this.addLecture}
        />
        {this.state.lectureValid? null: errMsg}
      </Modal>
    )
  }

  addLecture = (val) => {
    if (val === "") {
      return
    }
    let id = urlToVid(val)
    if(id === "") {
      this.setState({lectureValid: false})
    }
    else{
      this.props.history.push(`/video/${id}`, {class:this.getCid()})
    }
  }

  getSearchResults = (videos, tags) => {
    // filter the videos so that at a video has at least one matching note
    videos = videos.map(video => ({...video, notes:filterNotesByTags(video.notes, tags)}))
                   .filter(video => video.notes.length > 0)
    let vids = videos.map(video => video.id)

    return (
    <>
      <div className="search-results">
        You are currently searching for &nbsp;
        {tags.map(s => <span className="s-tag" key={s}>{s}</span>)}
      </div>
      <Collapse
        ghost
        defaultActiveKey={vids}
        expandIconPosition="right"
        className="video-search-collapse"
      >
        {
          videos.map(video => (
            <Panel key={video.id} header={video.title}>
              { video.notes.map(note => 
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
          <div className="course-title-container">
            <h2 className="course-title">{course.code}: {course.name}</h2>
            <PlusOutlined onClick={() => this.setState({addingLecture:true})}/>
          </div>
          {filterTags.length? this.getSearchResults(videos, filterTags)
            : videos.map(video => <Video 
                                      key={video.id}
                                      video={video}
                                      onDeleted={() => this.onVideoDeleted(video.id)}
                                  />)}
        </div>
        {this.getAddModal()}
      </div>
    )
  }
}

export default withRouter(AllVideos)


// the card ui for a single video lecture
function Video(props){
  let video = props.video
  const {id, title, length, image, notes} = video
  const ncount = notes.length

  let history = useHistory()
  const goToCourse = () => {
    history.push(`/video/${id}`)
  }

  const onDeleteing = () => {
    let content = `You have ${notes.length} notes and will lose all of them.
    This action is irreversible!`
    Modal.confirm({
      title:"Are you sure you want to delete this lecture?",
      content: content,
      okText:"Delete",
      cancelText:"No, keep",
      okType:"danger",
      onOk:props.onDeleted
    })
  }

  const getEditMenu = () => (
    <Menu onClick={(e) => e.domEvent.stopPropagation()}>
      <Menu.Item danger onClick={onDeleteing}>
        Delete Lecture
      </Menu.Item>
    </Menu>
  )

  let h = Math.floor(length / 60)
  let m = length % 60
  const time = h > 0? `${h} hours ${m} min` : `${m} min`

  return(
    <div className="video-card" onClick={goToCourse}>
      <div className="video-card-header">
        <h2 className="video-title">{title}</h2>
        <Dropdown 
          overlay={getEditMenu()}
          trigger={['click']}
          placement="bottomRight" 
          overlayClassName="video-card-edit"
        >
          <SettingFilled onClick={e => e.stopPropagation()} />
        </Dropdown>
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