import { Injectable } from '@angular/core';
import { sp } from '@pnp/sp';
import { Invitee } from '../models/invitee';

@Injectable({
  providedIn: 'root'
})
export class InviteeAnswerService {

  constructor() { }

  getInviteeAnswers(id: number): Promise<any[]> {
    return sp.web.lists.getByTitle('InviteesAnswers').items.filter(`ProposalId eq ${id}`).select('Id,ProposalId,Invitee,Answer,Slot').get();
  }
  createInviteeAnswer(proposalId: number, invitee: string, answer: boolean, slot: string): Promise<any> {
    return sp.web.lists.getByTitle('InviteesAnswers').items.add({
      ProposalId: proposalId,
      Invitee: invitee,
      Answer: answer,
      Slot: slot,
    });
  }

  public async updateInviteeAnswer(
    meetingId: number,
    invitee: Invitee,
    answer: boolean[],
  ): Promise<void> {
    const meetingList = sp.web.lists.getByTitle('MeetingProposals');
    const meetingItem = await meetingList.items.getById(meetingId).select('Id', 'Invitees').get();

    const inviteeIndex = meetingItem.Invitees.findIndex((i: any) => i.Id === invitee.id);
    if (inviteeIndex !== -1) {
      meetingItem.Invitees[inviteeIndex].Answer = answer;
      await meetingList.items.getById(meetingId).update({ Invitees: meetingItem.Invitees });
    }
  }
}

