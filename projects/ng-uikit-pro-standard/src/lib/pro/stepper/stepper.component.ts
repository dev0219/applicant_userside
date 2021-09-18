import {
  Component,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  OnInit,
  AfterContentInit,
  Input,
  ElementRef,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  Renderer2,
  PLATFORM_ID,
  Inject,
  AfterContentChecked,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { MdbStepComponent } from './step.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { WavesDirective } from '../../free/waves/waves-effect.directive';
import { FormControl } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { from, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

export class StepChangeEvent {
  activeStep: MdbStepComponent;
  activeStepIndex: number;
  previousStep: MdbStepComponent;
  previousStepIndex: number;
}

@Component({
  selector: 'mdb-stepper',
  exportAs: 'mdbStepper',
  templateUrl: 'stepper.component.html',
  styleUrls: ['./stepper-module.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('stepContentTransition', [
      state('previous', style({ transform: 'translateX(-100%)', display: 'none' })),
      state('next', style({ transform: 'translateX(100%)', display: 'none' })),
      state('current', style({ transform: 'none', display: 'block' })),
      transition('* => *', animate('600ms ease')),
    ]),
  ],
  providers: [WavesDirective],
})
export class MdbStepperComponent
  implements OnInit, AfterContentInit, AfterViewInit, AfterContentChecked, OnDestroy {
  @ContentChildren(MdbStepComponent) steps: QueryList<MdbStepComponent>;
  @ViewChildren('stepTitle') stepTitles: QueryList<ElementRef>;
  @ViewChildren('stepContent') stepContents: QueryList<ElementRef>;
  @ViewChild('container', { static: true }) container: ElementRef;

  @Input() linear = false;
  @Input() disableWaves = false;
  @Input()
  get vertical() {
    return this._vertical;
  }
  set vertical(value: boolean) {
    if (value) {
      this._vertical = value;
      this.horizontal = false;
      this._renderer.removeStyle(this.container.nativeElement, 'height');
    } else {
      this._vertical = value;
      this.horizontal = true;
      if (this.container.nativeElement.children[this.activeStepIndex]) {
        const stepElContent = this.container.nativeElement.children[this._activeStepIndex]
          .lastElementChild;
        this._updateHorizontalStepperHeight(this.activeStepIndex, stepElContent.clientHeight);
      }
    }
  }
  private _vertical = false;

  @Output() stepChange: EventEmitter<StepChangeEvent> = new EventEmitter<StepChangeEvent>();

  constructor(
    public ripple: WavesDirective,
    private _renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private _destroy: Subject<void> = new Subject();

  isBrowser: boolean;
  horizontal = true;

  get activeStepIndex() {
    return this._activeStepIndex;
  }

  set activeStepIndex(value: number) {
    this._activeStepIndex = value;
  }

  private _activeStepIndex: number;
  private _activeStep: MdbStepComponent;
  private stepTextContent = '';

  stepChangeSubject: Subject<any> = new Subject();
  stepChange$: Observable<any>;

  getStepChange$(): Observable<any> {
    return this.stepChangeSubject;
  }

  onClick(index: number, event: any) {
    if (!this.disableWaves) {
      const clickedEl = this.stepTitles.toArray()[index];
      this.ripple.el = clickedEl;
      this.ripple.click(event);
    }
  }

  ngOnInit() {}

  private _isStepValid(step: MdbStepComponent) {
    if (!step.stepForm) {
      return true;
    }

    if (step.stepForm && step.stepForm.valid) {
      return true;
    }

    return false;
  }

  getAnimationState(index: number): string {
    const nextElPosition = index - this.activeStepIndex;
    if (nextElPosition < 0) {
      return 'previous';
    } else if (nextElPosition > 0) {
      return 'next';
    }
    return 'current';
  }

  private _getStepByIndex(index: number): MdbStepComponent {
    return this.steps.toArray()[index];
  }

  next() {
    if (this.activeStepIndex < this.steps.length - 1) {
      this.setNewActiveStep(this.activeStepIndex + 1);
    }
  }

  previous() {
    if (this.activeStepIndex > 0) {
      this.setNewActiveStep(this.activeStepIndex - 1);
    }
  }

  submit() {
    if (this.linear) {
      this._markCurrentAsDone();
    }
  }

  setNewActiveStep(index: number) {
    const currentStep = this._activeStep;
    const currentStepIndex = this._activeStepIndex;
    const newStep = this._getStepByIndex(index);
    const newStepIndex = this.steps
      .toArray()
      .findIndex((step: MdbStepComponent) => step === newStep);

    if (this.linear && !this._isNewStepLinear(index)) {
      return;
    }

    if (newStepIndex < this._activeStepIndex && !newStep.editable) {
      return;
    }

    this._removeStepValidationClasses(newStep);

    if (this.linear && index > this.activeStepIndex) {
      if (this._isStepValid(this._activeStep)) {
        this._markCurrentAsDone();
        this._removeCurrentActiveStep();
        this._setActiveStep(index);
      } else {
        this._markCurrentAsWrong();
        this._markStepControlsAsDirty(this._activeStep);
      }
    } else {
      if (index < this.activeStepIndex) {
        this._removeStepValidationClasses(this._activeStep);
      }

      this._removeCurrentActiveStep();
      this._setActiveStep(index);
    }

    this.stepChange.emit({
      activeStep: newStep,
      activeStepIndex: newStepIndex,
      previousStep: currentStep,
      previousStepIndex: currentStepIndex,
    });
  }

  private _markCurrentAsDone() {
    this._activeStep.isDone = true;
    this._activeStep.isWrong = false;
  }

  private _markCurrentAsWrong() {
    this._activeStep.isWrong = true;
    this._activeStep.isDone = false;
  }

  private _markStepControlsAsDirty(step: MdbStepComponent) {
    const controls = step.stepForm.controls;
    if (step.stepForm.controls) {
      const keys = Object.keys(controls);
      for (let i = 0; i < keys.length; i++) {
        const control = controls[keys[i]];

        if (control instanceof FormControl) {
          control.markAsTouched();
        }
      }
    }
  }

  private _removeStepValidationClasses(step: MdbStepComponent) {
    step.isDone = false;
    step.isWrong = false;
  }

  private _isNewStepLinear(newStepIndex: number) {
    return this.activeStepIndex - newStepIndex === 1 || this.activeStepIndex - newStepIndex === -1;
  }

  private _setActiveStep(index: number) {
    this.steps.toArray()[index].isActive = true;
    this._updateHorizontalStepperHeight(index);
    this.activeStepIndex = index;
    this._activeStep = this._getStepByIndex(this.activeStepIndex);
  }

  private _removeCurrentActiveStep() {
    const currentActiveStep = this.steps.find(activeStep => activeStep.isActive);
    if (currentActiveStep) {
      currentActiveStep.isActive = false;
    }
  }

  resetAll() {
    this.steps.forEach((step: MdbStepComponent) => {
      step.reset();
      this._setActiveStep(0);
    });
  }

  private _updateHorizontalStepperHeight(index: number, height?: number) {
    if (this.horizontal && !this.vertical) {
      setTimeout(() => {
        const stepHeight = height
          ? height + 50
          : this.stepContents.toArray()[index].nativeElement.scrollHeight + 50;
        this._renderer.setStyle(this.container.nativeElement, 'height', stepHeight + 'px');
      }, 0);
    } else {
      this._renderer.removeStyle(this.container.nativeElement, 'height');
    }
  }

  private _initStepperVariation() {
    if (this.isBrowser) {
      if (this.vertical) {
        setTimeout(() => {
          this.horizontal = false;
          this._renderer.removeStyle(this.container.nativeElement, 'height');
        }, 0);
      }
    }
  }

  ngAfterViewInit() {
    this._initStepperVariation();
  }

  ngAfterContentInit() {
    this._setActiveStep(0);
    this.stepChange$ = from(this.steps.toArray());
    this.getStepChange$()
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroy)
      )
      .subscribe(() => {
        if (this.container.nativeElement.children[this.activeStepIndex]) {
          const stepElContent = this.container.nativeElement.children[this._activeStepIndex]
            .lastElementChild;
          this._updateHorizontalStepperHeight(this.activeStepIndex, stepElContent.clientHeight);
        }
      });
  }

  ngAfterContentChecked() {
    if (this.stepContents) {
      const activeStep = this.stepContents
        .filter((el: any, index: number) => el && index === this.activeStepIndex)
        .map((el: any) => el.nativeElement)[0];
      if (activeStep.innerHTMl !== this.stepTextContent) {
        this.stepChangeSubject.next(activeStep.innerHTML);
      }
      this.stepTextContent = activeStep.innerHTML;
    }
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }
}
