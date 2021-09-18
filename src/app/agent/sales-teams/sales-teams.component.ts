import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-teams',
  templateUrl: './sales-teams.component.html',
  styleUrls: ['./sales-teams.component.scss']
})
export class SalesTeamsComponent implements OnInit {
  isMobileClick: boolean;
  isSubMenuClick: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
