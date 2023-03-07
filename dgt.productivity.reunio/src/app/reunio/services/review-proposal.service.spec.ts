import { TestBed } from '@angular/core/testing';

import { ReviewProposalService } from './review-proposal.service';

describe('ReviewProposalService', () => {
  let service: ReviewProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewProposalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
