export type ColdApproachType = "email" | "message" | "linkedin_dm";
export type ColdApproachStatus = "unseen" | "ghosted" | "rejected" | "waiting" | "replied";

export interface ColdApproach {
  id: string;
  type: ColdApproachType;
  recipientName: string;
  company: string;
  content: string;
  subject?: string;
  recipientEmail?: string;
  linkedinProfile?: string;
  status: ColdApproachStatus;
  sentDate: string;
}