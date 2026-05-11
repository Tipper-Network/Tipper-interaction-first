import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import React from "react";
import { SUPPORT } from "@/content/pages/tipper_standards/support";

export default async function SupportPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{SUPPORT.title}</h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        {SUPPORT.intro}
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {SUPPORT.options.map((option, index) => (
          <Card key={index} className="p-6">
            <CardHeader className="text-center">
              <span className="text-3xl mb-2 block">{option.icon}</span>
              <CardTitle>{option.title}</CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="text-center">
              <p className="text-gray-700 mb-4">{option.description}</p>
              <Button variant="outline" className="w-full">
                {option.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>{SUPPORT.quickLinks.title}</CardTitle>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {SUPPORT.quickLinks.items.map((link, index) => (
                <Button key={index} variant="ghost" className="justify-start">
                  {link}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
