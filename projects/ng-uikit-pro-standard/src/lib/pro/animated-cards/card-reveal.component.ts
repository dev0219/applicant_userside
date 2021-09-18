import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { socialsState } from '../animations/animations.component';

@Component({
  selector: 'mdb-card-reveal',
  templateUrl: 'card-reveal.component.html',
  styleUrls: ['./animated-cards-module.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [socialsState],
})
export class CardRevealComponent {
  @ViewChild('cardReveal', { static: false }) cardReveal: ElementRef;
  @ViewChild('cardFront', { static: true }) cardFront: ElementRef;
  @ViewChild('cardOverflow', { static: true }) cardOverflow: ElementRef;
  public socials: any;
  public show: boolean;

  @HostListener('window:resize')
  onWindowResize() {
    if (this.cardOverflow && this.cardFront && this.cardReveal) {
      const height = this.cardFront.nativeElement.offsetHeight;
      this._r.setStyle(this.cardOverflow.nativeElement, 'height', height + 'px');
      this._r.setStyle(this.cardReveal.nativeElement.firstElementChild, 'height', height + 'px');
    }
  }

  constructor(private _r: Renderer2) {}
  toggle() {
    this.show = !this.show;
    this.socials = this.socials === 'active' ? 'inactive' : 'active';
    setTimeout(() => {
      const height = this.cardFront.nativeElement.offsetHeight;
      this._r.setStyle(this.cardOverflow.nativeElement, 'height', height + 'px');

      if (this.cardReveal) {
        this._r.setStyle(this.cardReveal.nativeElement.firstElementChild, 'height', height + 'px');
      }
    }, 0);
  }
}
