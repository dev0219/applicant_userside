import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import {ApiService} from "../api-service";
import {ModalDirective} from 'ng-uikit-pro-standard';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {
  MdbTableDirective,
  MdbTablePaginationComponent
} from "../../../projects/ng-uikit-pro-standard/src/lib/free/tables";


@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit, AfterViewInit {

  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective
  @ViewChild('basicModal', {static: true}) public modalElem: ModalDirective;

  elements: any = [];
  previous: any = [];
  searchText: string = '';
  link = {
    name: '',
    label: '',
  };
  loggedUserData: object;
  linkdata: object[];
  mode: number = 0;
  updateId: string;
  registerForm: FormGroup;
  private sorted = false;

  constructor(private auth: AuthenticationService, private router: Router, public apiService: ApiService, private cdRef: ChangeDetectorRef) {
  }

  @HostListener('input') oninput() {
    this.mdbTablePagination.searchText = this.searchText;
  }

  onOpen(event: any) {
  }

  ngOnInit(): void {
    this.loggedUserData = this.auth.getUserDetails();
    if (this.loggedUserData != null) {

      this.getLinks();
      if (this.loggedUserData['is_admin'] == true) {
      } else {
        this.redirectToProfile();
      }
    } else {
      this.redirectToProfile();
    }
    this.validateRegisterForm();
  }

  validateRegisterForm() {
    let formData = {
      "nameInput": new FormControl({value: this.link.name}, Validators.required),
      "labelInput": new FormControl({value: this.link.label}, Validators.required),
    };
    this.registerForm = new FormGroup(formData);
  }

  get nameInput() {
    return this.registerForm.get('nameInput');
  }

  get labelInput() {
    return this.registerForm.get('labelInput');
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

    this.mdbTablePagination.setMaxVisibleItemsNumberTo(25);
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

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();

    this.mdbTable.searchDataObservable(this.searchText).subscribe(() => {
      this.mdbTablePagination.calculateFirstItemIndex();
      this.mdbTablePagination.calculateLastItemIndex();
    });
  }

  getLinks() {
    this.apiService.getAllLinks().subscribe((res) => {
      if (res['status'] == 'error') {
        alert(res['msg']);
        return;
      }
      this.linkdata = res;
      this.mdbTable.setDataSource(this.linkdata);
      this.elements = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
    }, (err) => {
    });
  }

  getDetail(data) {
    this.apiService.getLinkByID({id: data}).subscribe(res => {

      this.link['name'] = res[0]['name'];
      this.link['label'] = res[0]['label'];
      this.mode = 1;
      this.updateId = res[0]['_id'];
      this.modalElem.show();

    }, (err) => {
      alert('An error occured. Please try again later.')
    });
  }

  deleteLink(data) {
    if (confirm('Are you sure?')) {
      this.apiService.deleteLink({id: data}).subscribe(res => {
        this.getLinks();
      }, (err) => {
        alert('An error occured. Please try again later.')
      });

    }
  }

  register() {

    if (this.registerForm.invalid) {
      alert('Please complete the all required fields.');
      return;
    }

    let data = {};
    data['name'] = this.link['name'];
    data['label'] = this.link['label'];
    data['is_admin'] = true;
    data['mode'] = this.mode;
    if (this.mode == 1) {
      data['_id'] = this.updateId;
    }
    this.apiService.addLink(data).subscribe((res) => {
      if (res['status'] == 'error') {
        alert(res['msg']);
        return;
      } else {
        this.getLinks();
        this.modalElem.hide();
      }
    }, (err) => {
    });
  }

  sortBy(by: string | any): void {

    this.linkdata.sort((a: any, b: any) => {
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
