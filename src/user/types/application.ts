export type ApplicationStatus = 'accepted' | 'waiting' | 'ghosting' | 'rejected' | 'interviewing';

export enum ApplicationMethod {
    Email = 'email',
    Website = 'website',
    LinkedIn = 'linkedin',
    Referral = 'referral',
    Other = 'other'
}

export interface Application {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  method: ApplicationMethod;
  appliedDate: string;
  lastUpdated: string;
  notes?: string;
  contactEmail?: string;
  contactName?: string;
}