import { Meeting } from './../models/meeting';
import { Injectable } from '@angular/core';
import { sp, Web } from '@pnp/sp';
import { Slot } from '../models/slot';
import * as ics from 'ics';
import { Invitee } from '../models/invitee';

@Injectable({
  providedIn: 'root'
})
export class MeetingProposalService {
  private web: Web;

  constructor(web: Web) {
    if (!web) {
      web = sp.web;
    }
    this.web = web;
  }

  async createMeetingProposal(meeting: Meeting): Promise<Meeting> {
    if (!meeting.Title) {
      throw new Error('Title is missing');
    } else if (meeting.Title.length > 255) {
      throw new Error('Title is too long');
    } else if (meeting.Invitees.length === 0) {
      throw new Error('Invitees are missing');
    } else if (meeting.Slots.length === 0) {
      throw new Error('Slots are missing');
    }

    const createdMeeting = await this.web.lists.getByTitle('MeetingProposals').items.add({
      Title: meeting.Title,
      Description: meeting.Description,
      CreatorEmail: meeting.Creator.EMail,
      InviteesEmail: meeting.Invitees.map(invitee => invitee.EMail).join(';#'),
      Slots: JSON.stringify(meeting.Slots),
    });

    return { Id: createdMeeting.data.ID, ...meeting };
  }

  async getMeetingProposalById(id: number): Promise<Meeting> {
    const result = await this.web.lists.getByTitle('MeetingProposals').items.getById(id).get();
    const inviteesEmail = result.InviteesEmail ? result.InviteesEmail.split(';#') : [];
    const slots = result.Slots ? JSON.parse(result.Slots) : [];

    return {
      Id: result.ID,
      Title: result.Title,
      Description: result.Description,
      Creator: {
        Title: result.Author.Title,
        EMail: result.CreatorEmail,
      },
      Invitees: inviteesEmail.map((email: any) => ({ Title: email.split('@')[0], EMail: email })),
      Slots: slots.map((slot: Slot) => ({
        date: slot.date,
        start: slot.start,
        end: slot.end,
        available: slot.available,
        selected: slot.selected,
        invitees: slot.invitees,
      })),
      Status: result.Status,
      SelectedSlot: result.SelectedSlot ? {
        date: result.SelectedSlot.date,
        start: result.SelectedSlot.start,
        end: result.SelectedSlot.end,
      } : undefined,
    };
  }

  async updateMeetingProposal(meeting: Meeting): Promise<Meeting> {
    if (!meeting.Title) {
      throw new Error('Title is missing');
    } else if (meeting.Title.length > 255) {
      throw new Error('Title is too long');
    } else if (meeting.Invitees.length === 0) {
      throw new Error('Invitees are missing');
    } else if (meeting.Slots.length === 0) {
      throw new Error('Slots are missing');
    }

    await this.web.lists.getByTitle('MeetingProposals').items.getById(meeting.Id!).update({
      Title: meeting.Title,
      Description: meeting.Description,
      CreatorEmail: meeting.Creator.EMail,
      InviteesEmail: meeting.Invitees.map(invitee => invitee.EMail).join(';#'),
      Slots: JSON.stringify(meeting.Slots),
      Status: meeting.Status,
      SelectedSlot: meeting.SelectedSlot ? {
        date: meeting.SelectedSlot.date,
        start: meeting.SelectedSlot.start,
        end: meeting.SelectedSlot.end,
      } : null,
    });

    return meeting;
  }

  deleteMeetingProposal(id: number): Promise<any> {
    return sp.web.lists.getByTitle('MeetingProposals').items.getById(id).delete();
  }

  getMeetingProposals(): Promise<any[]> {
    return sp.web.lists.getByTitle('MeetingProposals').items.select('Id,Title,Description,Invitees,Slots,Creator/Id,Creator/Title,Editor/Id,Editor/Title,Created,Modified').expand('Creator,Editor').get();
  }

  getMeetingProposal(id: number): Promise<any> {
    return sp.web.lists.getByTitle('MeetingProposals').items.getById(id).select('Id,Title,Description,Invitees,Slots,Creator/Id,Creator/Title,Editor/Id,Editor/Title,Created,Modified').expand('Creator,Editor').get();
  }

  public async getMeetingProposalICS(meeting: Meeting): Promise<string> {
    const attendees = meeting.Invitees.map((invitee: any) => {
      return { name: invitee.title, email: invitee.email };
    });

    let startDates: ics.DateArray = [0, 0, 0];
    let endDates: ics.DateArray = [0, 0, 0];
    meeting.Slots.forEach((slot) => {
      if (slot.selected) {
        const [year, month, day] = slot.date.split('-').map((x) => parseInt(x));
        const [hour, minute] = slot.start.split(':').map((x) => parseInt(x));
        startDates = [year, month - 1, day, hour, minute];
        const [endHour, endMinute] = slot.end.split(':').map((x) => parseInt(x));
        endDates = [year, month - 1, day, endHour, endMinute];
      }
    });

    if(!startDates || !endDates) {
      throw Error('no valid dates');
    }
    const event: ics.EventAttributes = {
      start: startDates,
      end: endDates,
      title: meeting.Title,
      description: meeting.Description,
      location: '',
      url: '',
      categories: ['Meeting'],
      organizer: { name: '', email: '' },
      attendees,
    };

    const { error, value } = ics.createEvent(event);
    if (error) {
      console.error('Error creating ICS file:', error);
      return '';
    } else {
      if(value)
        return value;
    }
  }

  public async sendMeetingProposalEmail(meeting: Meeting, icsFile: string): Promise<void> {
    const subject = `Meeting Proposal: ${meeting.Title}`;
    const emailProperties: any = {
      To: [meeting.Creator.EMail],
      Subject: subject,
      Body: `Please find attached the meeting invitation.`,
      Attachments: {
        name: `${subject}.ics`,
        content: icsFile,
      },
    };
    await sp.utility.sendEmail(emailProperties);
  }
}
