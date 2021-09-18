import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmmiterService {
  toggleNavBar = new EventEmitter();
  isAPIDataFetched = new EventEmitter();

  constructor() {
  }

  toggleNav(status: boolean) {
    this.toggleNavBar.emit(status);
  }

  toggleAPIDataStatus(status: boolean) {
    this.isAPIDataFetched.emit(status);
  }
}
