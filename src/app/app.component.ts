import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {AuthenticationService} from './authentication.service';
import {ApiService} from "./api-service";
import {EventEmmiterService} from "./services/event-emmiter.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  mainHeight: number;
  isNavbar: boolean = true;

  constructor(private router: Router, public auth: AuthenticationService, public apiService: ApiService, private eventEmitterService: EventEmmiterService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          if(document.getElementsByTagName('footer').length){
            this.mainHeight = window.innerHeight - document.getElementsByTagName('footer')[0].offsetHeight - 50;
          }
        })
      }
    })
  }

  @HostListener('window:resize', ['$event'])

  onResize(event) {
    if(document.getElementsByTagName('footer').length){
      this.mainHeight = event.target.innerHeight - document.getElementsByTagName('footer')[0].offsetHeight - 50;
    }
  }

  ngOnInit(): void {
    this.getNavbarStatus();
    window.scrollTo(0, 0);
    setTimeout(() => {
      if(document.getElementsByTagName('footer').length){
        this.mainHeight = window.innerHeight - document.getElementsByTagName('footer')[0].offsetHeight - 50;
      }
    })
  }

  ngAfterViewInit(): void {
    if(document.getElementsByClassName('.navbar').length){
      (<HTMLElement>document.querySelector('.navbar')).style.backgroundColor = "#647693";
    }
  }

  getNavbarStatus() {
    this.eventEmitterService.toggleNavBar.subscribe(data => this.isNavbar = data)
  }
}
