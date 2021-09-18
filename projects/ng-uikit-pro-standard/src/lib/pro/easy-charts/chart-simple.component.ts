import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mdb-simple-chart',
  templateUrl: './chart-simple.component.html',
  styleUrls: ['./easy-charts-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SimpleChartComponent implements OnInit {
  @Input() customText: string;
  @Input() percent: number;
  @Input() barColor: string;
  @Input() trackColor: string;
  @Input() scaleColor: string;
  @Input() scaleLength: number;
  @Input() lineCap: string;
  @Input() lineWidth: number;
  @Input() trackWidth: number;
  @Input() size: number;
  @Input() rotate: number;
  @Input() animate: { duration: string; enabled: boolean };
  public options: any = {
    barColor: null,
    trackColor: null,
    scaleColor: null,
    scaleLength: '',
    lineCap: null,
    lineWidth: null,
    trackWidth: null,
    size: null,
    rotate: null,
    duration: null,
    enableAnimation: null,
    animate: {
      duration: 1000,
      enabled: true,
    },
  };

  constructor() {}

  ngOnInit() {
    this.options.barColor = '#' + this.barColor;
    this.options.trackColor = '#' + this.trackColor;
    this.options.scaleColor = '#' + this.scaleColor;
    this.options.scaleLength = this.scaleLength;
    this.options.lineCap = this.lineCap;
    this.options.lineWidth = this.lineWidth;
    this.options.trackWidth = this.trackWidth;
    this.options.size = this.size;
    this.options.rotate = this.rotate;
    this.options.animate.duration = this.animate.duration;
    this.options.animate.enabled = this.animate.enabled;
  }
}
