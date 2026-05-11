import React from "react";
import BlogComponent from "./BlogComponent";

export default function BlogPage() {
  const blogPosts = [
    {
      title: "How QR Codes Help Your Business Increase Online Presence",
      excerpt:
        "Discover how QR codes can transform your customer experience and drive more foot traffic to your business.",
      author: "Declan Ahern",
      date: "Updated on Oct 20, 2021",
      readTime: "5 min read",
      category: "Business Tips",
      link: "https://www.qrstuff.com/blog/marketing/how-qr-codes-help-your-business-increase-online-presence",
    },
    {
      title:
        "Building A Strong Online Presence: Strategies For Small Businesses",
      excerpt:
        "Learn the essential strategies for establishing a compelling online presence that attracts and retains customers.",
      author: "Vamsi Krishna Dhakshinadhi",
      date: "March 10, 2024",
      readTime: "8 min read",
      category: "Digital Marketing",
      link: "https://www.forbes.com/councils/forbestechcouncil/2024/08/27/building-a-strong-online-presence-strategies-for-small-businesses/",
    },
    {
      title: "Community Engagement: 5 Reasons to Prioritize It",
      excerpt:
        "Explore how community engagement can be a game-changer for small businesses looking to grow their customer base.",
      author: "Anna Baluch",
      date: "October 25, 2024",
      readTime: "6 min read",
      category: "Community",
      link: "https://www.uschamber.com/co/good-company/ask-the-board/community-engagement-benefits",
    },
    {
      title: "Event Management Process: 7 Steps To Planning An Event",
      excerpt:
        "A comprehensive guide to creating successful events that drive customer engagement and business growth.",
      author: "Accruent .com",
      date: "January 17, 2025",
      readTime: "10 min read",
      category: "Events",
      link: "hhttps://www.accruent.com/resources/knowledge-hub/event-management-process",
    },
    {
      title: "Strategic Partnerships to Increase Small Business Growth",
      excerpt:
        "How strategic partnerships can help your business expand its reach and create new opportunities,while Growing Your Business,Running A Small Business.",
      author: "Ivi Kim",
      date: "March 23, 2025",
      readTime: "7 min read",
      category: "Partnerships",
      link: "https://www.printivity.com/insights/strategic-partnerships-to-increase-small-business-growth",
    },
    {
      title: "Small Business KPIs: What Are the Numbers That Matter?",
      excerpt:
        "Understanding the key performance indicators and metrics that can help you make data-driven decisions for your business growth.",
      author: "Jessica Elliot",
      date: "April 20, 2022",
      readTime: "9 min read",
      category: "Analytics",
      link: "https://www.uschamber.com/co/run/finance/measure-small-business-kpis",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Tipper Network Blog
      </h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        Insights, tips, and strategies to help your business thrive in the
        digital age.
      </p>
      <BlogComponent blogPosts={blogPosts} />
    </div>
  );
}
