import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import {
  MDBUploaderService,
  UploaderOptions,
  UploadInput,
  UploadOutput,
} from '../classes/mdb-uploader.class';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[mdbFileDrop]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./../file-input-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class MDBFileDropDirective implements OnInit, OnDestroy {
  @Input() uploadInput: EventEmitter<UploadInput>;
  @Input() options: UploaderOptions;
  @Output() uploadOutput: EventEmitter<UploadOutput>;

  upload: MDBUploaderService;
  isServer: boolean = isPlatformServer(this.platform_id);
  el: HTMLInputElement;

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

    this.upload.serviceEvents.subscribe((event: UploadOutput) => {
      this.uploadOutput.emit(event);
    });

    if (this.uploadInput instanceof EventEmitter) {
      this.upload.initInputEvents(this.uploadInput);
    }

    this.el.addEventListener('drop', this.stopEvent, false);
    this.el.addEventListener('dragenter', this.stopEvent, false);
    this.el.addEventListener('dragover', this.stopEvent, false);
    this.el.addEventListener('dragover', this.stopEvent, false);
  }

  ngOnDestroy() {
    if (this.isServer) {
      return;
    }

    if (this.uploadInput) {
      this.uploadInput.unsubscribe();
    }
  }

  stopEvent = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  };

  @HostListener('drop', ['$event'])
  public onDrop(e: any) {
    e.stopPropagation();
    e.preventDefault();

    const event: UploadOutput = { type: 'drop' };
    this.uploadOutput.emit(event);
    this.upload.handleFiles(e.dataTransfer.files);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(e: Event) {
    if (!e) {
      return;
    }

    const event: UploadOutput = { type: 'dragOver' };
    this.uploadOutput.emit(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(e: Event) {
    if (!e) {
      return;
    }

    const event: UploadOutput = { type: 'dragOut' };
    this.uploadOutput.emit(event);
  }
}
