import React from "react";
import {
  BrowserRouter as Router,
  useRouteMatch,
  useParams,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from "./Home"
import AllCourses from "./AllCourses"
import AllVideos from "./AllVideos"
import VideoNotes from "./VideoNotes"
import "./App.css"

export default function App() {
  return (
    <Router>
      <div className="app-shell">

        <Switch>
          {/* Shows the homescreen - user moves to notes or video */}
          <Route exact path="/">
            <Home />
          </Route>

          {/* Shows the list of courses the user has taken notes for */}
          <Route exact path="/notes">
            <AllCourses />
          </Route>

          {/* Shows the list of videos in the course 'courseId' */}
          <Route exact path="/notes/:courseId">
            <AllVideos />
          </Route>

          {/* Shows the notes of the specific video selected */}
          <Route path="/notes/:courseId/:videoId">
            <CourseNotes />
          </Route>

          {/* Shows the note taking view for the video */}
          <Route path="/video/:videoId">
            <VideoNotes />
          </Route>

          {/* We can have a user manual sort of thing here? */}
          <Route path="/about">
            <About />
          </Route>

          {/* 404 not found */}
          <Route path="*">
            <NoMatch />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

// function Home() {
//   return (
//     <>
//     <div>Welcome to the app</div>
//     <ul>
//       <li><Link to="/notes">View your notes</Link></li>
//       <li><Link to="/video/newId">Take new notes</Link></li>
//     </ul>
//     </>
//   )
// }

function About() {
  return <h2>About</h2>
}

function NoMatch() {
  return <h2>404</h2>
}

// URL = '/notes'
// function AllCourses() {
//   let { url } = useRouteMatch()
//   return (
//     <>
//     <div>List of courses</div>
//     <ul>
//       <li><Link to={`${url}/c1`}>Course 1</Link></li>
//       <li><Link to={`${url}/c2`}>Course 2</Link></li>
//       <li><Link to={`${url}/c3`}>Course 3</Link></li>
//     </ul>
//     </>
//   )
// }

// URL = '/notes/courseId'
// function AllVideos(){
//   let { url } = useRouteMatch()
//   let { courseId } = useParams()
//   return (
//     <>
//     <div>List of videos for course : {courseId}</div>
//     <ul>
//       <li><Link to={`${url}/v1`}>Video 1</Link></li>
//       <li><Link to={`${url}/v2`}>Video 2</Link></li>
//       <li><Link to={`${url}/v3`}>Video 3</Link></li>
//     </ul>
//     </>
//   )
// }

// URL = '/notes/:courseId/:videoId'
function CourseNotes() {
  let { courseId, videoId } = useParams()
  return (
    <>
    <div>List of notes for the video "{videoId}" of course "{courseId}"</div>
    <ul>
      <li>Note #1</li>
      <li>Note #2</li>
      <li>Note #3</li>
    </ul>
    </>
  )
}

// URL = '/video/:videoId'
// function VideoNotes(){
//   return <div>You can take down notes here</div>
// }