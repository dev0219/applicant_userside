import {
  MdbTableDirective,
  MdbTablePaginationComponent
} from "../../../projects/ng-uikit-pro-standard/src/lib/free/tables";
import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {Router} from "@angular/router";
import {ApiService} from "../api-service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;

  @ViewChild('sidenav', {static: true}) public el: any;

  elements: any = [];
  previous: any = [];
  searchText: string = '';
  data: object[];
  isAdmin: boolean = false;
  loggedUserData: object;
  groups: object = [];
  group_title: string = 'All';
  isMobile: boolean;

  constructor(public auth: AuthenticationService, public router: Router, public apiService: ApiService, private cdRef: ChangeDetectorRef) {
  }

  @HostListener('input') oninput() {
    this.mdbTablePagination.searchText = this.searchText;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = window.innerWidth < 1441;
  }

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/')

    } else {
      this.loggedUserData = this.auth.getUserDetails();
      this.getGroups();
      this.getData('-1');
    }

  }

  ngAfterViewInit() {
    this.isMobile = window.innerWidth < 1441;

    this.mdbTablePagination.setMaxVisibleItemsNumberTo(25);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
    (<HTMLElement>document.getElementsByClassName('side-nav')[0]).style.backgroundColor = '#B8BCC0';
    (<HTMLElement>document.getElementsByClassName('side-nav')[0]).style.color = '#000';
    (<HTMLElement>document.getElementsByClassName('side-nav')[0]).style.zIndex = '1000';
  }


  showDashboard() {
    this.el.show()
  }

  getData(groupId) {
    let userdetail = this.auth.getUserDetails();
    this.apiService.getDataByID({id: userdetail['_id'], groupId: groupId}).subscribe(res => {
      this.isAdmin = res['is_admin'];
      this.data = res['data'];
      this.mdbTable.setDataSource(this.data);
      this.elements = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
    }, (err) => {
    });
  }

  getGroups() {
    let data = {
      user_id: this.loggedUserData['_id']
    };
    this.apiService.getGroups(data).subscribe(res => {
      if (res['status'] == 'success') {
        this.groups = res['data'];
      }
    }, err => {

    });
  }
}
