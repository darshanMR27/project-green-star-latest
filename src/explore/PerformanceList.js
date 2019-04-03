import React, { Component } from 'react';
import { Button, Input, Container, Table, Form, FormGroup, Label} from 'reactstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@kenshooui/react-multi-select/dist/style.css";
import axios from 'axios';
import DatePicker from "react-datepicker";
import {API_PROXY_URL} from "../Constants";
class PerformanceList extends Component {
  emptyItem = {
    school:"",
    section:"",
    grade:"",
    student:"",
    groupName:""
  };

  state = {
    loading:true,
    error:"",
    data: [],
    selectedSchool:"", 
    selectedGrade:"", 
    selectedSection:"", 
    schools:[],
    grades:[],
    sections:[],
    groups:[],
    students:[],
    selectDate: new Date(),
    selected: {}
  }
  constructor(props) {
    super(props);
    this.state= {
      students:[]
    };
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.handleSectionChange = this.handleSectionChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.performSubmit = this.performSubmit.bind(this);
}

componentDidMount(){
    this.setState({showForm: false});
    return axios.get(API_PROXY_URL+`/api/v1/school/`)
    .then(result => {
      console.log(result);
      this.setState({
        schools: result.data, error:false});
      }).catch(error => {
      console.error("error", error);
      this.setState({
        error:`${error}`
      });
    });
  }

  handleSchoolChange = (selectedSchool) => {
    this.setState({ selectedSchool });
    const bodyFormData = new FormData();
     return axios.get(API_PROXY_URL+`/api/v1/class/school/`+selectedSchool.id)
    .then(result => {
      console.log(result);
      this.setState({
        grades: result.data, error:false});
      }).catch(error => {
      console.error("error", error);
      this.setState({
        error:`${error}`
      });
    });
  }
  
  handleClassChange = (selectedGrade) => {
    this.setState({ selectedGrade });
    return axios.get(API_PROXY_URL+`/api/v1/section/class/`+selectedGrade.id)
    .then(result => {
      console.log(result);
      this.setState({
        sections: result.data, error:false});
      }).catch(error => {
      console.error("error", error);
      this.setState({
        error:`${error}`
      });
    });
  }

  handleSectionChange = (selectedSec) => {
    this.setState({ selectedSec });
     return axios.get(API_PROXY_URL+`/api/v1/group/section/`+selectedSec.id)
    .then(result => {
      console.log(result);
      this.setState({
        groups: result.data,
        loading:false,
        error:false
      });
    }).catch(error => {
      console.error("error", error);
      this.setState({
        error:`${error}`,
        loading:false
      });
    });
  }

  handleGroupChange = (selectedGroup) => {
    this.setState({ selectedGroup });
    return axios.get(API_PROXY_URL+`/api/v1/student/group/`+selectedGroup.id)
    .then(result => {
      console.log(result);
      this.setState({
        students: result.data,
        loading:false,
        error:false
      });
      this.setState({showForm: true});
    }).catch(error => {
      console.error("error", error);
      this.setState({
        error:`${error}`,
        loading:false
      });
    });
  }

  viewGroups = async () => {
    this.setState({showForm: true});
  }
  
  hideHeader = async () => {
    this.setState({showForm: false});
    this.setState({groupName:""});
  }

  handleSelectDateChange = selectDate => this.setState({ selectDate })

  onChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value,
    });
  }


  performSubmit = async () => {
    const{selectDate, students} = this.state;
    var length = students.length;
    let performanceData = new Array(length);
    let Data = {}
    let formattedJoinDate = new Intl.DateTimeFormat("fr-ca", {year: 'numeric', month: '2-digit',day: '2-digit'}).format(selectDate);
     
    for (var i = 0;i<students.length;i++){
      Data = {};
      Data.studentId = students[i].id;
      Data.label = students[i].label;
      performanceData[i] = Data;
      performanceData[i].attendance = document.getElementById("performace").children[1].children[i].children[1].children[0].checked;
      performanceData[i].discipline = document.getElementById("performace").children[1].children[i].children[2].children[0].checked;
      performanceData[i].homeWork = document.getElementById("performace").children[1].children[i].children[3].children[0].checked;
      performanceData[i].date = formattedJoinDate;
    }
     
    return fetch(API_PROXY_URL+`/api/v1/performance`, {
       method: 'POST',
       headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       },
       body: JSON.stringify(performanceData)
      }).then(response => {
        this.setState({showAddForm: true});
      }).catch(error => {
        this.setState({showErrorForm: true});
        console.error("error", error);
        this.setState({
          error:`${error}`
        });
      });
  }

  // async remove(id) {
  //   await fetch(`/api/group/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     }
  //   }).then(() => {
  //     let updatedGroups = [...this.state.groups].filter(i => i.id !== id);
  //     this.setState({groups: updatedGroups});
  //   });
  // }

  render() {
    const {error, students, selectedSchool, selectedGrade, 
      selectedSection, selectedGroup, schools,grades,sections, groups } = this.state;
    if(error){
      return (
          <p>
            There was an error loading the response.. {'  '}
            <Button color="primary" onClick={() => this.viewGroups()}  tag={Link} to="/groups">Try Again</Button>
          </p>
      );
    }
    const showHide = {
      'display': this.state.showForm ? 'block' : 'none'
    };

    return ( 
      <div>
        <div>
            <h2>Add Student Performance</h2>
            <Container>
            <Form className="row">
                <FormGroup className="col-md-3 mb-3 monthPickerClass">
                    <Label for="joiningDate" style={{color:'white'}}>Select A Date</Label>
                    <DatePicker selected={this.state.selectDate} className="datePicker" placeholderText="Select Date" onChange={this.handleSelectDateChange} dateFormat="dd/MM/yyyy"/>
                </FormGroup>
                <FormGroup className="col-md-3 mb-3">
                    <Label for="name" style={{color:'white'}}>School Name</Label>
                    <Select options={ schools } name="school" id="school" onChange={this.handleSchoolChange} value={selectedSchool}/>
                </FormGroup>
                <FormGroup className="col-md-3 mb-3">
                    <Label for="grade" style={{color:'white'}}>Class or Grade</Label>
                    <Select options={ grades } name="grade" id="grade" onChange={this.handleClassChange} value={selectedGrade}/>
                </FormGroup>
                <FormGroup className="col-md-3 mb-3">
                    <Label for="section" style={{color:'white'}}>Section</Label>
                    <Select options={ sections } name="section" id="section" onChange={this.handleSectionChange} value={selectedSection}/>
                </FormGroup>
                <FormGroup className="col-md-3 mb-3">
                    <Label for="section" style={{color:'white'}}>Group</Label>
                    <Select options={ groups } name="group" id="group" onChange={this.handleGroupChange} value={selectedGroup}/>
                </FormGroup>
            </Form>
            </Container>
            <div style={showHide}>                      
              <Table id= "performace" className="mt-4 tableStyle">
                <thead>
                  <tr>
                    <th className="thStyle" width="10%">Student Name</th>
                    <th className="thStyle" width="10%">Attendance</th>
                    <th className="thStyle" width="10%">Discipline</th>
                    <th className="thStyle" width="10%">Home Work</th>
                  </tr>
                </thead>
                <tbody style={{color: '#dee2e6'}}>
                {students.map(student => (
                  <tr key={student.id}>
                    <td className="thStyle" style={{whiteSpace: 'nowrap'}}>{student.label}</td>
                    <td className="thStyle"><Input type="checkbox"  /></td>
                    <td className="thStyle"><Input type="checkbox"  /></td>
                    <td className="thStyle"><Input type="checkbox"  /></td>
                  </tr> ))}
                </tbody>
              </Table>
              <Button color="success" onClick={() => this.performSubmit()}>Save</Button>
            </div>
          </div>
      </div>
    );
  }
}
export default PerformanceList;