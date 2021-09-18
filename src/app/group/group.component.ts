import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {ApiService} from "../api-service";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, AfterViewInit {

  loggedUserData: object;

  linkdata = [];
  group_title: string = '';
  groups: Array<any> = [];
  mode: number = 0;
  edittedGroup: Array<any> = [];
  isMobile:boolean;
  @ViewChild('sidenav', {static: true}) public el: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = window.innerWidth < 1441;
  }
  // @HostListener('swiperight', ['$event'])
  // public swipePrev(event: any) {
  //   this.el.show();
  // }

  constructor(public auth: AuthenticationService, public apiService: ApiService) {
  }

  ngOnInit() {
    this.loggedUserData = this.auth.getUserDetails();
    this.getGroups();
    let links = this.loggedUserData['link'].split(',');

    this.apiService.getAllLinks().subscribe(res => {
      if (!this.loggedUserData['is_admin']) {
        for (let i in links) {
          let data = res.filter(item => {
            return item._id == links[i];
          });
          if (data.length > 0) {
            data[0]['selected'] = false;
            this.linkdata.push(data);
          }
        }
      } else {
        if (res.length > 0) {
          for (let link of res) {
            let data = [];
            link['selected'] = false;
            data[0] = link;
            this.linkdata.push(data);
          }
        }
      }

      this.linkdata.sort(function (a, b) {
        if (a[0].label < b[0].label) {
          return -1;
        }
        if (a[0].label > b[0].label) {
          return 1;
        }
        return 0;
      })
    }, (err) => {
    });
  }

  showDashboard(){
    this.el.show()
  }
  ngAfterViewInit(): void {
    this.isMobile = window.innerWidth < 1441;

    (<HTMLElement>document.getElementsByClassName('side-nav')[0]).style.backgroundColor = '#B8BCC0';
    (<HTMLElement>document.getElementsByClassName('side-nav')[0]).style.color = '#000';
    (<HTMLElement>document.getElementsByClassName('side-nav')[0]).style.zIndex = '1000';
  }

  getGroups() {
    let data = {
      user_id: this.loggedUserData['_id']
    };
    this.apiService.getGroups(data).subscribe(res => {
      if (res['status'] == 'success') {
        this.groups = res['data'];

        this.initFields();


        if (this.mode == 1) {
          this.editGroup(this.edittedGroup[0]._id);
        }
      }
    }, err => {

    });
  }

  createNew() {
    this.mode = 0;
    for (let link of this.linkdata) {
      link[0]['selected'] = false;
    }
    this.group_title = '';
    this.edittedGroup = [];
  }

  save() {
    if (!this.group_title) {
      alert('Please enter the group title');
      return;
    }
    let data, selectedArray = [];
    data = this.linkdata.filter((item) => {
      return item[0].selected == true;
    });
    for (let value of data) {
      selectedArray.push(value[0]['_id']);
    }
    let value = selectedArray.join(',');
    if (!value) {
      alert('Please select the links');
      return;
    }
    let params = {
      name: this.group_title,
      value: value,
      user_id: this.loggedUserData['_id'],
      mode: this.mode
    };
    if (this.mode == 1) {
      params['_id'] = this.edittedGroup[0]._id;
    }
    this.apiService.addGroup(params).subscribe(res => {
      if (res['status'] == 'success') {
        alert('Group ' + (this.mode ? 'Edited' : 'Added') + '!');
        this.getGroups();
      } else {
        alert(res.msg);
      }
    })
  }

  editGroup(id) {
    this.createNew();
    this.mode = 1;
    this.edittedGroup = this.groups.filter((group) => {
      return group._id == id;
    });
    let filterCondition;
    if (this.edittedGroup.length > 0) {
      filterCondition = this.edittedGroup[0].value.split(',');
    }
    let selected = this.linkdata.filter((link) => {
      return filterCondition.indexOf(link[0]._id) > -1;
    });

    for (let elem of selected) {
      elem[0]['selected'] = true;
    }
    this.group_title = this.edittedGroup[0]['name'];
  }

  deleteGroup(id) {
    if (confirm('Are you sure?')) {
      this.apiService.deleteGroup({id: id}).subscribe(res => {
        if (res['status'] == 'success') {
          this.getGroups();
          this.createNew();
        } else {
          alert(res.msg);
        }
      });
    }
  }

  initFields() {
    this.group_title = '';
    for (let link of this.linkdata) {
      link[0]['selected'] = false;
    }
  }
}
