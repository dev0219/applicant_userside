import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-next-button',
  templateUrl: './next-button.component.html',
  styleUrls: ['./next-button.component.scss']
})
export class NextButtonComponent implements OnInit {

  constructor() {
  }

  @Input('text') public text: string;
  @Input('color') public color: string;
  @Input('type') public type: string;

  ngOnInit() {
  }

}
