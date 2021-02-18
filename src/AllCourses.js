import React from "react"
import Logo from "./components/Logo"
import { Dropdown, Menu } from "antd"
import { MenuOutlined } from '@ant-design/icons'

import "./AllCourses.css"


// generate some mock data to develop the components + interaction
// for images just screen shot a few thumbnails, have them in /public or base64 embed
let data = {}

export default function AllCourses(){
  return (
    <div className="courses-shell">
      <Nav />

    </div>
  )
}

function Nav(){

  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a>
      </Menu.Item>
      <Menu.Item danger>a danger item</Menu.Item>
    </Menu>
  )

  return (
    <nav className="all-courses-nav">
      <Logo style={{height: "36px", padding:"3px"}}/>
      {/* V this is still not centered (bad css, but def looks centered) */}
      <p>COURSES</p>
      <Dropdown overlay={menu}>
        <MenuOutlined />
      </Dropdown>
    </nav>
    )
}