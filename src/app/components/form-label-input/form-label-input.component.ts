import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-form-label-input',
  templateUrl: './form-label-input.component.html',
  styleUrls: ['./form-label-input.component.scss']
})
export class FormLabelInputComponent implements OnInit {
  @Output() setQuestions: EventEmitter<object> = new EventEmitter<object>();
  @Input('label') public label: string;
  @Input('block') public block: boolean;
  @Input('disabled') public disabled: boolean = false;
  @Input('value') public value: string = '';
  @Input('type') public type: string = 'text';

  constructor() {
  }

  dispatchData($event) {
    console.log($event)
  }

  ngOnInit() {
  }
}
