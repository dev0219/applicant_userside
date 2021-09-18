import { Injectable, QueryList } from '@angular/core';
import { ScrollSpyLinkDirective } from './scroll-spy-link.directive';
import { Subject, Observable } from 'rxjs';

export interface ScrollSpy {
  id: string;
  links: QueryList<ScrollSpyLinkDirective>;
}

@Injectable()
export class ScrollSpyService {
  private scrollSpys: ScrollSpy[] = [];

  private activeSubject = new Subject<ScrollSpyLinkDirective>();
  active$: Observable<any> = this.activeSubject;

  addScrollSpy(scrollSpy: ScrollSpy) {
    this.scrollSpys.push(scrollSpy);
  }

  removeScrollSpy(scrollSpyId: string) {
    const scrollSpyIndex = this.scrollSpys.findIndex( (spy) => {
      return spy.id === scrollSpyId;
    });
    this.scrollSpys.splice(scrollSpyIndex, 1);
  }

  updateActiveState(scrollSpyId: string, activeLinkId: string) {
    const scrollSpy = this.scrollSpys.find(spy => {
      return spy.id === scrollSpyId;
    });

    if (!scrollSpy) {
      return;
    }

    const activeLink = scrollSpy.links.find(link => {
      return link.id === activeLinkId;
    });

    this.setActiveLink(activeLink);
  }

  removeActiveState(scrollSpyId: string, activeLinkId: string) {
    const scrollSpy = this.scrollSpys.find(spy => {
      return spy.id === scrollSpyId;
    });

    if (!scrollSpy) {
      return;
    }

    const activeLink = scrollSpy.links.find(link => {
      return link.id === activeLinkId;
    });

    if (!activeLink) {
      return;
    }

    activeLink.active = false;
    activeLink.detectChanges();
  }

  setActiveLink(activeLink: ScrollSpyLinkDirective | any) {
    if (activeLink) {
      activeLink.active = true;
      activeLink.detectChanges();
      this.activeSubject.next(activeLink);
    }
  }

  removeActiveLinks(scrollSpyId: string) {
    const scrollSpy: ScrollSpy | undefined = this.scrollSpys.find(spy => {
      return spy.id === scrollSpyId;
    });

    if (!scrollSpy) {
      return;
    }

    scrollSpy.links.forEach(link => {
      link.active = false;
      link.detectChanges();
    });
  }
}
