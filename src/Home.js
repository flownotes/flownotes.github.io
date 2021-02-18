import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import { Input, Button } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

import "./Home.css"

const { Search } = Input;

export default function Home() {
  return (
    <div className="home-shell">
      <div className="home-content">
        <NameLogo />
        <VideoLink />
        <p className="or-seperator">OR</p>
        <NotesLink />
      </div>
    </div>
  )
}

function NameLogo(){
  return (
    <div className="logo-panel">
        <h1>FlowNotes</h1>
        <img src="/logo192.png" alt="FlowNotes Logo"/>
    </div>
  )
}

class _VideoLink extends React.Component {
  constructor(props){
    super(props)
    this.state = {error:false}
    this.inputRef = null
  }

  componentDidMount(){
    this.inputRef.focus({
      cursor: 'end',
    });
  }

  onSearch = val => {
    if (val === "") {
      return
    }
    let id = this.getVideoId(val)
    if(id === "") {
      this.setState({error: true})
    }
    else{
      this.props.history.push(`/video/${id}`)
    }
  }

  getVideoId(val){
    if(!val.startsWith("http")){
      val = "https://"+val
      console.log(val)
    }
    let url = ""
    try {
      url = new URL(val)
    } catch(e) {
      console.log(e)
      return ""
    }
  
    if ((url.host == "www.youtube.com" || url.host == "youtube.com") && 
        (url.pathname == "/watch")){
          return url.searchParams.get("v")
    }
    // should I also confirm url isn't a 404?
    return ""
  }

  render(){
    const errMsg = <p className="err-msg">Please ensure that the URL is formatted correctly!</p>
    return (
        <div className="video-link-form">
            <h2>Video Link</h2>
            <p>To start or continue taking notes on a video.</p>
            <Search
              placeholder="Enter video link"
              ref={input =>  this.inputRef = input }
              allowClear
              enterButton={<CaretRightOutlined />}
              onSearch={this.onSearch}
            />
            {this.state.error? errMsg : null}
        </div>
    )
  }
}

const VideoLink = withRouter(_VideoLink);


function NotesLink(){
  const icon = <CaretRightOutlined style={{display:"flex", fontSize:"22px"}}/>
  const btnStyle = {display:"flex", alignItems:"center"}
  let history = useHistory()

  const toNotesManager = ev => {
    history.push("/notes")
  }
  return (
    <div className="notes-link">
        <Button
          type="primary"
          size="large"
          shape="round"
          style={btnStyle}
          onClick={toNotesManager}
          >
            Notes Manager {icon}
        </Button>
        <p>To view your previous notes</p>
    </div>
  )
}