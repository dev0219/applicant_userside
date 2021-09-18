import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {
  isMobileClick: boolean;
  isSubMenuClick: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
