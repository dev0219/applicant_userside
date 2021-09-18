import { Component, Input, ViewChild, TemplateRef, ElementRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'mdb-step',
  exportAs: 'mdbStep',
  template: '<ng-template><ng-content></ng-content></ng-template>',
})
export class MdbStepComponent implements OnInit {
  @ViewChild(TemplateRef, { static: true }) content: TemplateRef<any>;
  @Input() editable = true;
  @Input() name: string;
  @Input() label: string;
  @Input() stepForm: FormGroup;

  constructor(public el: ElementRef) {}

  get isDone() {
    return this._isDone;
  }
  set isDone(value: boolean) {
    this._isDone = value;
  }
  private _isDone: boolean;

  get isWrong() {
    return this._isWrong;
  }
  set isWrong(value: boolean) {
    this._isWrong = value;
  }
  private _isWrong: boolean;

  get isActive() {
    return this._isActive;
  }
  set isActive(value: boolean) {
    this._isActive = value;
  }
  private _isActive = false;

  private _removeClasses() {
    this.isActive = false;
    this.isDone = false;
    this.isWrong = false;
  }

  reset() {
    if (this.stepForm) {
      this.stepForm.reset();
    }
    this._removeClasses();
  }

  ngOnInit() {}
}
