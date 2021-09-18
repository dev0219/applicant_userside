import {
  ElementRef,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  ViewEncapsulation,
  Component,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { MDBUploaderService, UploadOutput } from '../classes/mdb-uploader.class';
import { UploaderOptions } from '../classes/mdb-uploader.class';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[mdbFileSelect]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./../file-input-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class MDBFileSelectDirective implements OnInit, OnDestroy {
  @Input() uploadInput: EventEmitter<any>;
  @Input() options: UploaderOptions;
  @Output() uploadOutput: EventEmitter<UploadOutput>;

  upload: MDBUploaderService;
  isServer: boolean = isPlatformServer(this.platform_id);
  // el: HTMLInputElement;
  el: HTMLInputElement | any;

  constructor(@Inject(PLATFORM_ID) private platform_id: any, private elementRef: ElementRef) {
    this.uploadOutput = new EventEmitter<UploadOutput>();
  }

  ngOnInit() {
    if (this.isServer) {
      return;
    }

    const concurrency = (this.options && this.options.concurrency) || Number.POSITIVE_INFINITY;
    const allowedContentTypes = (this.options && this.options.allowedContentTypes) || ['*'];
    const maxUploads = (this.options && this.options.maxUploads) || Number.POSITIVE_INFINITY;
    this.upload = new MDBUploaderService(concurrency, allowedContentTypes, maxUploads);

    this.el = this.elementRef.nativeElement;
    this.el.addEventListener('change', this.fileListener, false);

    this.upload.serviceEvents.subscribe((event: UploadOutput) => {
      this.uploadOutput.emit(event);
    });

    if (this.uploadInput instanceof EventEmitter) {
      this.upload.initInputEvents(this.uploadInput);
    }
  }

  ngOnDestroy() {
    if (this.isServer) {
      return;
    }

    if (this.el) {
      this.el.removeEventListener('change', this.fileListener, false);
    }

    if (this.uploadInput) {
      this.uploadInput.unsubscribe();
    }
  }

  fileListener = () => {
    this.upload.handleFiles(this.el.files);
  };
}
