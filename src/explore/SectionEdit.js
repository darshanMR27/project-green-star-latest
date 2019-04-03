import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@kenshooui/react-multi-select/dist/style.css";
import axios from 'axios';
import {API_PROXY_URL} from "../Constants";

function validate(schoolId, clasId, sectionName) {
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
  if(sectionName === '' || sectionName === undefined){
    errors.push("Section Name cannot be empty");
  }

  return errors;
}
class SectionEdit extends Component {
  emptyItem = {
      school:"",
      section:"",
      grade:"",
      sectionName:"",
      gradeName:"",
      schoolName:"",
      errors:[]
  };

  state = {
    selectedSchool:null,
    selectedGrade:null,
    selectedSection:null,
    sectionName:"",
    gradeName:"",
    schoolName:"",
    errors:[]
  }

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      schools : [],
      grades : [],
      sections : [],
      selectedItems: [],
      sectionName:"",
      gradeName:"",
      schoolName:"",
      errors:[]
    };
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.sectionSubmit = this.sectionSubmit.bind(this);
  }

  async componentDidMount() {
    // alert('GroupID = '+this.props.match.params.id);
     if (this.props.match.params.id !== 'new') {
       const section = await (await fetch(API_PROXY_URL+`/api/v1/section/${this.props.match.params.id}`)).json();
       console.log(section);
       this.setState(
         {item: section,
           sectionName:section.label,
           schoolName: section.schoolName,
           gradeName: section.className,
           grade: section.classId
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
 
   handleSchoolChange = (selectedSchool) => {
     const selectedSchoolName = selectedSchool.name;
     const selectedSchoolId = selectedSchool.id;
     this.setState({selectedSchoolName, selectedSchoolId });
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
     const selectedGradeValue = selectedGrade.name;
     const selGradeId = selectedGrade.id;
     this.setState({selectedGradeValue, selGradeId });
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
 
  onChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value,
    });
  }

  async sectionSubmit(event) {
    event.preventDefault();
    const {sectionName, grade} = this.state;
    let selId = this.props.match.params.id;
    let classId = this.state.selGradeId;
    let schoolId = this.state.selectedSchoolId;
    this.setState({errors:[]});
    if (selId !== 'new') {
      const errors = validate(schoolId, classId, sectionName);
        if (errors.length > 0) {
          this.setState({ errors });
          return false;
        } else {
            return fetch({API_PROXY_URL}`/api/v1/section`, {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: selId,
                classId: grade,
                label: sectionName
              })
            }).then(response => {
              this.setState({showUpdateForm: true});
            }).catch(error => {
              this.setState({showErrorForm: true});
              console.error("error", error);
              this.setState({
                error:`${error}`
              });
            });
          }
    } else {
      const errors = validate(schoolId, classId, sectionName);
      if (errors.length > 0) {
        this.setState({ errors });
        return false;
      } else {
        return fetch({API_PROXY_URL}`/api/v1/section`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            classId: classId,
            label: sectionName
          })
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
    }
  }

  resetSection = async () => {
    if (this.props.match.params.id !== 'new') {
      this.setState({
        sectionName:'',
        errors:[],
        error:"",
        showAddForm:false,
        showErrorForm: false,
        showUpdateForm:false,
        //selectedSchool:null
      });
      this.setState({
        error:''
      });
    } else {
      this.setState({
        schoolName:'',
        gradeName:'',
        sectionName:'',
        errors:[],
        error:"",
        showAddForm:false,
        showErrorForm: false,
        showUpdateForm:false,
        //selectedSchool:null
      });
      this.setState({
        error:''
      });
    }
  }

  render() {
    const {error, selectedSchool, selectedGrade, schools, 
      grades, sectionName, schoolName, gradeName, errors} = this.state;
      const showAddSection = {
        'display': this.state.showAddForm ? 'block' : 'none'
      };
      const showErrorSection = {
        'display': this.state.showErrorForm ? 'block' : 'none'
      };
      const showUpdateSection = {
        'display': this.state.showUpdateForm ? 'block' : 'none'
      }; 
    //const title = <h2>{item.id ? 'Edit Section' : 'Add Section'}</h2>;
    if (this.props.match.params.id !== 'new') {
        return <div className="dashboard">
        <Container>
            <h2>Edit Section</h2>
            <Form onSubmit={this.sectionSubmit}>
                {errors.map(error =>(
                    <p key={error} className="errorText">{error}</p>
                ))}
                 <div style={showUpdateSection}>
                    <p style={{color: 'blue'}}>{sectionName} section Updated successfully</p>
                </div>
                <div style={showErrorSection}>
                    <p style={{color: 'red'}}>{error} while adding / updating section</p>
                </div>
            <div className="row">
            <FormGroup className="col-md-3 mb-3">
                <Label for="name" style={{color:'white'}}>School Name</Label>
                <Input type="text" ref="schoolName" name="schoolName" id="schoolName" value={schoolName}/>
            </FormGroup>
            <FormGroup className="col-md-3 mb-3">
                <Label for="grade" style={{color:'white'}}>Class or Grade</Label>
                <Input type="text" ref="gradeName" name="gradeName" id="gradeName" value={gradeName}/>
            </FormGroup>
            <FormGroup className="col-md-3 mb-3">
                <Label for="sectionName" style={{color:'white'}}>Section</Label>
                <Input type="text" ref="sectionName" name="sectionName" id="sectionName" placeholder="Enter Section Name" onChange={e => this.onChange(e)}  value={sectionName}/>
            </FormGroup>
                </div>
            <FormGroup>   
                <Button color="primary" type="submit">Save</Button>{' '}
                <Button color="secondary" onClick={() => this.resetSection()}>reset</Button>
            </FormGroup>
            </Form>
        </Container>
      </div>
    } else{
        return <div className="dashboard">
        <Container>
            <h2>Add Section</h2>
            <Form onSubmit={this.sectionSubmit}>
                {errors.map(error =>(
                    <p key={error} className="errorText">{error}</p>
                ))}
                <div style={showAddSection}>
                    <p style={{color: 'darkgreen'}}>{sectionName} section Added successfully</p>
                </div>
                <div style={showErrorSection}>
                    <p style={{color: 'red'}}>{error} while adding / updating section</p>
                </div>
            <div className="row">
              <FormGroup className="col-md-3 mb-3">
                <Label for="name" style={{color:'white'}}>School Name</Label>
                <Select options={ schools } name="school" id="school" onChange={this.handleSchoolChange} value={selectedSchool}
                        />
              </FormGroup>
              <FormGroup className="col-md-3 mb-3">
                <Label for="grade" style={{color:'white'}}>Class or Grade</Label>
                <Select options={ grades } name="grade" id="grade" onChange={this.handleClassChange} value={selectedGrade}
                        />
              </FormGroup>
              <FormGroup className="col-md-3 mb-3">
                <Label for="sectionName" style={{color:'white'}}>Section</Label>
                <Input type="text" ref="sectionName" name="sectionName" id="sectionName" placeholder="Enter Section Name" onChange={e => this.onChange(e)}  value={sectionName}/>
              </FormGroup>
                </div>
              <FormGroup>   
                <Button color="primary" type="submit">Save</Button>{' '}
                <Button color="secondary" onClick={() => this.resetSection()}>reset</Button>
              </FormGroup>
            </Form>
        </Container>
        </div>
    }
  }
}
export default SectionEdit;