import { Injectable, Injector, ComponentRef, Inject, SecurityContext } from '@angular/core';
import { Observable } from 'rxjs';

import { Overlay } from '../overlay/overlay';
import { ComponentPortal } from '../portal/portal';
import { GlobalConfig, IndividualConfig, ToastPackage, tsConfig } from './toast.config';
import { ToastInjector } from './toast.injector';
import { ToastContainerDirective } from './toast.directive';
import { TOAST_CONFIG } from './toast.token';
import { ToastComponent } from './toast.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastRef } from './toast-ref';

export interface ActiveToast {
  toastId?: number;
  message?: string;
  portal?: ComponentRef<any>;
  toastRef?: ToastRef<any>;
  onShown?: Observable<any>;
  onHidden?: Observable<any>;
  onTap?: Observable<any>;
  onAction?: Observable<any>;
}

@Injectable()
export class ToastService {
  index = 0;
  previousToastMessage = '';
  currentlyActive = 0;
  toasts: ActiveToast[] = [];
  overlayContainer: ToastContainerDirective;

  constructor(
    // @Inject(TOAST_CONFIG) public toastConfig: GlobalConfig,
    @Inject(TOAST_CONFIG) public toastConfig: GlobalConfig | any,
    private overlay: Overlay,
    private _injector: Injector,
    private sanitizer: DomSanitizer
  ) {
    tsConfig.serviceInstance = this;

    function use<T>(source: T, defaultValue: T): T {
      return toastConfig && source !== undefined ? source : defaultValue;
    }

    this.toastConfig = this.applyConfig(toastConfig);
    // Global
    this.toastConfig.maxOpened = use(this.toastConfig.maxOpened, 0);
    this.toastConfig.autoDismiss = use(this.toastConfig.autoDismiss, false);
    this.toastConfig.newestOnTop = use(this.toastConfig.newestOnTop, true);
    this.toastConfig.preventDuplicates = use(this.toastConfig.preventDuplicates, false);
    this.toastConfig.opacity = use(this.toastConfig.opacity, 0.5);
    if (!this.toastConfig.iconClasses) {
      this.toastConfig.iconClasses = {};
    }
    this.toastConfig.iconClasses.error = this.toastConfig.iconClasses.error || 'md-toast-error';
    this.toastConfig.iconClasses.info = this.toastConfig.iconClasses.info || 'md-toast-info';
    this.toastConfig.iconClasses.success =
      this.toastConfig.iconClasses.success || 'md-toast-success';
    this.toastConfig.iconClasses.warning =
      this.toastConfig.iconClasses.warning || 'md-toast-warning';

    // Individual
    this.toastConfig.timeOut = use(this.toastConfig.timeOut, 5000);
    this.toastConfig.closeButton = use(this.toastConfig.closeButton, false);
    this.toastConfig.extendedTimeOut = use(this.toastConfig.extendedTimeOut, 1000);
    this.toastConfig.progressBar = use(this.toastConfig.progressBar, false);
    this.toastConfig.enableHtml = use(this.toastConfig.enableHtml, false);
    this.toastConfig.toastClass = use(this.toastConfig.toastClass, 'md-toast');
    this.toastConfig.positionClass = use(this.toastConfig.positionClass, 'md-toast-top-right');
    this.toastConfig.titleClass = use(this.toastConfig.titleClass, 'md-toast-title');
    this.toastConfig.messageClass = use(this.toastConfig.messageClass, 'md-toast-message');
    this.toastConfig.tapToDismiss = use(this.toastConfig.tapToDismiss, true);
    this.toastConfig.toastComponent = use(this.toastConfig.toastComponent, ToastComponent);
    this.toastConfig.onActivateTick = use(this.toastConfig.onActivateTick, false);
    this.toastConfig.actionButton = use(this.toastConfig.actionButton, '');
    this.toastConfig.actionButtonClass = use(this.toastConfig.actionButtonClass, '');
    this.toastConfig.opacity = use(this.toastConfig.opacity, 0.5);
  }

  /** show successful toast */
  // show(message: string, title?: string, override?: IndividualConfig, type = '') {
  show(message: string, title?: string | any, override?: IndividualConfig, type = '') {
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  /** show successful toast */
  // success(message: string, title?: string, override?: IndividualConfig) {
  success(message: string, title?: string | any, override?: IndividualConfig) {
    //   const type = this.toastConfig.iconClasses.success;
    const type: any = this.toastConfig.iconClasses.success;
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  /** show error toast */
  // error(message: string, title?: string, override?: IndividualConfig) {
  error(message: string, title?: string | any, override?: IndividualConfig) {
    //   const type = this.toastConfig.iconClasses.error;
    const type: any = this.toastConfig.iconClasses.error;
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  /** show info toast */
  // info(message: string, title?: string, override?: IndividualConfig) {
  info(message: string, title?: string | any, override?: IndividualConfig) {
    //   const type = this.toastConfig.iconClasses.info;
    const type: any = this.toastConfig.iconClasses.info;
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  /** show warning toast */
  // warning(message: string, title?: string, override?: IndividualConfig) {
  warning(message: string, title?: string | any, override?: IndividualConfig) {
    //   const type = this.toastConfig.iconClasses.warning;
    const type: any = this.toastConfig.iconClasses.warning;
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  /**
   * Remove all or a single toast by id
   */
  clear(toastId?: number) {
    // Call every toastRef manualClose function
    let toast: any;
    for (toast of this.toasts) {
      if (toastId !== undefined) {
        if (toast.toastId === toastId) {
          toast.toastRef.manualClose();
          return;
        }
      } else {
        toast.toastRef.manualClose();
      }
    }
  }

  /**
   * Remove and destroy a single toast by id
   */
  remove(toastId: number) {
    // const found = this._findToast(toastId);
    const found: any = this._findToast(toastId);
    if (!found) {
      return false;
    }
    found.activeToast.toastRef.close();
    this.toasts.splice(found.index, 1);
    this.currentlyActive = this.currentlyActive - 1;
    if (!this.toastConfig.maxOpened || !this.toasts.length) {
      return false;
    }
    if (this.currentlyActive <= +this.toastConfig.maxOpened && this.toasts[this.currentlyActive]) {
      // const p = this.toasts[this.currentlyActive].toastRef;
      const p: any = this.toasts[this.currentlyActive].toastRef;
      if (!p.isInactive()) {
        this.currentlyActive = this.currentlyActive + 1;
        p.activate();
      }
    }
    return true;
  }

  /**
   * Determines if toast message is already shown
   */
  isDuplicate(message: string) {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].message === message) {
        return true;
      }
    }
    return false;
  }

  /** create a clone of global config and apply individual settings */
  private applyConfig(override: IndividualConfig = {}): GlobalConfig {
    function use<T>(source: T, defaultValue: T): T {
      return override && source !== undefined ? source : defaultValue;
    }

    const current: GlobalConfig = { ...this.toastConfig };
    current.closeButton = use(override.closeButton, current.closeButton);
    current.extendedTimeOut = use(override.extendedTimeOut, current.extendedTimeOut);
    current.progressBar = use(override.progressBar, current.progressBar);
    current.timeOut = use(override.timeOut, current.timeOut);
    current.enableHtml = use(override.enableHtml, current.enableHtml);
    current.toastClass = use(override.toastClass, current.toastClass);
    current.positionClass = use(override.positionClass, current.positionClass);
    current.titleClass = use(override.titleClass, current.titleClass);
    current.messageClass = use(override.messageClass, current.messageClass);
    current.tapToDismiss = use(override.tapToDismiss, current.tapToDismiss);
    current.toastComponent = use(override.toastComponent, current.toastComponent);
    current.onActivateTick = use(override.onActivateTick, current.onActivateTick);
    current.actionButton = use(override.actionButton, current.actionButton);
    current.actionButtonClass = use(override.actionButtonClass, current.actionButtonClass);
    current.opacity = use(override.opacity, current.opacity);
    return current;
  }

  /**
   * Find toast object by id
   */
  private _findToast(toastId: number): { index: number; activeToast: ActiveToast } | null {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].toastId === toastId) {
        return { index: i, activeToast: this.toasts[i] };
      }
    }
    return null;
  }

  /**
   * Creates and attaches toast data to component
   * returns null if toast is duplicate and preventDuplicates == True
   */
  private _buildNotification(
    toastType: string,
    message: string,
    title: string,
    config: GlobalConfig
  ): ActiveToast | null | any {
    // max opened and auto dismiss = true
    if (this.toastConfig.preventDuplicates && this.isDuplicate(message)) {
      return null;
    }
    this.previousToastMessage = message;
    let keepInactive = false;
    if (this.toastConfig.maxOpened && this.currentlyActive >= this.toastConfig.maxOpened) {
      keepInactive = true;
      if (this.toastConfig.autoDismiss) {
        this.clear(this.toasts[this.toasts.length - 1].toastId);
      }
    }
    const overlayRef = this.overlay.create(config.positionClass, this.overlayContainer);
    this.index = this.index + 1;
    // let sanitizedMessage = message;
    let sanitizedMessage: any = message;
    if (message && config.enableHtml) {
      sanitizedMessage = this.sanitizer.sanitize(SecurityContext.HTML, message);
    }
    const toastRef = new ToastRef(overlayRef);
    const toastPackage = new ToastPackage(
      this.index,
      config,
      sanitizedMessage,
      title,
      toastType,
      toastRef
    );
    // const ins: ActiveToast = {
    const ins: ActiveToast | any = {
      toastId: this.index,
      message,
      toastRef,
      onShown: toastRef.afterActivate(),
      onHidden: toastRef.afterClosed(),
      onTap: toastPackage.onTap(),
      onAction: toastPackage.onAction(),
    };
    const toastInjector = new ToastInjector(toastPackage, this._injector);
    const component = new ComponentPortal(config.toastComponent, toastInjector);
    ins.portal = overlayRef.attach(component, this.toastConfig.newestOnTop);
    if (!keepInactive) {
      setTimeout(() => {
        ins.toastRef.activate();
        this.currentlyActive = this.currentlyActive + 1;
      });
    }
    this.toasts.push(ins);
    return ins;
  }
}
