import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@kenshooui/react-multi-select/dist/style.css";
import MultiSelect from "@kenshooui/react-multi-select";
import axios from 'axios';
import {API_PROXY_URL} from "../Constants";

function validate(schoolId, clasId, sectionId, groupName) {
  // we are going to store errors for all fields
  // in a signle array
  const errors = [];
  if(schoolId === '' || schoolId === undefined){
      errors.push("School Name cannot be empty");
  } 
  if(clasId === '' || clasId === undefined){
    errors.push("Class or Grade cannot be empty");
  } else {
    if (clasId > 10) {
        errors.push("Class or Grade should be 10 or less than 10");
    }
  }
  if(sectionId === '' || sectionId === undefined){
    errors.push("Section Name cannot be empty");
  } 
  if(groupName === '' || groupName === undefined){
    errors.push("Group Name cannot be empty");
  }

  return errors;
}
class GroupEdit extends Component {
  emptyItem = {
      school:"",
      section:"",
      grade:"",
      student:"",
      groupName:"",
      schoolName:"",
      sectionName:"",
      errors:[]
  };

  state = {
    selectedSchool:null,
    selectedGrade:null,
    selectedSection:null,
    groupName:"",
    schoolName:"",
    sectionName:"",
    errors:[]
  }

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      schools : [],
      grades : [],
      sections : [],
      students : [],
      selectedItems: [],
      selData:[],
      groupName:"",
      schoolName:"",
      sectionName:"",
      classId:"",
      sectionId:"",
      errors:[]
    };
    this.handleEditSchoolChange = this.handleEditSchoolChange.bind(this);
    this.handleEditClassChange = this.handleEditClassChange.bind(this);
    this.handleEditSectionChange = this.handleEditSectionChange.bind(this);
    this.handleEditMultiChange = this.handleEditMultiChange.bind(this);
    this.handleGroupSubmit = this.handleGroupSubmit.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
  }

  async componentDidMount() {
   // alert('GroupID = '+this.props.match.params.id);
   let selData = [];
    if (this.props.match.params.id !== 'new') {
      const group = await (await fetch(API_PROXY_URL+`/api/v1/group/${this.props.match.params.id}`)).json();
      console.log(group);
      group.studentNames.forEach( selectedOption => 
        //console.log( `Selected: ${selectedOption.label}` ) 
        selData.push(JSON.stringify({label:selectedOption}))
      );
      this.setState(
        {item: group,
          groupName:group.label,
          schoolName: group.schoolName,
          schoolId: group.schoolId,
          sectionName:group.sectionName,
          classId: group.classId,
          sectionId:group.sectionId,
          selectedItems:group.studentNames,
          selectedStudentIds: group.studentIds,

        });
    } else {
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
  }

  handleEditSchoolChange = (selectedSchool) => {
    const selectedSchoolName = selectedSchool.name;
    const selectedSchoolId = selectedSchool.id;
    this.setState({selectedSchoolName });
    this.setState({selectedSchoolId });
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
  handleEditClassChange = (selectedGrade) => {
    const selectedGradeValue = selectedGrade.name;
    const selectedClassId = selectedGrade.id;
    this.setState({selectedGradeValue });
    this.setState({selectedClassId });
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

  handleEditChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value,
    });
  }

  handleEditSectionChange = (selectedSection) => {
    const selectedSectionName = selectedSection.name;
    const selectedSectionId = selectedSection.id;
    this.setState({selectedSectionName});
    this.setState({selectedSectionId});
      return axios.get(API_PROXY_URL+`/api/v1/student/section/`+selectedSection.id)
      .then(result => {
        console.log(result.label);
        this.setState({
          students: result.data,
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
  handleEditMultiChange(selectedStudents) {
    this.setState({ selectedStudents });
    const selStudents =  [];
    selectedStudents.forEach( selectedOption => 
        //console.log( `Selected: ${selectedOption.label}` ) 
        selStudents.push(selectedOption.id)
    );
    this.setState({selStudents});
  }

  onChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value,
    });
  }

  async handleGroupSubmit(event) {
    event.preventDefault();
    const {groupName, classId, sectionId, schoolId } = this.state;
    let selId = this.props.match.params.id;
    this.setState({errors:[]});
    if (selId !== 'new') {
        const errors = validate(schoolId, classId, sectionId, groupName);
        if (errors.length > 0) {
          this.setState({ errors });
          return false;
        } else {
          return fetch(API_PROXY_URL+`/api/v1/group`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selId,
            size: this.state.selectedStudentIds.length,
            classId: classId,
            sectionId: sectionId,
            label: groupName,
            studentIds: this.state.selectedStudentIds
          })
        }).then(response => {
          this.setState({showUpdateForm: true});
          this.setState({showErrorForm: false});
        }).catch(error => {
          this.setState({showErrorForm: true});
          console.error("error", error);
          this.setState({
            error:`${error}`
          });
        });
      }
    } else {
      let gradeId = this.state.selectedClassId;
      let sectionId = this.state.selectedSectionId;
      let schoolId = this.state.selectedSchoolId;
      const errors = validate(schoolId, gradeId, sectionId, groupName);
      if (errors.length > 0) {
        this.setState({ errors });
        return false;
      } else {
        if(this.state.selStudents === undefined){
          this.setState({showErrorForm: true,
            error:'Choose student(s) for a group'
          });
          return false;
        } else {
          if(this.state.selStudents.length > 5){
            this.setState({showErrorForm: true,
              error:'Choose only 5 or less than 5 students for a group'
            });
            return false;
          } else {
              return fetch(API_PROXY_URL+`/api/v1/group`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  size: this.state.selStudents.length,
                  classId: gradeId,
                  sectionId: sectionId,
                  label: groupName,
                  studentIds: this.state.selStudents
                })
              }).then(response => {
                this.setState({showAddForm: true});
                this.setState({showErrorForm: false});
              }).catch(error => {
                this.setState({showErrorForm: true});
                console.error("error", error);
                this.setState({
                  error:`${error}`
                });
              });
            }
          }
        }
      }
  }

  resetGroup = async () => {
    if (this.props.match.params.id !== 'new') {
      this.setState({
        groupName:'',
        errors:[],
        error:"",
        showAddForm:false,
        showErrorForm: false,
        showUpdateForm:false
      });
      this.setState({
        error:''
      });
    } else {
      this.setState({
        groupName:'',
        //selectedSchool:'',
        //selectedGrade:'',
        //selectedSection:'',
        //students:[],
        //selectedItems:[],
        errors:[],
        error:"",
        showAddForm:false,
        showErrorForm: false,
        showUpdateForm:false
      });
      this.setState({
        error:''
      });
    } 
  }

  render() {
    const {item, groupName, sectionName, selectedSchool, selectedGrade, 
      selectedSection, selectedItems, schools, 
      grades, sections, students, schoolName, error, errors} = this.state;
//    const title = <h2>{this.props.match.params.id ? 'Edit Group' : 'Add Group'}</h2>;
      const showAddGroup = {
        'display': this.state.showAddForm ? 'block' : 'none'
      };
      const showErrorGroup = {
        'display': this.state.showErrorForm ? 'block' : 'none'
      };
      const showUpdateGroup = {
        'display': this.state.showUpdateForm ? 'block' : 'none'
      };
    if (this.props.match.params.id !== 'new') {
      return <div className="dashboard">
        <Container>
          <h2>Edit Group</h2>
          <Form onSubmit={this.handleGroupSubmit}>
              {errors.map(error =>(
                    <p key={error} className="errorText">{error}</p>
              ))}
              <div style={showUpdateGroup}>
                  <p style={{color: 'darkblue'}}>{groupName} Group Updated successfully</p>
              </div>
              <div style={showErrorGroup}>
                  <p style={{color: 'red'}}>{error} while adding / updating group</p>
              </div>
            <div className="row">
              <FormGroup className="col-md-3 mb-3">
                <Label for="name" style={{color:'white'}}>School Name</Label>
                <Input type="text" ref="schoolName" name="schoolName" id="schoolName" value={schoolName}/>
              </FormGroup>
              <FormGroup className="col-md-3 mb-3">
                <Label for="grade" style={{color:'white'}}>Class or Grade</Label>
                <Input type="text" ref="grade" name="grade" id="grade" value={item.classId}/>
              </FormGroup>
              <FormGroup className="col-md-3 mb-3">
                <Label for="sectionName" style={{color:'white'}}>Section</Label>
                <Input type="text" ref="sectionName" name="sectionName" id="sectionName"  value={sectionName}/>
              </FormGroup>
                <FormGroup className="col-md-3 mb-3">
                  <Label for="groupName" style={{color:'white'}}>Group Name</Label>
                  <Input type="text" ref="groupName" name="groupName" id="groupName" placeholder="Enter Group Name" onChange={e => this.handleEditChange(e)}  value={groupName}/>
                </FormGroup>
                </div>
              <div className="row">
                <FormGroup className="col-md-7 mb-3">
                  <Label for="student" style={{color:'white'}}>Student's</Label>
                  <MultiSelect items={students} selectedItems={selectedItems}/>
                </FormGroup>
              </div>
              <FormGroup>   
                <Button color="primary" type="submit">Update</Button>{' '}
                <Button color="success" tag={Link} to="/groups">Cancel</Button>
              </FormGroup>
            </Form>
            <div style={showUpdateGroup}>
                  <p style={{color: 'darkblue'}}>{groupName} Group Updated successfully</p>
            </div>
            <div style={showErrorGroup}>
                <p style={{color: 'red'}}>{error} while adding / updating group</p>
            </div>
          </Container>
        </div>
    } else {
      return <div className="dashboard">
        <Container>
        <h2>Add Group</h2>
          <Form onSubmit={this.handleGroupSubmit}>
              {errors.map(error =>(
                    <p key={error} className="errorText">{error}</p>
              ))}
              <div style={showAddGroup}>
                <p style={{color: 'darkgreen'}}>{groupName} Group Added successfully</p>
              </div>
              <div style={showErrorGroup}>
                  <p style={{color: 'red'}}>{error} while adding / updating group</p>
              </div>
            <div className="row">
              <FormGroup className="col-md-3 mb-3">
                <Label for="name" style={{color:'white'}}>School Name</Label>
                <Select options={ schools } name="school" id="school" onChange={this.handleEditSchoolChange} value={selectedSchool}/>
              </FormGroup>
              <FormGroup className="col-md-3 mb-3">
                <Label for="grade" style={{color:'white'}}>Class or Grade</Label>
                <Select options={ grades } name="grade" id="grade" onChange={this.handleEditClassChange} value={selectedGrade}
                        />
              </FormGroup>
              <FormGroup className="col-md-3 mb-3">
                <Label for="section" style={{color:'white'}}>Section</Label>
                <Select options={ sections } name="section" id="section" onChange={this.handleEditSectionChange} value={selectedSection}/>
              </FormGroup>
                <FormGroup className="col-md-3 mb-3">
                  <Label for="group" style={{color:'white'}}>Group Name</Label>
                  <Input type="text" ref="groupName" name="groupName" id="groupName" placeholder="Enter Group Name" onChange={e => this.onChange(e)}  value={groupName}/>
                </FormGroup>
                </div>
              <div className="row">
                <FormGroup className="col-md-7 mb-3">
                  <Label for="student" style={{color:'white'}}>Student's</Label>
                  <MultiSelect items={students} selectedItems={selectedItems} onChange={this.handleEditMultiChange}/>
                </FormGroup>
              </div>
              <FormGroup>   
                <Button color="primary" type="submit">Save</Button>{' '}
                <Button color="secondary" onClick={() => this.resetGroup()}>reset</Button>
              </FormGroup>
            </Form>
          </Container>
        </div>
      }
    }
  }
export default GroupEdit;