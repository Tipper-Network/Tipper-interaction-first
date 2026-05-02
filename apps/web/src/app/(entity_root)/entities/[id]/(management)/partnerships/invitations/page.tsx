"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Handshake,
  Mail,
  Phone,
  Instagram,
  Check,
  X,
  Clock,
  Building2,
  Plus,
  Link,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { InviteBusinessModal } from "@/features/partnerships/components/invite_entity_modal";
import { InvitePartnerModal } from "@/features/partnerships/components/invite_partner_modal";
import { useEntityDetails } from "@/features/entities/shared/hooks/entities_hooks";
import {
  useInboundInvitations,
  useOutboundInvitations,
  usePartnerships,
  useAcceptInvitation,
  useRejectInvitation,
  useCancelInvitation,
} from "@/features/partnerships/hooks/partnerships_hooks";
import InvitationCard from "@/features/partnerships/components/cards/invitation_card";
import PartnershipCard from "@/features/partnerships/components/cards/partnership_card";
import { Info, Lightbulb, Target, Users } from "lucide-react";

export default function PartnershipsInvitationsPage() {
  const params = useParams();
  const router = useRouter();
  const entityId = params.id as string;
  const { user } = useAuthStore();

  const [inviteBusinessOpen, setInviteBusinessOpen] = useState(false);
  const [invitePartnerOpen, setInvitePartnerOpen] = useState(false);

  // Use TanStack Query hooks
  const {
    data: inboundInvitations = [],
    isLoading: isLoadingInbound,
    error: inboundError,
  } = useInboundInvitations(entityId);

  const {
    data: outboundInvitations = [],
    isLoading: isLoadingOutbound,
    error: outboundError,
  } = useOutboundInvitations(entityId);
  const {
    data: partnerships = [],
    isLoading: isLoadingPartnerships,
    error: partnershipsError,
  } = usePartnerships(entityId);

  const acceptMutation = useAcceptInvitation();
  const rejectMutation = useRejectInvitation();
  const cancelMutation = useCancelInvitation();

  const { data: entity } = useEntityDetails(entityId);

  const isLoading =
    isLoadingInbound || isLoadingOutbound || isLoadingPartnerships;

  // Show errors if any
  if (inboundError || outboundError || partnershipsError) {
    const error = inboundError || outboundError || partnershipsError;
    toast.error("Failed to load partnerships", {
      description:
        error instanceof Error ? error.message : "Please try again later.",
    });
  }

  const handleAccept = async (invitationId: string) => {
    try {
      await acceptMutation.mutateAsync(invitationId);
      toast.success("Partnership invitation accepted!");
    } catch (error) {
      toast.error("Failed to accept invitation", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  const handleReject = async (invitationId: string) => {
    try {
      await rejectMutation.mutateAsync(invitationId);
      toast.success("Invitation declined");
    } catch (error) {
      toast.error("Failed to decline invitation", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  const handleCancel = async (invitationId: string) => {
    try {
      await cancelMutation.mutateAsync(invitationId);
      toast.success("Invitation cancelled");
    } catch (error) {
      toast.error("Failed to cancel invitation", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading partnerships...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Partnerships & Invitations
            </h1>
            <p className="text-muted-foreground">
              Manage your partnership invitations and active partnerships
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setInviteBusinessOpen(true)}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Invite Business
            </Button>
            <Button onClick={() => setInvitePartnerOpen(true)}>
              <Handshake className="h-4 w-4 mr-2" />
              Invite Partner
            </Button>
          </div>

          <InviteBusinessModal
            inviterEntityId={entityId}
            entityName={entity?.name}
            open={inviteBusinessOpen}
            onOpenChange={setInviteBusinessOpen}
          />
          <InvitePartnerModal
            inviterEntityId={entityId}
            entityName={entity?.name}
            open={invitePartnerOpen}
            onOpenChange={setInvitePartnerOpen}
          />
        </div>

        {/* Exploration & Context Section */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Exploring Partnerships on Tipper
            </CardTitle>
            <CardDescription>
              Understand how partnerships work and what they can do for your
              business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">Strategic Alignment</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect with businesses that share your values, audience, and
                  location. Partnerships help you reach aligned customers and
                  grow together.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">Collaboration</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Explore joint opportunities, cross-promotions, and shared
                  resources. Build meaningful relationships with local
                  businesses in your network.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">Mutual Growth</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Partnerships are invitations to explore, not commitments. You
                  can accept, decline, or discuss terms before moving forward.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">
            How Invitations Work
          </AlertTitle>
          <AlertDescription className="mt-2 text-sm">
            <strong>Received Invitations:</strong> Other businesses want to
            explore partnerships with you. Review their details and accept or
            decline.
            <br />
            <br />
            <strong>Sent Invitations:</strong> Track invitations you&apos;ve
            sent. You can cancel pending invitations if needed.
            <br />
            <br />
            <strong>Active Partnerships:</strong> View your ongoing partnerships
            and access partnership details for collaboration.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="inbound" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inbound">
              Received ({inboundInvitations.length})
            </TabsTrigger>
            <TabsTrigger value="outbound">
              Sent ({outboundInvitations.length})
            </TabsTrigger>
            <TabsTrigger value="partnerships">
              Active Partnerships ({partnerships.length})
            </TabsTrigger>
          </TabsList>

          {/* Inbound Invitations */}
          <TabsContent value="inbound" className="space-y-4">
            {inboundInvitations.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No pending invitations received
                  </p>
                </CardContent>
              </Card>
            ) : (
              inboundInvitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  type="inbound"
                  onAccept={() => handleAccept(invitation.id)}
                  onReject={() => handleReject(invitation.id)}
                  isProcessing={
                    acceptMutation.isPending || rejectMutation.isPending
                  }
                />
              ))
            )}
          </TabsContent>

          {/* Outbound Invitations */}
          <TabsContent value="outbound" className="space-y-4">
            {outboundInvitations.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No invitations sent
                  </p>
                </CardContent>
              </Card>
            ) : (
              outboundInvitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  type="outbound"
                  onCancel={() => handleCancel(invitation.id)}
                  isProcessing={cancelMutation.isPending}
                />
              ))
            )}
          </TabsContent>

          {/* Active Partnerships */}
          <TabsContent value="partnerships" className="space-y-4">
            {partnerships.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No active partnerships
                  </p>
                </CardContent>
              </Card>
            ) : (
              partnerships.map((partnership) => (
                <PartnershipCard
                  key={partnership.id}
                  partnership={partnership}
                  currentEntityId={entityId}
                  onView={() =>
                    router.push(
                      `/entities/${entityId}/partnerships/${partnership.id}`
                    )
                  }
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
