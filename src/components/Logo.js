import React from "react";


export default function Logo(props){
  const clicked = props.onClick
  let style = props.style || {}
  style = Object.assign({
                          height:"100px",
                          background:"#1f1f1f",
                          borderRadius:"20%",
                          padding: "7px"
                        }, style)
  return (
    <img className="logo"
         src="/logo192.png"
         alt="FlowNotes Logo"
         style={style}
         onClick={clicked}
    />
  )
}