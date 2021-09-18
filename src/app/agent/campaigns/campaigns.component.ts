import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {
  isMobileClick: boolean;
  isSubMenuClick: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
