import {AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService, TokenPayload} from '../authentication.service';
import {Router} from '@angular/router';
import {ApiService} from "../api-service";
import {ModalDirective} from 'ng-uikit-pro-standard';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FileUploader} from 'ng2-file-upload';
import {
  MdbTableDirective,
  MdbTablePaginationComponent
} from "../../../projects/ng-uikit-pro-standard/src/lib/free/tables";

const URL = '/api/upload-logo';

@Component({

  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls:['./register.component.scss']
})

export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective
  elements: any = [];
  previous: any = [];
  searchText: string = '';
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'logo',
    autoUpload: true,
    allowedMimeType: ['image/png', 'image/jpeg']
  });
  @Input() data: any;

  @ViewChild('basicModal', {static: true}) public modalElem: ModalDirective;
  credentials: TokenPayload = {
    email: '',
    name: '',
    phone: '',
    link: '',
    label: '',
    password: '',
    is_admin: false,
    profilePic: '',
  };
  optionsSelect: Array<any>=[];
  loggedUserData: object;
  userdata: object[];
  mode: number = 0;
  updateId: string;
  registerForm: FormGroup;
  links: any = [];
  fileName: string;
  isActiveButton: boolean = true;
  private sorted = false;

  constructor(private auth: AuthenticationService, private router: Router, public apiService: ApiService, private cdRef: ChangeDetectorRef) {
  }


  @HostListener('input') oninput() {
    this.searchItems();
  }

  onOpen() {
    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();
    this.registerForm.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.loggedUserData = this.auth.getUserDetails();
    if (this.loggedUserData != null) {

      if (this.loggedUserData['is_admin'] == true) {
      } else {
        this.redirectToProfile();
      }
    } else {
      this.redirectToProfile();
    }
    this.validateRegisterForm();

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.fileName = file['_file']['name'];
      this.isActiveButton = false;
    };
    this.apiService.getAllLinks().subscribe(data => {
      this.links = data;
      this.links.forEach((option)=>{
        this.optionsSelect.push({value:option['_id'], label:option['name']});
      });

      this.optionsSelect = [...this.optionsSelect]
      this.getUsers();
    });
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        this.credentials.profilePic = JSON.parse(response)['name'];
        this.isActiveButton = true;
        alert('Profile picture is successfully loaded.');
      } else {
        alert('An error occurred.');
      }
    };

  }

  validateRegisterForm() {
    let formData = {
      "emailInput": new FormControl({value: this.credentials.email}, [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      "phoneInput": new FormControl({value: this.credentials.phone}, [Validators.required, Validators.pattern(/^((?!(0))[0-9]{10,100})$/)]),
      "nameInput": new FormControl({value: this.credentials.name}, Validators.required),
      "labelInput": new FormControl({value: this.credentials.label}, Validators.required),
      "linkInput": new FormControl({value: this.credentials.link}, Validators.required),
      "passwordInput": new FormControl({value: this.credentials.password}, [Validators.required, Validators.minLength(5)]),
    };
    this.registerForm = new FormGroup(formData);
  }

  get nameInput() {
    return this.registerForm.get('nameInput');
  }

  get linkInput() {
    return this.registerForm.get('linkInput');
  }
  get labelInput() {
    return this.registerForm.get('labelInput');
  }

  get emailInput() {
    return this.registerForm.get('emailInput');
  }

  get phoneInput() {
    return this.registerForm.get('phoneInput');
  }

  get passwordInput() {
    return this.registerForm.get('passwordInput');
  }


  redirectToProfile() {
    this.apiService.checkAdmin().subscribe((res) => {
      if (res['status'] == 'success' && res['result'] == true) {
        alert('This page can be accessed by administrator.');
        this.router.navigateByUrl('/profile');
      }
    }, (err) => {
    });
  }

  ngAfterViewInit(): void {

    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();

    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.elements = this.mdbTable.getDataSource();
    }

    if (this.searchText) {
      this.elements = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }

  getUsers() {
    this.apiService.getAllUsers().subscribe((res) => {
      if (res['status'] == 'error') {
        alert(res['msg']);
        return;
      }
      this.userdata = res;
      for (let i in this.userdata) {
        let tempAry = [];
        let temp = this.userdata[i]['link'].split(',');
        for (let j in temp) {
          let data = this.links.filter(elem => {
            return elem['_id'] == temp[j];
          })
          if (data.length > 0) {
            tempAry.push(data[0]['name']);
          }
        }
        this.userdata[i]['link_title'] = tempAry.join(',');

        this.mdbTable.setDataSource(this.userdata);
        this.elements = this.mdbTable.getDataSource();
        this.previous = this.mdbTable.getDataSource();
      }
    }, (err) => {
    });
  }

  getDetail(data) {
    this.apiService.getUserByID({id: data}).subscribe(res => {
      this.credentials['name'] = res[0]['name'];
      this.credentials['email'] = res[0]['email'];
      this.credentials['phone'] = res[0]['phone'];
      this.credentials['link'] = res[0]['link'].split(',');
      this.credentials['label'] = res[0]['label'];
      this.credentials['password'] = res[0]['password'];
      this.mode = 1;
      this.updateId = res[0]['_id'];
      this.modalElem.show();
    }, (err) => {
      alert('An error occured. Please try again later.')
    });
  }

  deleteUser(data) {
    if (confirm('Are you sure?')) {
      this.apiService.deleteUser({id: data}).subscribe(res => {
        this.getUsers();
      }, (err) => {
        alert('An error occured. Please try again later.')
      });

    }
  }

  register() {
    this.uploader.uploadAll();

    if (this.registerForm.invalid) {
      alert('Please complete the all required fields.');
      return;
    }
    let link = (new Array(this.credentials['link'])).join(',');
    if (link.length == 0) {
      link = ' ';
    }
    let data = {};
    data['name'] = this.credentials['name'];
    data['email'] = this.credentials['email'];
    data['phone'] = this.credentials['phone'];
    data['link'] = link;
    data['label'] = this.credentials['label'];
    data['password'] = this.credentials['password'];
    data['profilePic'] = this.credentials['profilePic'];
    data['is_admin'] = true;
    data['mode'] = this.mode;
    if (this.mode == 1) {
      data['_id'] = this.updateId;
    }
    this.apiService.register(data).subscribe((res) => {
      if (res['status'] == 'error') {
        alert(res['msg']);
        return;
      } else {
        this.getUsers();
        this.modalElem.hide();
      }
      // this.router.navigateByUrl('/profile');
    }, (err) => {
    });
  }


  sortBy(by: string | any): void {

    this.userdata.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }

      return 0;
    });

    this.sorted = !this.sorted;
  }
}
