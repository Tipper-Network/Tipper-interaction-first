import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import { WHATSAPP_TIPPER_PHONE } from "@/lib/constants/randoms";
import { ABOUT } from "@/content/pages/tipper_standards/about";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">{ABOUT.hero.title}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {ABOUT.hero.description}
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid gap-8 md:grid-cols-2 mb-16">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <span className="mr-3">{ABOUT.mission.icon}</span>
              {ABOUT.mission.sectionTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{ABOUT.mission.body}</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <span className="mr-3">{ABOUT.vision.icon}</span>
              {ABOUT.vision.sectionTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{ABOUT.vision.body}</p>
          </CardContent>
        </Card>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">{ABOUT.values.sectionTitle}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ABOUT.values.items.map((value, index) => (
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
        <h2 className="text-3xl font-bold text-center mb-12">{ABOUT.team.sectionTitle}</h2>
        <div className="grid gap-8 md:grid-cols-1 max-w-4xl mx-auto">
          {ABOUT.team.items.map((member, index) => (
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
        <h2 className="text-3xl font-bold text-center mb-12">{ABOUT.milestones.sectionTitle}</h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {ABOUT.milestones.items.map((milestone, index) => (
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
            <CardTitle className="text-2xl">{ABOUT.cta.title}</CardTitle>
          </CardHeader>
          <Separator className="mb-6" />
          <CardContent>
            <p className="text-gray-700 mb-6">{ABOUT.cta.body}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppChatButton
                phoneNumber={WHATSAPP_TIPPER_PHONE}
                message={ABOUT.cta.whatsappMessage}
                buttonText={ABOUT.cta.whatsappButtonText}
                className="sm:w-auto"
              />
              <Button variant="outline" className="sm:w-auto">
                {ABOUT.cta.secondaryButton}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
