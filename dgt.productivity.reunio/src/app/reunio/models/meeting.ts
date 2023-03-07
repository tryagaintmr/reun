export interface Meeting {
  Id?: number;
  Title: string;
  Description?: string;
  Creator: {
    Title: string;
    EMail: string;
  };
  Invitees: {
    Title: string;
    EMail: string;
  }[];
  Slots: {
    date: string;
    start: string;
    end: string;
    available: boolean;
    selected: boolean;
    invitees: string[];
  }[];
  Status?: string;
  SelectedSlot?: {
    date: string;
    start: string;
    end: string;
  };
}
