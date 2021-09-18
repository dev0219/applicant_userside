import { OnInit, Directive, ElementRef, Renderer2, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[mdbCharCounter]'
})


export class CharCounterDirective implements OnInit {

  @Input() public length = 20;
  public textContainer: any;

  constructor(private _elRef: ElementRef, private _renderer: Renderer2) {}

  ngOnInit() {
    // Inititalise a new <span> element for the count display and render it below the host component.
    this.textContainer =  this._renderer.createElement('p');
    this._renderer.appendChild(this._elRef.nativeElement.parentElement, this.textContainer);
    this._renderer.addClass(this.textContainer, 'chars');
    this.textContainer.innerHTML = '0/' + this.length;
    this._renderer.setStyle(this.textContainer, 'display', 'none');
  }


  @HostListener('input') onKeyUp() {
     this.textContainer.innerHTML = this._elRef.nativeElement.value.length + '/' + this.length;

     if (this._elRef.nativeElement.value.length > this.length) {
       this._renderer.addClass(this._elRef.nativeElement, 'invalid');
     } else {
      this._renderer.removeClass(this._elRef.nativeElement, 'invalid');
     }
  }

  @HostListener('blur') hide() {
    this._renderer.setStyle(this.textContainer, 'display', 'none');
  }

  @HostListener('focus') show() {
    this.onKeyUp();
    this._renderer.setStyle(this.textContainer, 'display', 'block');
  }

}
