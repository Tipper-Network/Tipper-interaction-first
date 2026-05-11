export const PartnershipInvitationTemplate = {
  subject: 'You’ve been invited to explore a partnership on Tipper',
  html: `
    <p>Hello {{inviteeName}},</p>
    
    <p><strong>{{inviterName}}</strong> has invited you to explore a potential {{partnershipType}} on Tipper.</p>
   <br/>
   <p>{{note}}</p>
   
 
    
    <p>Tipper helps small businesses discover aligned partners and collaborate around shared values, audiences, and locations.</p>
    
    <p>You can review the invitation and decide how you’d like to proceed by clicking the link below:</p>
    <p><a href="{{invitationLink}}">Review Partnership Invitation</a></p>
    
    <p><strong>Accepting this invitation does not create any obligation.</strong> It simply opens a shared space to explore collaboration.</p>
    
    <br/>
    <p>Warm regards,<br/>
    Tarek H. Ghosn<br/>
    Founder, Tipper</p>
  `,
};
