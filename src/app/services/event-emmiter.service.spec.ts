import { TestBed } from '@angular/core/testing';

import { EventEmmiterService } from './event-emmiter.service';

describe('EventEmmiterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventEmmiterService = TestBed.get(EventEmmiterService);
    expect(service).toBeTruthy();
  });
});
