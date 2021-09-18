import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../authentication.service";
import {ApiService} from "../api-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  password: string;
  Cpassword: string;
  curPwd:string;
  _id: string;

  passwordForm: FormGroup;

  constructor(public auth: AuthenticationService, public apiService: ApiService, public router: Router) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/')
    }
  }


  validatePasswordForm() {
    let formData = {
      "passwordInput": new FormControl({value: this.password}, [Validators.required, Validators.minLength(5)]),
      "CpasswordInput": new FormControl({value: this.Cpassword}, [Validators.required, Validators.minLength(5)]),
      "curPwdInput": new FormControl({value: this.Cpassword}, [Validators.required]),
    };
    this.passwordForm = new FormGroup(formData);

  }

  get curPwdInput() {
    return this.passwordForm.get('curPwdInput');
  }
  get passwordInput() {
    return this.passwordForm.get('passwordInput');
  }

  get CpasswordInput() {
    return this.passwordForm.get('CpasswordInput');
  }

  ngOnInit() {

    let data = this.auth.getUserDetails();
    this._id = data._id;
    this.validatePasswordForm();
  }

  updateInfo() {
    if (this.password == undefined || this.password == '') {
      alert('Please enter the password.');
      return;
    }
    if (this.password !== this.Cpassword) {
      alert('Please match the password and confirm password.');
      return;
    }
    if (this.passwordForm.invalid) {
      alert('Please complete the all required fields.');
      return;
    }
    let loggedId = this.auth.getUserDetails()['_id'];
    let data = {
      password: this.password,
      _id: this._id,
      mode: 1,
      loginId: loggedId,
      isChangePwd: true,
      curPwd: this.curPwd,
    };
    this.auth.register(data).subscribe((res) => {
      if (res['status'] == 'error') {
        alert(res['msg']);
        return;
      } else if (res['status'] == 'success') {
        alert(res['msg']);
      }
      // this.router.navigateByUrl('/profile');
    }, (err) => {
    });
  }

}
