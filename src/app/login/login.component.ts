import {Component, OnInit} from '@angular/core';
import {AuthenticationService, TokenPayload} from '../authentication.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  ngOnInit(): void {
    this.validateLoginForm();
  }

  loginForm: FormGroup;

  constructor(private auth: AuthenticationService, private router: Router) {
  }

  validateLoginForm() {
    let formData = {
      "emailInput": new FormControl({value: this.credentials.email}, [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      "passwordInput": new FormControl({value: this.credentials.password}, [Validators.required, Validators.minLength(5)]),
    };
    this.loginForm = new FormGroup(formData);
  }

  get passwordInput() {
    return this.loginForm.get('passwordInput');
  }

  login() {
    this.auth.login(this.credentials)
      .subscribe(
        (res) => {
          if (res['error']) {
            alert(res['error']['message']);
            return;
          }
          this.router.navigateByUrl('/profile');
        }, (err) => {
          alert(err['error']['message'])
        })
  }
  get emailInput() {
    return this.loginForm.get('emailInput');
  }
}
