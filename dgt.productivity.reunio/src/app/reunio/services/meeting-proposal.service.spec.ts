import { TestBed } from '@angular/core/testing';
import { Web } from '@pnp/sp';

import { MeetingProposalService } from './meeting-proposal.service';

describe('MeetingProposalService', () => {
  let service: MeetingProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingProposalService);
    const web = new Web('', '');
    service = new MeetingProposalService(web);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw an error if title is missing', async () => {
      const meeting = {
        Title: '',
        Description: 'A test meeting proposal',
        Creator: { Title: 'John Doe', EMail: 'johndoe@example.com' },
        Invitees: [
          { Title: 'Jane Doe', EMail: 'janedoe@example.com' },
          { Title: 'Bob Smith', EMail: 'bobsmith@example.com' },
        ],
        Slots: [
          { date: '2022-01-01', start: '08:00', end: '09:00', available: true, selected: true, invitees: [] },
        ],
      };
      await expectAsync(service.createMeetingProposal(meeting)).toBeRejectedWithError('Title is missing');
    });

    it('should throw an error if title is too long', async () => {
      const meeting = {
        Title: 'A'.repeat(256),
        Description: 'A test meeting proposal',
        Creator: { Title: 'John Doe', EMail: 'johndoe@example.com' },
        Invitees: [
          { Title: 'Jane Doe', EMail: 'janedoe@example.com' },
          { Title: 'Bob Smith', EMail: 'bobsmith@example.com' },
        ],
        Slots: [
          {
            date: '2022-01-01',
            start: '08:00',
            end: '09:00',
            available: true,
            selected: true,
            invitees: [],
          },
        ],
      };
      await expectAsync(service.createMeetingProposal(meeting)).toBeRejectedWithError('Title is too long');
    });

    it('should throw an error if invitees is missing', async () => {
      const meeting = {
        Title: 'Test Meeting',
        Description: 'A test meeting proposal',
        Creator: { Title: 'John Doe', EMail: 'johndoe@example.com' },
        Invitees: [],
        Slots: [
          { date: '2022-01-01', start: '08:00', end: '09:00', available: true, selected: true, invitees: [] },
        ],
      };
      await expectAsync(service.createMeetingProposal(meeting)).toBeRejectedWithError('Invitees are missing');
    });

    it('should throw an error if slots is missing', async () => {
      const meeting = {
        Title: 'Test Meeting',
        Description: 'A test meeting proposal',
        Creator: { Title: 'John Doe', EMail: 'johndoe@example.com' },
        Invitees: [
          { Title: 'Jane Doe', EMail: 'janedoe@example.com' },
          { Title: 'Bob Smith', EMail: 'bobsmith@example.com' },
        ],
        Slots: [],
      };
      await expectAsync(service.createMeetingProposal(meeting)).toBeRejectedWithError('Slots are missing');
    });

    it('should create a meeting proposal', async () => {
      const meeting = {
        Title: 'Test Meeting',
        Creator: { Title: 'John Doe', EMail: 'johndoe@example.com' },
        Invitees : [
          { Title: 'Jane Doe', EMail: 'janedoe@example.com' },
          { Title: 'Bob Smith', EMail: 'bobsmith@example.com' },
        ],
        Slots: [
          { date: '2022-01-01', start: '08:00', end: '09:00', available: true, selected: true, invitees: [] },
        ],
      };
      const result = await service.createMeetingProposal(meeting);
      expect(result).toBeDefined();
      expect(result.Id).toBeDefined();
      expect(result.Title).toBe(meeting.Title);
      expect(result.Description).toBe(undefined);
      expect(result.Creator).toBeDefined();
      expect(result.Creator.Title).toBe(meeting.Creator.Title);
      expect(result.Creator.EMail).toBe(meeting.Creator.EMail);
      expect(result.Invitees).toBeDefined();
      expect(result.Invitees.length).toBe(meeting.Invitees.length);
      expect(result.Slots).toBeDefined();
      expect(result.Slots.length).toBe(meeting.Slots.length);
    });
});
