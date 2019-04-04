// import React, { Component } from "react";
// import {
//   Route,
//   BrowserRouter as Router
// } from "react-router-dom";
// import { Navbar, Nav, NavDropdown } from "react-bootstrap";
// import Dashboard from "./Dashboard";
// import Report from "./Report";
// import headerLogo from './images/logo.jpg';
// import GroupList from "./explore/GroupList";
// import Login from "./Login";
// import About from "./About";
// import Contact from "./Contact";
// import GroupEdit from "./explore/GroupEdit";
// import SchoolList from "./explore/SchoolList";
// import SchoolEdit from "./explore/SchoolEdit";
// import ClassList from "./explore/ClassList";
// import ClassEdit from "./explore/ClassEdit";
// import SectionList from "./explore/SectionList";
// import SectionEdit from "./explore/SectionEdit";
// import StudentList from "./explore/StudentList";
// import StudentEdit from "./explore/StudentEdit";
// import HolidayList from "./explore/HolidayList";
// import HolidayEdit from "./explore/HolidayEdit";
// import RoleList from "./explore/RoleList";
// import RoleEdit from "./explore/RoleEdit";
// import PerformanceList from "./explore/PerformanceList";
// import "./cssstyles/Common.css";
// import "./cssstyles/index.css";
// class Home extends Component {
  
//   // componentDidMount(){
//   //   document.getElementById(localStorage.carousel).style.display="block";
//   // }
//   render (){
//     localStorage.setItem("carousel","carouselId");
//     return (
//       <Router>
//           <div>
//             <Navbar expand="lg" bg="dark" variant="dark">
//             <a href="/dashboard">  <Navbar.Brand href="#" style={{display: 'flex'}}><img src={headerLogo} alt="logo" /></Navbar.Brand></a>
//               <Navbar.Toggle aria-controls="basic-navbar-nav" />
//               <Navbar.Collapse id="basic-navbar-nav" >
//                 <Nav className="ml-auto">
//                   <Nav.Link  href="/login">Login</Nav.Link>
//                   <Nav.Link  href="#">Dashboard</Nav.Link>
//                   <Nav.Link  href="#">Report</Nav.Link>
//                   <NavDropdown  title="Explore" id="basic-nav-dropdown">
//                   </NavDropdown>
//                 </Nav>
//               </Navbar.Collapse>
//             </Navbar>
//             <div className="dashboard">
//               <Route exact path="/login" component={Login}/>
//             </div>
//             <div>
//             <Navbar expand="lg" bg="dark" variant="dark">
//               <Navbar.Toggle aria-controls="basic-navbar-nav" />
//               <Navbar.Collapse id="basic-navbar-nav" >
//                 <Nav className="ml-auto">
//                   <Nav.Link href="#">About</Nav.Link>
//                   <Nav.Link href="/contact">Contact</Nav.Link>
//                 </Nav>
//               </Navbar.Collapse>
//             </Navbar>
//             </div>
//           </div>
//       </Router>
//     );
//   }
// }
// export default Home;