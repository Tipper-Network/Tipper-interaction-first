"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Handshake,
  Mail,
  Phone,

  ExternalLink,
} from "lucide-react";
import { usePartnershipById } from "@/features/partnerships/hooks/partnerships_hooks";
import { getEntityProfileUrl } from "@/features/entities/shared/utils/entity_routes";
import { getPartnershipIntentDisplayText } from "@/features/partnerships/utils/intent_display";
import Image from "next/image";
import Link from "next/link";
import {  ArrowLeftIcon, PartnershipIcon } from "@/icons/utility_icons";
import { AddressIcon } from "@/icons/links_button_icons";
import InstagramUrlLink from "@/components/button_external_links/InstagramUrlLink";

export default function PartnershipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const entityId = params.id as string;
  const partnershipId = params.parthership_id as string;

  const {
    data: partnership,
    isLoading,
    error,
  } = usePartnershipById(partnershipId);

  // Determine which entity is the partner
  const isEntityA = partnership?.entity_a_id === entityId;
  const partnerEntity = isEntityA
    ? partnership?.entity_b
    : partnership?.entity_a;
  const currentEntityData = isEntityA
    ? partnership?.entity_a
    : partnership?.entity_b;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading partnership details...</p>
      </div>
    );
  }

  if (error || !partnership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              Failed to load partnership. Please try again.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const intentText = partnership.origin_invitation?.intent
    ? getPartnershipIntentDisplayText(partnership.origin_invitation.intent)
    : "Partnership";

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
           <ArrowLeftIcon />
            Back to Partnerships
          </Button>
          <div className="flex items-center gap-3 mb-2">
              <PartnershipIcon />
            <div>
              <h1 className="text-3xl font-bold">Partnership Details</h1>
              <p className="text-muted-foreground">
                View and manage your partnership with {partnerEntity?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Partnership Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Partnership Information</CardTitle>
              <Badge variant="default">Active</Badge>
            </div>
            <CardDescription>
              Partnership established on{" "}
              {partnership.created_at
                ? new Date(partnership.created_at).toLocaleDateString()
                : "N/A"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {partnership.origin_invitation && (
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Partnership Intent
                  </p>
                  <Badge variant="secondary">{intentText}</Badge>
                </div>
                {partnership.origin_invitation.note && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Original Message
                    </p>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg">
                      {partnership.origin_invitation.note}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Entities Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Current Entity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Your Entity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {currentEntityData?.logo_url ? (
                    <Image
                      src={currentEntityData.logo_url}
                      alt={currentEntityData.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {currentEntityData?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {currentEntityData?.entity_type?.toLowerCase() ||
                        "Entity"}
                    </p>
                  </div>
                </div>
                <Link
                  href={getEntityProfileUrl(
                    currentEntityData?.id || "",
                    currentEntityData?.entity_type
                  )}
                >
                  <Button variant="outline" className="w-full">
                    View Your Profile
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Partner Entity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="h-5 w-5" />
                Partner Entity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {partnerEntity?.logo_url ? (
                    <Image
                      src={partnerEntity.logo_url}
                      alt={partnerEntity.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {partnerEntity?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {partnerEntity?.entity_type?.toLowerCase() || "Entity"}
                    </p>
                  </div>
                </div>
                {partnerEntity?.description && (
                  <p className="text-sm text-muted-foreground">
                    {partnerEntity.description}
                  </p>
                )}
                <div className="space-y-2">
                  {partnerEntity?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {partnerEntity.email}
                      </span>
                    </div>
                  )}
                  {partnerEntity?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {partnerEntity.phone}
                      </span>
                    </div>
                  )}
                  {partnerEntity?.instagram_url && (
                    <div className="flex items-center gap-2 text-sm">
                    
                      <InstagramUrlLink instagram_url={partnerEntity.instagram_url} />
                    </div>
                  )}
                  {(partnerEntity?.city ||
                    partnerEntity?.neighborhood ||
                    partnerEntity?.street) && (
                    <div className="flex items-center gap-2 text-sm">
                      <AddressIcon />
                      <span className="text-muted-foreground">
                        {[
                          partnerEntity.street,
                          partnerEntity.neighborhood,
                          partnerEntity.city,
                          partnerEntity.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
                <Link
                  href={getEntityProfileUrl(
                    partnerEntity?.id || "",
                    partnerEntity?.entity_type
                  )}
                >
                  <Button variant="outline" className="w-full">
                    View Partner Profile
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline/History */}
        <Card>
          <CardHeader>
            <CardTitle>Partnership Timeline</CardTitle>
            <CardDescription>Key events in this partnership</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partnership.origin_invitation && (
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">Partnership Created</p>
                    <p className="text-sm text-muted-foreground">
                      {partnership.created_at
                        ? new Date(partnership.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
              {partnership.origin_invitation?.created_at && (
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-muted mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">Invitation Sent</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        partnership.origin_invitation.created_at
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
