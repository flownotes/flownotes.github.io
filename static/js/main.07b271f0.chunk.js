(this.webpackJsonpflownotes=this.webpackJsonpflownotes||[]).push([[0],{109:function(e,t,c){},111:function(e,t,c){},112:function(e,t,c){"use strict";c.r(t);var n=c(0),s=c.n(n),r=c(28),o=c.n(r),i=(c(98),c(42)),a=c(16),j=c(8),l=c(9),d=c(11),u=c(10),h=c(114),b=c(49),O=c(118),x=(c(99),c(2)),v=h.a.Search;function m(){return Object(x.jsx)("div",{className:"home-shell",children:Object(x.jsxs)("div",{className:"home-content",children:[Object(x.jsx)(p,{}),Object(x.jsx)(g,{}),Object(x.jsx)("p",{className:"or-seperator",children:"OR"}),Object(x.jsx)(k,{})]})})}function p(){return Object(x.jsxs)("div",{className:"logo-panel",children:[Object(x.jsx)("h1",{children:"FlowNotes"}),Object(x.jsx)("img",{src:"/logo192.png",alt:"FlowNotes Logo"})]})}var f=function(e){Object(d.a)(c,e);var t=Object(u.a)(c);function c(e){var n;return Object(j.a)(this,c),(n=t.call(this,e)).onSearch=function(e){if(""!==e){var t=n.getVideoId(e);""===t?n.setState({error:!0}):n.props.history.push("/video/".concat(t))}},n.state={error:!1},n.inputRef=null,n}return Object(l.a)(c,[{key:"componentDidMount",value:function(){this.inputRef.focus({cursor:"end"})}},{key:"getVideoId",value:function(e){e.startsWith("http")||(e="https://"+e,console.log(e));var t="";try{t=new URL(e)}catch(c){return console.log(c),""}return"www.youtube.com"!=t.host&&"youtube.com"!=t.host||"/watch"!=t.pathname?"":t.searchParams.get("v")}},{key:"render",value:function(){var e=this,t=Object(x.jsx)("p",{className:"err-msg",children:"Please ensure that the URL is formatted correctly!"});return Object(x.jsxs)("div",{className:"video-link-form",children:[Object(x.jsx)("h2",{children:"Video Link"}),Object(x.jsx)("p",{children:"To start or continue taking notes on a video."}),Object(x.jsx)(v,{placeholder:"Enter video link",ref:function(t){return e.inputRef=t},allowClear:!0,enterButton:Object(x.jsx)(O.a,{}),onSearch:this.onSearch}),this.state.error?t:null]})}}]),c}(s.a.Component),g=Object(a.i)(f);function k(){var e=Object(x.jsx)(O.a,{style:{display:"flex",fontSize:"22px"}}),t=Object(a.f)();return Object(x.jsxs)("div",{className:"notes-link",children:[Object(x.jsxs)(b.a,{type:"primary",size:"large",shape:"round",style:{display:"flex",alignItems:"center"},onClick:function(e){t.push("/notes")},children:["Notes Manager ",e]}),Object(x.jsx)("p",{children:"To view your previous notes"})]})}var C=c(1);function y(e){var t=e.onClick,c=e.style||{};return c=Object.assign({height:"100px",background:"#1f1f1f",borderRadius:"20%",padding:"7px"},c),Object(x.jsx)("img",{className:"logo",src:"/logo192.png",alt:"FlowNotes Logo",style:c,onClick:t})}var N=c(115),I=c(117),S=c(119),w=c(120),E=(c(109),{cid1:{code:"CSE 110",name:"Software Engineering",vcount:14,active:!0},cid2:{code:"CSE 141",name:"Introduction to Computer Architecture",vcount:12,active:!0},cid3:{code:"CSE 121",name:"Systems Design",vcount:15,active:!0},cid4:{code:"CSE 101",name:"Computational Thinking",vcount:9,active:!0},cid5:{code:"CSE 100",name:"Basic CS stuff",vcount:15,active:!1},cid6:{code:"CSE 111",name:"Web design and development",vcount:9,active:!1}}),R=function(e){Object(d.a)(c,e);var t=Object(u.a)(c);function c(e){return Object(j.a)(this,c),t.call(this,e)}return Object(l.a)(c,[{key:"render",value:function(){var e=Object.keys(E);return Object(x.jsxs)("div",{className:"courses-shell",children:[Object(x.jsx)(D,{}),Object(x.jsx)("div",{className:"course-container",children:e.map((function(e){return Object(x.jsx)(L,Object(C.a)({},E[e]),e)}))})]})}}]),c}(s.a.Component);function D(){var e=Object(x.jsxs)(N.a,{children:[Object(x.jsx)(N.a.Item,{children:"Add new course"}),Object(x.jsx)(N.a.Divider,{}),Object(x.jsx)(N.a.Item,{children:"2nd menu item"}),Object(x.jsx)(N.a.Divider,{}),Object(x.jsx)(N.a.Item,{children:"3rd menu item"}),Object(x.jsx)(N.a.Item,{danger:!0,children:"a danger item"})]}),t=Object(a.f)();return Object(x.jsxs)("nav",{className:"all-courses-nav",children:[Object(x.jsx)(y,{style:{height:"36px",padding:"3px"},onClick:function(e){t.push("/")}}),Object(x.jsx)("p",{children:"COURSES"}),Object(x.jsx)(I.a,{overlay:e,trigger:["click"],placement:"bottomRight",children:Object(x.jsx)(S.a,{})})]})}function L(e){var t=e.name,c=e.code,n=e.vcount,s=Object(a.f)(),r=V((function(){return console.log("edit")}),(function(){return console.log("archive")}),(function(){return console.log("delete")}));return Object(x.jsxs)("div",{className:"course-card",onClick:function(e){s.push("/notes/".concat(c))},children:[Object(x.jsxs)("div",{className:"course-card-header",children:[Object(x.jsx)("h2",{className:"course-code",children:c}),Object(x.jsx)(I.a,{overlay:r,trigger:["click"],placement:"bottomRight",overlayClassName:"course-card-edit",children:Object(x.jsx)(w.a,{onClick:function(e){return e.stopPropagation()}})})]}),Object(x.jsx)("p",{className:"course-name",children:t}),Object(x.jsxs)("p",{className:"course-vcount",children:[n," videos"]})]})}var V=function(e,t,c){return Object(x.jsxs)(N.a,{onClick:function(e){return e.domEvent.stopPropagation()},children:[Object(x.jsx)(N.a.Item,{onClick:e,children:"Edit Course"}),Object(x.jsx)(N.a.Divider,{}),Object(x.jsx)(N.a.Item,{onClick:t,children:"Archive Course"}),Object(x.jsx)(N.a.Divider,{}),Object(x.jsx)(N.a.Item,{danger:!0,onClick:c,children:"Delete Course"})]})};c(111);function F(){return Object(x.jsx)(i.a,{children:Object(x.jsx)("div",{className:"app-shell",children:Object(x.jsxs)(a.c,{children:[Object(x.jsx)(a.a,{exact:!0,path:"/",children:Object(x.jsx)(m,{})}),Object(x.jsx)(a.a,{exact:!0,path:"/notes",children:Object(x.jsx)(R,{})}),Object(x.jsx)(a.a,{exact:!0,path:"/notes/:courseId",children:Object(x.jsx)(B,{})}),Object(x.jsx)(a.a,{path:"/notes/:courseId/:videoId",children:Object(x.jsx)(M,{})}),Object(x.jsx)(a.a,{path:"/video/:videoId",children:Object(x.jsx)(T,{})}),Object(x.jsx)(a.a,{path:"/about",children:Object(x.jsx)(A,{})}),Object(x.jsx)(a.a,{path:"*",children:Object(x.jsx)(P,{})})]})})})}function A(){return Object(x.jsx)("h2",{children:"About"})}function P(){return Object(x.jsx)("h2",{children:"404"})}function B(){var e=Object(a.h)().url,t=Object(a.g)().courseId;return Object(x.jsxs)(x.Fragment,{children:[Object(x.jsxs)("div",{children:["List of videos for course : ",t]}),Object(x.jsxs)("ul",{children:[Object(x.jsx)("li",{children:Object(x.jsx)(i.b,{to:"".concat(e,"/v1"),children:"Video 1"})}),Object(x.jsx)("li",{children:Object(x.jsx)(i.b,{to:"".concat(e,"/v2"),children:"Video 2"})}),Object(x.jsx)("li",{children:Object(x.jsx)(i.b,{to:"".concat(e,"/v3"),children:"Video 3"})})]})]})}function M(){var e=Object(a.g)(),t=e.courseId,c=e.videoId;return Object(x.jsxs)(x.Fragment,{children:[Object(x.jsxs)("div",{children:['List of notes for the video "',c,'" of course "',t,'"']}),Object(x.jsxs)("ul",{children:[Object(x.jsx)("li",{children:"Note #1"}),Object(x.jsx)("li",{children:"Note #2"}),Object(x.jsx)("li",{children:"Note #3"})]})]})}function T(){return Object(x.jsx)("div",{children:"You can take down notes here"})}o.a.render(Object(x.jsx)(s.a.StrictMode,{children:Object(x.jsx)(F,{})}),document.getElementById("root"))},99:function(e,t,c){}},[[112,1,2]]]);
//# sourceMappingURL=main.07b271f0.chunk.js.map