import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import {ApiService} from "../api-service";
import {Router} from "@angular/router";
import {CommonService} from "../services/common.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup;
  submitted = false;
  uniqueurlErr = [];
  basicurls = [{basicurls:''}];
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  phone: string = "";
  links: string = "";
  track: number = 0;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    public apiService: ApiService,
    private commonService: CommonService,
    public http: HttpClient
  ) { this.validateSignupForm(); }

  ngOnInit() {

  }

  /* validation_messages = {
    'firstName': [{ type: 'required', message: 'Please fill first name.' }],
    'lastName': [{ type: 'required', message: 'Please fill last name.' }],
    'email': [{ type: 'required', message: 'Please fill email address.' },
              { type: 'pattern', message: 'Please fill valid email address.' }],
    'phone': [{ type: 'required', message: 'Please fill phone number.' }],
    'basicurl': [{ type: 'required', message: 'Please fill basic url.' }],
    'links': [{ type: 'required', message: 'Please select link.' }]
  }; */

  // convenience getter for easy access to form fields

  signupSubmit(Form){
    this.submitted = true;
    if(!this.signupForm.valid){
      this.commonService.modalOpen('Warning', 'Please enter all required fields.');
      return;
    }

    this.http.get('assets/agents.csv', {responseType: 'text'})
      .subscribe(data => {
      let csvToRowArray = data.split("\n");
      let pivot = 0;
      for(let i = 0; i < this.basicurls.length; i++){
        let tmp = 0;
        for (let index = 1; index < csvToRowArray.length; index++) {
          let row = csvToRowArray[index].split(",");
          console.log(row[0].trim()+"    "+this.basicurls[i]['basicurls'].toString());
          if(row[0].trim() == this.basicurls[i]['basicurls'].toString()){
            tmp = 1;
          }
        }
        if(tmp == 1){
          pivot = 1;
          this.uniqueurlErr[i] = "Change basic url '"+this.basicurls[i]['basicurls'].toString()+"' url is already taken."
        }
      }
      if(pivot == 0){
        this.apiService.signupRequest(Form,this.basicurls).subscribe(res => {
          this.commonService.modalOpen('Success', 'Signup successfully !! :-)');
        }, (err) => {
        });
      }else{
        return;
      }
    });
  }

  updateUniqueurlErr(event,id){
    if(event.target.value == ""){
      this.uniqueurlErr[id] = "";
    }
  }

  validateSignupForm() {
    let formData = {
      firstName: new FormControl(this.firstName, Validators.required),
      lastName: new FormControl(this.lastName, Validators.required),
      email: new FormControl(this.email, [Validators.required, Validators.email]),
      phone: new FormControl(this.phone, Validators.required),
      links: new FormControl(this.links, Validators.required)
    };

    for (let i = 0; i < this.basicurls.length; i++) {
      formData['basicurls' + i] = new FormControl(this.basicurls[i]['basicurls'],Validators.required);
      this.uniqueurlErr[i] = "";
    }
    this.signupForm = new FormGroup(formData);
  }

  addBasicUrl() {
    /* if(this.links == "2"){
      if (this.basicurls.length < 2) {
        document.getElementById('remove_basic_url').style.display = "block";
        this.basicurls[this.basicurls.length] = {basicurls: ''};
        if(this.basicurls.length == 2){
          document.getElementById('add_basic_url').style.display = "none";
        }
      }
    }
    else if(this.links == "3"){
      if (this.basicurls.length < 3) {
        document.getElementById('remove_basic_url').style.display = "block";
        this.basicurls[this.basicurls.length] = {basicurls: ''};
        if(this.basicurls.length == 3){
          document.getElementById('add_basic_url').style.display = "none";
        }
      }
    }
    else if(this.links == "4"){
      if (this.basicurls.length < 4) {
        document.getElementById('remove_basic_url').style.display = "block";
        this.basicurls[this.basicurls.length] = {basicurls: ''};
        if(this.basicurls.length == 4){
          document.getElementById('add_basic_url').style.display = "none";
        }
      }
    } */
    if(this.links == "5-10"){
      if (this.basicurls.length < 9) {
        document.getElementById('remove_basic_url').style.display = "block";
        this.basicurls[this.basicurls.length] = {basicurls: ''};
        if(this.basicurls.length == 9){
          document.getElementById('add_basic_url').style.display = "none";
        }
      }
    }
    else if(this.links == "10-20"){
      if (this.basicurls.length < 19) {
        document.getElementById('remove_basic_url').style.display = "block";
        this.basicurls[this.basicurls.length] = {basicurls: ''};
        if(this.basicurls.length == 19){
          document.getElementById('add_basic_url').style.display = "none";
        }
      }
    }
    else if(this.links == "20+"){
      this.basicurls[this.basicurls.length] = {basicurls: ''};
    }
    this.validateSignupForm();
  };

  deleteLink(key) {
    /* if(this.links == "2"){
      if (this.basicurls.length > 1) {
        document.getElementById('add_basic_url').style.display = "block";
        this.basicurls.splice(key, 1);
        this.uniqueurlErr.splice(key, 1);
        this.validateSignupForm();
        if(this.basicurls.length == 1){
          document.getElementById('remove_basic_url').style.display = "none";
        }
      }
    }
    else if(this.links == "3"){
      if (this.basicurls.length > 1) {
        document.getElementById('add_basic_url').style.display = "block";
        this.basicurls.splice(key, 1);
        this.uniqueurlErr.splice(key, 1);
        this.validateSignupForm();
        if(this.basicurls.length == 1){
          document.getElementById('remove_basic_url').style.display = "none";
        }
      }
    }
    else if(this.links == "4"){
      if (this.basicurls.length > 1) {
        document.getElementById('add_basic_url').style.display = "block";
        this.basicurls.splice(key, 1);
        this.uniqueurlErr.splice(key, 1);
        this.validateSignupForm();
        if(this.basicurls.length == 1){
          document.getElementById('remove_basic_url').style.display = "none";
        }
      }
    } */

    if(this.links == "5-10"){
      if (this.basicurls.length > 5) {
        document.getElementById('add_basic_url').style.display = "block";
        this.basicurls.splice(key, 1);
        this.uniqueurlErr.splice(key, 1);
        this.validateSignupForm();
      }
    }

    if(this.links == "10-20"){
      if (this.basicurls.length > 10) {
        document.getElementById('add_basic_url').style.display = "block";
        this.basicurls.splice(key, 1);
        this.uniqueurlErr.splice(key, 1);
        this.validateSignupForm();
      }
    }

    if(this.links == "20+"){
      if (this.basicurls.length > 20) {
        document.getElementById('add_basic_url').style.display = "block";
        this.basicurls.splice(key, 1);
        this.uniqueurlErr.splice(key, 1);
        this.validateSignupForm();
      }
    }
  }

  changeLink(event,links){
  /*   if(this.track == 1){
      var r = confirm("You want to change no of url with loss old url data...?");
      console.log(r);
      if (r == true) { */
        var nooflink = event.target.value;
        if(nooflink == "5-10"){
          nooflink = 5;
        }else if(nooflink == "10-20"){
          nooflink = 10;
        }else if(nooflink == "20+"){
          nooflink = 20;
        }else{
          nooflink = parseInt(nooflink);
        }
        this.basicurls = [];
        for(var i = 0; i < nooflink;i++){
          this.basicurls.push({basicurls:''});
        }
        this.validateSignupForm();
     /*  }else{
        // this.links = this.basicurls;
        // return false;
        event.preventDefault();
      }
    }else{
      var nooflink = event.target.value;
      if(nooflink == "5-10"){
        nooflink = 5;
      }else if(nooflink == "10-20"){
        nooflink = 10;
      }else if(nooflink == "20+"){
        nooflink = 20;
      }else{
        nooflink = parseInt(nooflink);
      }
      this.basicurls = [];
      for(var i = 0; i < nooflink;i++){
        this.basicurls.push({basicurls:''});
      }
      this.validateSignupForm();
      this.track = 1;
    } */
  }

  onBlurBasicUrl(event,i){
    if(event.target.value != ""){
      this.http.get('assets/agents.csv', {responseType: 'text'})
        .subscribe(data => {
        let csvToRowArray = data.split("\n");
        let tmp = 0;
        for (let index = 1; index < csvToRowArray.length; index++) {
          let row = csvToRowArray[index].split(",");
          console.log(row[0].trim()+"    "+this.basicurls[i]['basicurls'].toString());
          if(row[0].trim() == event.target.value){
            tmp = 1;
          }
        }
        if(tmp == 1){
          this.uniqueurlErr[i] = "Change basic url '"+this.basicurls[i]['basicurls'].toString()+"' url is already taken.";
        }else{
          this.uniqueurlErr[i] = "";
        }
      });
    }else{
      this.uniqueurlErr[i] = "";
    }
  }
}
