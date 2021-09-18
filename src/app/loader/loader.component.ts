import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input('scale') public scale: number = 1;
  @Input('type') public type: string = 'loader10';

  constructor() {
  }

  ngOnInit() {
  }
}
