import React from "react"
import Logo from "./components/Logo"
import { Dropdown, Menu, Modal, Input, Collapse } from "antd"
import { PlusOutlined, SettingFilled, WarningFilled, CaretRightFilled} from '@ant-design/icons'
import { useHistory } from "react-router-dom";

import "./AllCourses.css"
const { Panel } = Collapse;


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
    this.state = {
      addModal: false,
      editModal: false,
      archiveModal: false,
      deleteModal: false,
    }
    this.codeInputRef = null
    this.nameInputRef = null
    this.currentCourse = null
  }

  //get's the current course
  currentCourseDetails = () => {
    let code = "", name = ""
    if (this.currentCourse !== null){
      code = data[this.currentCourse].code || ""
      name = data[this.currentCourse].name || ""
    }
    return {code, name}
  }

  // toggles the modals
  toggleAdd = () => this.setState({addModal:!this.state.addModal})
  toggleEdit = (key=null) => {
    // if we're toggling false -> true, i.e. modal is opening
    // set currentCourse to key, if it's closing, set to null
    this.currentCourse = this.state.editModal? null : key
    this.setState({editModal:!this.state.editModal})
  }
  toggleArchive = (key=null) => {
    this.currentCourse = this.state.archiveModal? null : key
    this.setState({archiveModal:!this.state.archiveModal})
  }
  toggleDelete = (key=null) => {
    this.currentCourse = this.state.deleteModal? null : key
    this.setState({deleteModal:!this.state.deleteModal})
  }

  // the modal contents for each of the four modals
  addModalBody = () => (
    <div>
      <p className="label">Course Code</p>
      <Input  placeholder="Eg. 'CSE 170'"
              ref={input => this.codeInputRef = input}/>
      <p className="label">Course Title</p>
      <Input  placeholder="Eg. 'Interaction Design'"
              ref={input => this.nameInputRef = input}/>
    </div>
  )
  editModalBody = () => {
    let {code = "", name = ""} = this.currentCourseDetails()
    return (
      <div>
        <p className="label">Course Code</p>
        <Input  placeholder="Eg. 'CSE 170'"
                defaultValue={code}
                ref={input => this.codeInputRef = input}/>
        <p className="label">Course Title</p>
        <Input  placeholder="Eg. 'Interaction Design'"
                defaultValue={name}
                ref={input => this.nameInputRef = input}/>
      </div>
    )
  }
  archiveModalBody = () => {
    let {code = "", name = ""} = this.currentCourseDetails()
    return (
      <div className="archive-message">
        <p>Are you sure you want to archive</p>
        <h2>{code}</h2>
        <h3>{name}</h3>
      </div>
    )
  }
  deleteModalBody = () => {
    let {code = "", name = ""} = this.currentCourseDetails()
    return (
      <div className="error-message">
        <p>Are you sure you want to delete</p>
        <h2>{code}</h2>
        <h3>{name}</h3>
        <span><b>Danger!</b> Once you've deleted the course you
          cannot get it back, it is permanent.</span>
      </div>
    )
  }

  // All the actions - add new, edit, archive and delete
  addCourse = () => {
    let code = this.codeInputRef.state.value
    let name = this.nameInputRef.state.value

    let cid = "cid" + Date.now().toString()
    data[cid] = {code, name, vcount:0, active:true}
    this.toggleAdd()
  }
  editCourse = () => {
    let code = this.codeInputRef.state.value
    let name = this.nameInputRef.state.value

    let cid = this.currentCourse
    data[cid] = Object.assign(data[cid], {code, name})
    this.toggleEdit()
  }
  archiveCourse = () => {
    data[this.currentCourse].active = false
    this.toggleArchive()
  }
  deleteCourse = () => {
    delete data[this.currentCourse]
    this.toggleDelete()
  }

  render(){
    let objs = Object.keys(data)
    let {addModal, editModal, archiveModal, deleteModal} = this.state
    return (
      <div className="courses-shell">
        <Nav onAddCourse={this.toggleAdd}/>
        <div className="course-container">
        <Collapse defaultActiveKey={['1']} 
                  ghost 
                  expandIconPosition="right" 
                  className="course-collapse more-specificity">
          <Panel header="Active" key="1">
            { objs.filter(key => data[key].active)
                  .map(key => <Course key={key} {...data[key]}
                              onEdit={() => this.toggleEdit(key) }
                              onArchive={() => this.toggleArchive(key)}
                              onDelete={() => this.toggleDelete(key)} />
                      )
            }
          </Panel>
          <Panel header="Archived" key="2">
            { objs.filter(key => !data[key].active)
                  .map(key => <Course key={key} {...data[key]}
                              onEdit={() => this.toggleEdit(key) }
                              onArchive={() => this.toggleArchive(key)}
                              onDelete={() => this.toggleDelete(key)} />
                      )
            }
          </Panel>
        </Collapse>
        </div>
        <Modal  title="Create course"
                visible={addModal}
                okText="Create"
                onOk={this.addCourse}
                onCancel={this.toggleAdd}
                destroyOnClose
                className="course-config-modal"
              >
          {this.addModalBody()}
        </Modal>
        <Modal  title="Edit course"
                visible={editModal}
                okText="Update"
                cancelText="Discard changes"
                onOk={this.editCourse}
                onCancel={this.toggleEdit}
                destroyOnClose
                className="course-config-modal"
              >
          {this.editModalBody()}
        </Modal>
        <Modal  title={<span className="title"><WarningFilled className="arch-icon"/> Archive course</span>}
                visible={archiveModal}
                okText="Archive"
                okType="danger"
                onOk={this.archiveCourse}
                onCancel={this.toggleArchive}
                destroyOnClose
                className="course-config-modal"
              >
          {this.archiveModalBody()}
        </Modal>
        <Modal  title={<span className="title"><WarningFilled className="delt-icon"/> Delete course</span>}
                visible={deleteModal}
                okText="Delete the course"
                cancelText="No, go back"
                onOk={this.deleteCourse}
                okType="danger"
                onCancel={this.toggleDelete}
                cancelButtonProps={{type:"primary"}}
                destroyOnClose
                className="course-config-modal"
              >
          {this.deleteModalBody()}
        </Modal>
      </div>
    )
  }
}

function Nav({onAddCourse}){
  let history = useHistory()
  const goToHome = () => {
    history.push(`/`)
  }
  return (
    <nav className="all-courses-nav">
      <Logo style={{height: "36px", width:"36px", padding:"3px"}} onClick={goToHome}/>
      <p>COURSES</p>
      <PlusOutlined onClick={onAddCourse}/>
    </nav>
    )
}

// the card ui for a single course
function Course(props){
  const {name, code, vcount} = props
  const {onEdit, onArchive, onDelete} = props

  let history = useHistory()
  const goToCourse = () => {
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