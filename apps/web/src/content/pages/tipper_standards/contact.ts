export const CONTACT = {
  title: "Get in Touch",
  intro:
    "We're here to help! Choose the best way to reach us based on your needs.",
  options: [
    {
      title: "WhatsApp Support",
      description:
        "Get instant help and support through WhatsApp. Our team is available to answer your questions and provide assistance.",
      icon: "💬",
      type: "whatsapp-chat" as const,
      phoneNumber: "96178883966",
      message: "Hi! I need help with Tipper Network. Can you assist me?",
    },
    {
      title: "Join Our Community",
      description:
        "Connect with other users, share experiences, and get tips from the Tipper Network community.",
      icon: "👥",
      type: "whatsapp-community" as const,
      communityLink: "https://chat.whatsapp.com/HHiRZer2Uvw94B5fHh4Q8q",
    },
    {
      title: "Email Support",
      description:
        "Send us a detailed message and we'll get back to you within 24 hours.",
      icon: "📧",
      type: "email" as const,
      email: "psyfer@tippernetwork.com",
    },
    {
      title: "Business Inquiries",
      description:
        "For enterprise partnerships, custom solutions, and business development opportunities.",
      icon: "🤝",
      type: "whatsapp-chat" as const,
      phoneNumber: "0096178883966",
      message:
        "Hi! I'm interested in business opportunities with Tipper Network. Can we discuss potential partnerships?",
    },
  ],
  chatCta: "Start Chat",
  emailCta: "Send Email",
  emailSubject: "Tipper Network Support",
  whatsappCommunityButtonText: "Whatsapp Community",
  officeHours: {
    sectionTitle: "Office Hours & Response Times",
    hours: {
      title: "Support Hours",
      items: [
        "Monday - Friday: 9:00 AM - 6:00 PM (GMT+3)",
        "Saturday: 10:00 AM - 4:00 PM (GMT+3)",
        "Sunday: Closed",
      ],
    },
    response: {
      title: "Response Times",
      items: [
        "WhatsApp: Within 1 hour",
        "Email: Within 24 hours",
        "Community: Real-time discussions",
      ],
    },
  },
} as const;
