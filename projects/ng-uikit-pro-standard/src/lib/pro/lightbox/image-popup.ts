import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var screenfull: any;

@Component({
  selector: 'mdb-image-modal',
  templateUrl: 'image-popup.html',
  styleUrls: ['./lightbox-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImageModalComponent implements OnInit, AfterViewInit {
  public _element: any;
  public opened = false;
  public imgSrc: string;
  public currentImageIndex: number;
  public loading = false;
  public showRepeat = false;
  public openModalWindow: any;
  public caption: string;

  isMobile: any = null;
  clicked: any = false;
  isBrowser: any = false;
  zoomed = 'inactive';

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  @Input() modalImages: any;
  @Input() imagePointer: number;
  @Input() fullscreen: boolean;
  @Input() zoom: boolean;
  @Input() smooth = true;
  @Input() type: String;

  @ViewChild('galleryImg', { static: false }) galleryImg: ElementRef;
  @ViewChild('galleryDescription', { static: false }) galleryDescription: ElementRef;

  @Output() cancelEvent = new EventEmitter<any>();

  constructor(
    @Inject(PLATFORM_ID) platformId: string,
    public element: ElementRef,
    public renderer: Renderer2
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._element = this.element.nativeElement;
    if (this.isBrowser) {
      this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }
  }

  toggleZoomed() {
    if (!this.clicked) {
      this.renderer.setStyle(this.galleryImg.nativeElement, 'transform', 'scale(1.0, 1.0)');
      this.renderer.setStyle(this.galleryImg.nativeElement, 'animate', '300ms ease-out');
      this.renderer.setStyle(this.galleryImg.nativeElement, 'cursor', 'zoom-out');
      this.clicked = true;
    } else if (this.clicked) {
      this.renderer.setStyle(this.galleryImg.nativeElement, 'transform', 'scale(0.9, 0.9)');
      this.renderer.setStyle(this.galleryImg.nativeElement, 'animate', '300ms ease-in');
      this.renderer.setStyle(this.galleryImg.nativeElement, 'cursor', 'zoom-in');
      this.clicked = false;
    }
  }

  toggleRestart() {
    this.zoomed = this.zoomed === 'inactive' ? 'active' : 'inactive';
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.loading = true;
    if (this.imagePointer >= 0) {
      this.showRepeat = false;
      this.openGallery(this.imagePointer);
    } else {
      this.showRepeat = true;
    }
  }

  closeGallery() {
    this.zoom = false;
    if (screenfull.enabled) {
      screenfull.exit();
    }
    this.opened = false;
    this.cancelEvent.emit(null);
  }

  prevImage() {
    this.loading = true;
    this.currentImageIndex--;
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.modalImages.length - 1;
    }
    this.openGallery(this.currentImageIndex);
  }

  nextImage() {
    this.loading = true;
    this.currentImageIndex++;
    if (this.modalImages.length === this.currentImageIndex) {
      this.currentImageIndex = 0;
    }
    this.openGallery(this.currentImageIndex);
  }

  openGallery(index: any) {
    if (!index) {
      this.currentImageIndex = 1;
    }

    this.currentImageIndex = index;
    this.opened = true;
    for (let i = 0; i < this.modalImages.length; i++) {
      if (i === this.currentImageIndex) {
        this.imgSrc = this.modalImages[i].img;
        this.caption = this.modalImages[i].caption;
        this.loading = false;
        break;
      }
    }
    setTimeout(() => {
      if (this.galleryDescription) {
        const descriptionHeight = this.galleryDescription.nativeElement.clientHeight;
        this.renderer.setStyle(
          this.galleryImg.nativeElement,
          'max-height',
          `calc(100% - ${descriptionHeight + 25}px)`
        );
      }
    }, 0);
  }

  fullScreen(): any {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }

  get is_iPhone_or_iPod() {
    if (this.isBrowser) {
      if (navigator && navigator.userAgent && navigator.userAgent != null) {
        const strUserAgent = navigator.userAgent.toLowerCase();
        const arrMatches = strUserAgent.match(/ipad/);
        if (arrMatches != null) {
          return true;
        }
      }
      return false;
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyboardControl(event: KeyboardEvent) {
    if (this.opened) {
      // tslint:disable-next-line: deprecation
      if (event.keyCode === 39) {
        this.nextImage();
      }
      // tslint:disable-next-line: deprecation
      if (event.keyCode === 37) {
        this.prevImage();
      }
      // tslint:disable-next-line: deprecation
      if (event.keyCode === 27) {
        this.closeGallery();
      }
    }
  }

  swipe(action: String = this.SWIPE_ACTION.RIGHT) {
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.prevImage();
    }

    if (action === this.SWIPE_ACTION.LEFT) {
      this.nextImage();
    }
  }
}
