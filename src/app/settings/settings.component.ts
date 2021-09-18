import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../authentication.service";
import {ApiService} from "../api-service";
import {Router} from "@angular/router";
import {FileUploader} from "ng2-file-upload";

const URL = '/api/upload';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'logo',
    autoUpload: true,
    allowedMimeType: ['image/png', 'image/jpeg']
  });

  name: string;
  label: string;
  phone: string;
  email: string;
  // password: string;
  // Cpassword: string;
  profilePic: string;
  _id: string;
  mode: number = 1;
  isActiveButton: boolean = true;
  settingsForm: FormGroup;
  isEdit: boolean = false;
  fileName: string;

  constructor(public auth: AuthenticationService, public apiService: ApiService, public router: Router) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/')
    }
  }

  ngOnInit() {
    let data = this.auth.getUserDetails();
    this.name = data.name;
    this.label = data.label;
    this.email = data.email;
    this.phone = data.phone;
    this._id = data._id;
    this.validateSettingsForm();
    this.uploader.onAfterAddingFile = (file) => {
      this.fileName = file['_file']['name'];
      this.isActiveButton = false;
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        this.profilePic = JSON.parse(response)['name'];
        this.isActiveButton = true;
        alert('Profile picture is successfully loaded.');
      } else {
        alert('An error occurred.');
      }
    };
  }

  updateInfo() {
    // if (this.password == undefined || this.password == '') {
    //   alert('Please enter the password.');
    //   return;
    // }
    // if (this.password !== this.Cpassword) {
    //   alert('Please match the password and confirm password.');
    //   return;
    // }
    if (this.settingsForm.invalid) {
      alert('Please complete the all required fields.');
      return;
    }
    let loggedId = this.auth.getUserDetails()['_id'];
    let data = {
      name: this.name,
      email: this.email,
      label: this.label,
      phone: this.phone,
      // password: this.password,
      profilePic: this.profilePic,
      _id: this._id,
      mode: this.mode,
      loginId: loggedId,
      isChangePwd:false
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

  validateSettingsForm() {
    let formData = {
      "emailInput": new FormControl({value: this.email}, [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      "phoneInput": new FormControl({value: this.phone}, [Validators.required, Validators.pattern(/^((?!(0))[0-9]{10,100})$/)]),
      "nameInput": new FormControl({value: this.name}, Validators.required),
      "labelInput": new FormControl({value: this.label}, Validators.required),
      // "passwordInput": new FormControl({value: this.password}, [Validators.required, Validators.minLength(5)]),
      // "CpasswordInput": new FormControl({value: this.Cpassword}, [Validators.required, Validators.minLength(5)]),
    };
    this.settingsForm = new FormGroup(formData);

  }

  get nameInput() {
    return this.settingsForm.get('nameInput');
  }

  get labelInput() {
    return this.settingsForm.get('labelInput');
  }

  get emailInput() {
    return this.settingsForm.get('emailInput');
  }

  get phoneInput() {
    return this.settingsForm.get('phoneInput');
  }

  // get passwordInput() {
  //   return this.settingsForm.get('passwordInput');
  // }
  //
  // get CpasswordInput() {
  //   return this.settingsForm.get('CpasswordInput');
  // }
}
