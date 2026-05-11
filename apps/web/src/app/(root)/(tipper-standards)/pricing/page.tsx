import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import React from "react";
import { WHATSAPP_TIPPER_PHONE } from "@/lib/constants/randoms";

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small businesses getting started",
      features: [
        "Basic business profile",
        "QR code generation",
        "Community engagement",
        "Basic analytics",
        "Email support",
      ],
      buttonText: "Get Started",
      popular: false,
      active: true,
    },
    {
      name: "Professional",
      price: "$27",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Everything in Starter",
        "Advanced analytics",
        "Event management",
        "Partnership network",
        "Priority support",
        "Custom branding",
      ],
      buttonText: "Start Free Trial",
      popular: true,
      active: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations and franchises",
      features: [
        "Everything in Professional",
        "Multi-location management",
        "Advanced integrations",
        "Dedicated account manager",
        "Custom features",
        "API access",
      ],
      buttonText: "Contact Sales",
      popular: false,
      whatsapp: true,
      active: false,
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Simple, Transparent Pricing
      </h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        Choose the plan that best fits your business needs. All plans include
        our core features to help you establish and grow your digital presence.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <Card
            key={index}
            className={`p-6 ${plan.popular ? "ring-2 ring-primary shadow-lg" : ""}`}
          >
            {plan.popular && (
              <div className="bg-primary text-primary-foreground text-center py-2 px-4 rounded-t-lg -mt-6 -mx-6 mb-6">
                Most Popular
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
                    message="Hi! I'm interested in the Enterprise plan for Tipper Network. Can you provide more information?"
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
                  Coming Soon
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
