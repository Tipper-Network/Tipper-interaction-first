import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import React from "react";
import { WHATSAPP_TIPPER_PHONE } from "@/lib/constants/randoms";
import { PRICING } from "@/content/pages/tipper_standards/pricing";

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: readonly string[];
  buttonText: string;
  popular: boolean;
  active: boolean;
  whatsapp: boolean;
  period?: string;
};

export default function PricingPage() {
  const plans = PRICING.plans as unknown as PricingPlan[];
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{PRICING.title}</h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        {PRICING.intro}
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`p-6 ${plan.popular ? "ring-2 ring-primary shadow-lg" : ""}`}
          >
            {plan.popular && (
              <div className="bg-primary text-primary-foreground text-center py-2 px-4 rounded-t-lg -mt-6 -mx-6 mb-6">
                {PRICING.mostPopular}
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-4xl font-bold">
                {plan.price}
                {plan.period && (
                  <span className="text-lg font-normal">{plan.period}</span>
                )}
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <span className="text-tertiary mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.active ? (
                plan.whatsapp ? (
                  <WhatsAppChatButton
                    phoneNumber={WHATSAPP_TIPPER_PHONE}
                    message={PRICING.enterpriseWhatsappMessage}
                    buttonText={plan.buttonText}
                    className="w-full"
                  />
                ) : (
                  <Button
                    className="w-full"
                    disabled={!plan.active}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.buttonText}
                  </Button>
                )
              ) : (
                <Button
                  className="w-full"
                  disabled={!plan.active}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {PRICING.comingSoon}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
