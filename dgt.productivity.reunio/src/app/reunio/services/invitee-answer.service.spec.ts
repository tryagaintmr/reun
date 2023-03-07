import { TestBed } from '@angular/core/testing';

import { InviteeAnswerService } from './invitee-answer.service';

describe('InviteeAnswerService', () => {
  let service: InviteeAnswerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InviteeAnswerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
