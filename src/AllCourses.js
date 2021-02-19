import React from "react"
import Logo from "./components/Logo"
import { Dropdown, Menu } from "antd"
import { PlusOutlined, SettingFilled} from '@ant-design/icons'
import { withRouter, useHistory } from "react-router-dom";

import "./AllCourses.css"


// generate some mock data to develop the components + interaction
// for images just screen shot a few thumbnails, have them in /public or base64 embed
let data = {
  cid1 : {
    code: "CSE 110",
    name: "Software Engineering",
    vcount: 14,
    active: true
  },
  cid2 : {
    code: "CSE 141",
    name: "Introduction to Computer Architecture",
    vcount: 12,
    active: true
  },
  cid3 : {
    code: "CSE 121",
    name: "Systems Design",
    vcount: 15,
    active: true
  },
  cid4 : {
    code: "CSE 101",
    name: "Computational Thinking",
    vcount: 9,
    active: true
  },
  cid5 : {
    code: "CSE 100",
    name: "Basic CS stuff",
    vcount: 15,
    active: false
  },
  cid6 : {
    code: "CSE 111",
    name: "Web design and development",
    vcount: 9,
    active: false
  },
}

export default class AllCourses extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    let objs = Object.keys(data)
    return (
      <div className="courses-shell">
        <Nav />
        <div className="course-container">
          {objs.map(key => <Course key={key} {...data[key]}/>)}
        </div>
      </div>
    )
  }
}

function Nav(){
  const menu = (
    <Menu>
      <Menu.Item>
        Add new course
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
          2nd menu item
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
          3rd menu item
      </Menu.Item>
      <Menu.Item danger>a danger item</Menu.Item>
    </Menu>
  )
  let history = useHistory()
  const goToHome = (ev) => {
    history.push(`/`)
  }
  return (
    <nav className="all-courses-nav">
      <Logo style={{height: "36px", padding:"3px"}} onClick={goToHome}/>
      <p>COURSES</p>
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <PlusOutlined />
      </Dropdown>
    </nav>
    )
}

// the card ui for a single course
function Course(props){
  const {name, code, vcount} = props
  // const {onEdit, onArchive, onDelete} = props
  const onEdit = () => console.log("edit")
  const onArchive = () => console.log("archive")
  const onDelete = () => console.log("delete")

  let history = useHistory()
  const goToCourse = (ev) => {
    history.push(`/notes/${code}`)
  }

  const menu = courseCardMenu(onEdit, onArchive, onDelete)

  return(
    <div className="course-card" onClick={goToCourse}>
      <div className="course-card-header">
        <h2 className="course-code">{code}</h2>
        <Dropdown 
            overlay={menu}
            trigger={['click']}
            placement="bottomRight" 
            overlayClassName="course-card-edit"
        >
          <SettingFilled onClick={e => e.stopPropagation()} />
        </Dropdown>
      </div>
      <p  className="course-name">{name}</p>
      <p  className="course-vcount">{vcount} videos</p>
    </div>
  )
}

const courseCardMenu = (onEdit, onArchive, onDelete) => (
  <Menu onClick={(e) => e.domEvent.stopPropagation()}>
    <Menu.Item onClick={onEdit}>
      Edit Course
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item onClick={onArchive}>
      Archive Course
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item danger onClick={onDelete}>
       Delete Course
    </Menu.Item>
  </Menu>
)