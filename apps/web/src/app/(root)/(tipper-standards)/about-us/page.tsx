import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import { WHATSAPP_TIPPER_PHONE } from "@/lib/constants/randoms";
export default function AboutUsPage() {
  const values = [
    {
      icon: "🚀",
      title: "Social Innovation",
      description:
        "We push boundaries and embrace cutting-edge technologies to solve real-world problems in the digital economy.",
    },
    {
      icon: "🤝",
      title: "Community Collaboration",
      description:
        "We believe in the power of diverse teams and collaborative problem-solving to build stronger digital communities.",
    },
    {
      icon: "🌍",
      title: "Individualized Micro Impact",
      description:
        "We focus on creating meaningful connections and impact at the individual and local business level.",
    },
    {
      icon: "💡",
      title: "Creative Solutions",
      description:
        "We approach challenges with creativity and innovation, finding unique ways to connect businesses and communities.",
    },
  ];

  const team = [
    {
      name: "Our Team",
      role: "Visionaries & Builders",
      description:
        "A diverse group of passionate individuals committed to revolutionizing how businesses connect with their communities through digital innovation.",
      image: "👥",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description:
        "Launched Tipper Network with core features for business connectivity and community engagement.",
    },
    {
      year: "2024",
      title: "Community Growth",
      description:
        "Expanded our user base and established partnerships across the Middle East region.",
    },
    {
      year: "2025",
      title: "Tipper Partnerships",
      description:
        "Connecting small businesses with each other, initializing the network of partnerships that move our economy forward.",
    },
    {
      year: "2025",
      title: "Innovation Hub",
      description:
        "Developed advanced features including event management, partnership networks, and analytics.",
    },
    {
      year: "2026",
      title: "Introduction of Tipper Macro communities",
      description:
        "Introduced Tipper Macro communities, a platform for communities that build around the individuals traversing the social spaces .",
    },
    {
      year: "2026",
      title: "Psyfer block the chain",
      description:
        "introducing the psyfer blockchain project, authentic digitization of user interactions.",
    },
    {
      year: "2027",
      title: "Tipper Micro economies",
      description:
        "Introducing Microeconomies where small businesses can thrive and grow, creating a sustainable and inclusive digital landscape for their partnerships and their communities.",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About Tipper Network</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We&apos;re building the future of business connectivity, one digital
          handshake at a time. Our platform empowers businesses to create
          meaningful connections with their communities through innovative
          technology and human-centered design, driving the evolution of the
          digital footprint.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid gap-8 md:grid-cols-2 mb-16">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <span className="mr-3">🎯</span>
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              To democratize digital business connectivity by providing
              innovative tools that enable businesses of all sizes to build
              meaningful relationships with their communities, fostering growth
              and sustainability in the digital economy.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <span className="mr-3">🔮</span>
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              A world where every business, regardless of size or location, can
              seamlessly connect with their community, share their story, and
              thrive in the digital landscape through authentic, meaningful
              interactions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center">
              <CardContent>
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
        <div className="grid gap-8 md:grid-cols-1 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <Card key={index} className="p-6">
              <CardContent className="text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Milestones Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {milestones.map((milestone, index) => (
            <Card key={index} className="p-6">
              <CardHeader>
                <CardTitle className="text-primary text-2xl">
                  {milestone.year}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">{milestone.title}</h3>
                <p className="text-gray-600">{milestone.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Card className="p-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Join Our Mission</CardTitle>
          </CardHeader>
          <Separator className="mb-6" />
          <CardContent>
            <p className="text-gray-700 mb-6">
              Ready to be part of the digital revolution? Whether you&apos;re a
              business looking to connect with your community or a passionate
              individual wanting to make a difference, we&apos;d love to hear
              from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppChatButton
                phoneNumber={WHATSAPP_TIPPER_PHONE}
                message="Hi! I'm interested in learning more about Tipper Network and how we can work together."
                buttonText="Start a Conversation"
                className="sm:w-auto"
              />
              <Button variant="outline" className="sm:w-auto">
                Explore Our Platform
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
