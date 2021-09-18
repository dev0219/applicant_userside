import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import {ApiService} from "../api-service";
import {Router} from "@angular/router";
import {CommonService} from "../services/common.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public signInForm: FormGroup;
  submitted = false;
 
  username: string = "";
  password: string = "";
  
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    public apiService: ApiService,
    private commonService: CommonService,
    public http: HttpClient
  ) { this.validateSigninForm(); }

  ngOnInit() {
  }

  signinSubmit(Form){
    this.submitted = true;
    if(!this.signInForm.valid){
      this.commonService.modalOpen('Warning', 'Please enter all required fields.');
      return;
    }

    
  }

  validateSigninForm() {
    let formData = {
      username: new FormControl(this.username, Validators.required),
      password: new FormControl(this.password, Validators.required)
      
    };

    
    this.signInForm = new FormGroup(formData);
  }


}
