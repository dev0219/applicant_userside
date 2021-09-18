import { Component, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mdb-card-rotating, mdb-flipping-card',
  templateUrl: 'card-rotating.component.html',
  styleUrls: ['./animated-cards-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CardRotatingComponent {
  public rotate = false;
  ANIMATION_TRANSITION_TIME = 1000;
  @Output() animationStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() animationEnd: EventEmitter<any> = new EventEmitter<any>();

  toggle() {
    this.rotate = !this.rotate;
    this.animationStart.emit();

    setTimeout(() => {
      this.animationEnd.emit();
    }, this.ANIMATION_TRANSITION_TIME);
  }
}
