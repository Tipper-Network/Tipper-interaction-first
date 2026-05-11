export type InitiatorFormData = {
  /** Why the member is initiating this person — shown to community voters */
  why_initiating: string;
  /** Optional context about the relationship (how do you know them?) */
  relationship_context: string;
};

export enum PendingInviteStatus_Enum {
  WAITING  = "WAITING",   // community hasn't voted yet
  APPROVED = "APPROVED",  // community approved — invite email sent
  REJECTED = "REJECTED",  // community rejected
  EXPIRED  = "EXPIRED",   // token expired before the person scanned
}

export type PendingInvite = {
  id: string;
  token: string;
  /** The /i/[token] URL encoded in the QR */
  invite_url: string;
  status: PendingInviteStatus_Enum;
  /** The stranger's name — filled after they complete the Who form */
  invitee_name: string | null;
  why_initiating: string;
  relationship_context: string;
  created_at: string;
};
