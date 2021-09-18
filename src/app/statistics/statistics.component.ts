import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {Router} from "@angular/router";
import {ApiService} from "../api-service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  title: string;
  data: object[];
  isAdmin: boolean = false;
  private sorted = false;
  selectValue: any = ['label', 'link', 'is1daysum', 'is1dayavg', 'is7daysum', 'is7dayavg', 'is30daysum', 'isytdsum', 'iscompare'];
  groups: Array<any> = [];
  loggedUserData: object;
  group_title: string = 'All';
  optionsSelect: Array<any>;
  isMobile: boolean;
  totals: object = {
    count: 0,
    count1: 0,
    count7: 0,
    count30: 0,
    count90: 0,
    countC1: 0,
    countC7: 0,
    countC30: 0,
    countC90: 0,
    countCYTD: 0,
    countYTD: 0
  };
  @ViewChild('sidenav', {static: true}) public el: any;

  // @HostListener('swiperight', ['$event'])
  // public swipePrev(event: any) {
  //   this.el.show();
  // }

  constructor(public auth: AuthenticationService, public router: Router, public apiService: ApiService, private cdRef: ChangeDetectorRef) {

    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/')
    } else {
      let userdetail = this.auth.getUserDetails();
      this.isAdmin = userdetail['is_admin'];
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = window.innerWidth < 1441;
  }

  ngOnInit() {
    this.optionsSelect = [
      {value: 'label', label: 'Label'},
      {value: 'link', label: 'Link'},
      {value: 'is1daysum', label: '1 day sum'},
      {value: 'is1dayavg', label: '1 day avg'},
      {value: 'is7daysum', label: '7 day sum'},
      {value: 'is7dayavg', label: '7 day avg'},
      {value: 'is30daysum', label: '30 day sum'},
      {value: 'is30dayavg', label: '30 day avg'},
      {value: 'is90daysum', label: '90 day sum'},
      {value: 'is90dayavg', label: '90 day avg'},
      {value: 'isytdsum', label: 'Ytd sum'},
      {value: 'isytdavg', label: 'Ytd avg'},
      {value: 'iscompare', label: 'Compare'},
    ];
    this.loggedUserData = this.auth.getUserDetails();

    if (this.loggedUserData != null) {
      this.getGroups();
      this.getStatistics(-1);
    } else {
      this.redirectToProfile();
    }

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

  ngAfterViewInit() {
    this.isMobile = window.innerWidth < 1441;
    (<HTMLElement>document.getElementsByClassName('side-nav')[0]).style.backgroundColor = '#B8BCC0';
    (<HTMLElement>document.getElementsByClassName('side-nav')[0]).style.color = '#000';
    (<HTMLElement>document.getElementsByClassName('side-nav')[0]).style.zIndex = '1000';
    // document.getElementsByClassName('options')[0].styles.maxHeight = 600;
  }

  showDashboard() {
    this.el.show()
  }

  getStatistics(id) {
    this.totals = {
      count: 0,
      count1: 0,
      count7: 0,
      count30: 0,
      count90: 0,
      countC1: 0,
      countC7: 0,
      countC30: 0,
      countC90: 0,
      countCYTD: 0,
      countYTD: 0,
      diffDays:0
    };
    let data = {_id: this.loggedUserData['_id'], groupId: id};
    this.apiService.getStatistics(data).subscribe(res => {
      this.title = res['label'];
      this.isAdmin = res['is_admin'];
      this.data = res['data'];
      for (let data of this.data) {
        this.totals['count'] += data['count'];
        this.totals['count1'] += data['count1'];
        this.totals['count7'] += data['count7'];
        this.totals['count30'] += data['count30'];
        this.totals['count90'] += data['count90'];
        this.totals['countC1'] += data['countC1'];
        this.totals['countC7'] += data['countC7'];
        this.totals['countC30'] += data['countC30'];
        this.totals['countC90'] += data['countC90'];
        this.totals['countCYTD'] += data['countCYTD'];
        this.totals['countYTD'] += data['countYTD'];
        this.totals['diffDays'] = data['diffDays'];
      }
    }, (err) => {
    });
  }

  redirectToProfile() {
    alert('This page can be accessed by administrator.');
    this.router.navigateByUrl('/profile');
  }

  sortBy(by: string | any): void {

    this.data.sort((a: any, b: any) => {
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
