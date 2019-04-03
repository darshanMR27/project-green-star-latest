import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@kenshooui/react-multi-select/dist/style.css";
import "@kenshooui/react-multi-select/dist/style.css";
import MultiSelect from "@kenshooui/react-multi-select";
import axios from 'axios';
import CryptoJS from 'crypto-js';
import {API_PROXY_URL} from "../Constants";

function validate(roleName, password) {
  // we are going to store errors for all fields
  // in a signle array
  const errors = [];
  if(roleName === '' || roleName === "undefined"){
      errors.push("Role Name cannot be empty");
  } else {
      if (roleName.length < 5) {
          errors.push("Role Name should be at least 10 charcters long");
      }
  }
  if(password === '' || password === "undefined"){
    errors.push("Password cannot be empty");
  } else {
    if (password.length < 6) {
        errors.push("Password must be atleast 6 characters");
    }
  }
  return errors;
}
class RoleEdit extends Component {
  emptyItem = {
      roleName: "",
      rolePassword:"",
      errors:[]
  };

  state = {
    roleName: "",
    rolePassword:"",
    privilages : [],
    errors:[]
  }

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      privilages : [],
      selectedItems: [],
      errors:[]
    };
    this.onChange = this.onChange.bind(this);
    this.roleSubmit = this.roleSubmit.bind(this);
    this.handlePrivilageschange = this.handlePrivilageschange.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const role = await (await fetch(API_PROXY_URL+`/api/v1/roles/${this.props.match.params.id}`)).json();
      console.log(role);
      this.setState(
        {item: role,
          roleName:role.label,
          rolePassword:role.password,
          selectedItems:role.privilages
        });
    } else {
      this.setState({showForm: true});
      return axios.get(API_PROXY_URL+`/api/v1/roles/privilages`)
      .then(result => {
        console.log(result);
        this.setState({
          privilages: result.data, 
          error:false});
        }).catch(error => {
        console.error("error", error);
        this.setState({
          error:`${error}`
        });
      });
    }
  }

  onChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value,
    });
  }

  handlePrivilageschange(selectedItems) {
    this.setState({ selectedItems });
  }

  async roleSubmit(event) {
    event.preventDefault();
    const {roleName, rolePassword} = this.state;
    const selId = this.props.match.params.id;
    const errors = validate(roleName, rolePassword);
    if (errors.length > 0) {
      this.setState({ errors });
      return false;
    } else {
      if (selId !== 'new') {  
        return fetch(API_PROXY_URL+`/api/v1/roles/update`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //id: selId,
          label: roleName,
          privilages: this.state.selectedItems
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
    } else {
      var encryptedPwd = CryptoJS.AES.encrypt(rolePassword, 'secret key 123').toString();
      console.log("encrypted text", encryptedPwd);
      return fetch(API_PROXY_URL+`/api/v1/roles/add`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: roleName,
          privilages: this.state.selectedItems,
          password:encryptedPwd
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

resetRole = async () => {
  this.setState({
    roleName:'',
    rolePassword:'',
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

render() {
    const {item, error, roleName, rolePassword, privilages, selectedItems, errors} = this.state;
    const showAddRole = {
      'display': this.state.showAddForm ? 'block' : 'none'
    };
    const showErrorRole = {
      'display': this.state.showErrorForm ? 'block' : 'none'
    };
    const showUpdateRole = {
      'display': this.state.showUpdateForm ? 'block' : 'none'
    };
    const title = <h2>{item.id ? 'Edit Role' : 'Add Role'}</h2>;
    return <div className="dashboard">
      <Container>
        {title}
        <Form onSubmit={this.roleSubmit}>
            {errors.map(error =>(
                <p key={error} className="errorText">{error}</p>
            ))}
            <div style={showAddRole}>
              <p style={{color: 'darkgreen'}}>{roleName} role Added successfully</p>
            </div>
            <div style={showErrorRole}>
                <p style={{color: 'red'}}>{error} while adding / updating role</p>
            </div>
            <div style={showUpdateRole}>
                <p style={{color: 'blue'}}>{roleName} role Updated successfully</p>
            </div>
          <div className="row">
                <FormGroup className="col-md-3 mb-3">
                    <Label for="roleName" style={{color:'white'}}>Role Name</Label>
                    <Input type="text" ref="roleName" name="roleName" id="roleName" placeholder="Enter Role Name" onChange={e => this.onChange(e)}  value={roleName}/>
                </FormGroup>
                <FormGroup className="col-md-3 mb-3">
                    <Label for="rolePassword" style={{color:'white'}}>Password</Label>
                    <Input ref="rolePassword"  name="rolePassword" placeholder="Enter Role Password" 
                        type="password"
                        onChange={e => this.onChange(e)} 
                        value={rolePassword} />
                </FormGroup>
            </div>
            <div className="row">
              <FormGroup className="col-md-7 mb-3">
                <Label for="student" style={{color:'white'}}>Privilage's</Label>
                <MultiSelect items={privilages} selectedItems={selectedItems} onChange={this.handlePrivilageschange}/>
              </FormGroup>
            </div>
            <div>
              <FormGroup>   
                <Button color="primary" type="submit">Save</Button>{' '}
                <Button color="secondary" onClick={() => this.resetRole()}>reset</Button>
              </FormGroup>
          </div>
        </Form>
      </Container>
    </div>
  }
}
export default RoleEdit;