"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  getInvitationById,
  acceptInvitation,
  rejectInvitation,
} from "@/features/partnerships/api/partnerships_api";
import { createCommunity } from "@/features/communities/api/communities_api";
import {
  UserInitiateCommunityForEntitySchema,
  type UserInitiateCommunityForEntity,
} from "@/features/communities/components/create_community_modal/types/community_types";
import CommunityStepEntityInfo from "@/features/communities/components/create_community_modal/steps/entity_info_step";
import CommunityStepLocation from "@/features/communities/components/create_community_modal/steps/location_step";
import {
  Building2,
  Check,
  Shield,
  X,
  CheckCircle2,
  XCircle,
  Ban,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { normalizeInstagramHandle } from "@/lib/utils/utils";
import { getPartnershipIntentDisplayText } from "@/features/partnerships/utils/intent_display";
import AuthWizard from "@/features/auth/components/auth_wizard";
import { PartnershipInvitationStatus__Enum } from "@/lib/shared/enum_types";
import { NeutralDialog } from "@/components/NeutralDialog";

export default function InvitationOnboardingPage({
  invitationId,
}: {
  invitationId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const [invitation, setInvitation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingInvitation, setIsProcessingInvitation] = useState(false);
  const [showAuthWizard, setShowAuthWizard] = useState(false);
  const [pendingOutboundAccept, setPendingOutboundAccept] = useState(false);

  // Check if invitation was not found
  const isNotFound =
    invitation?.status === PartnershipInvitationStatus__Enum.NOT_FOUND;

  // Check if this is an inbound invite (entity exists) or outbound (entity doesn't exist)
  const isInboundInvite =
    invitation?.invitee_entity_id !== null &&
    invitation?.invitee_entity_id !== undefined;
  const isOutboundInvite = !isInboundInvite;

  // Check if invitation is expired or resolved
  const isExpired =
    invitation?.expires_at && new Date(invitation.expires_at) < new Date();
  const isResolved =
    invitation?.status &&
    invitation.status !== PartnershipInvitationStatus__Enum.PENDING &&
    invitation.status !== PartnershipInvitationStatus__Enum.NOT_FOUND;
  const isValidForOnboarding = !isExpired && !isResolved && !isNotFound;
  const invitationStatus = invitation?.status?.toUpperCase();
  const isAccepted =
    invitationStatus === PartnershipInvitationStatus__Enum.ACCEPTED;
  const isDeclined =
    invitationStatus === PartnershipInvitationStatus__Enum.DECLINED;
  const isCancelled =
    invitationStatus === PartnershipInvitationStatus__Enum.CANCELLED;

  const form = useForm<UserInitiateCommunityForEntity>({
    resolver: zodResolver(UserInitiateCommunityForEntitySchema),
    defaultValues: {
      city: "",
      neighborhood: "",
      street: "",
      operates_online: false,
      coordinates: {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
      },
      entityName: "",
      description: "",
      // businessTypeId: "",
      entityEmail: "",
      entityPhoneNumber: "",
      instagram_url: "@",
    },
  });

  const fetchInvitation = async () => {
    try {
      const data = await getInvitationById(invitationId);
      setInvitation(data);

      // Only show error toast if it's an actual error, not a NOT_FOUND status
      if (data?.status === PartnershipInvitationStatus__Enum.NOT_FOUND) {
        // NOT_FOUND is handled in the UI, no need for toast
        setIsLoading(false);
        return;
      }

      // Pre-fill form with invitation data (only for outbound invites that need onboarding)
      if (
        data &&
        !data.invitee_entity_id &&
        data.status !== PartnershipInvitationStatus__Enum.NOT_FOUND
      ) {
        // Outbound invite: pre-fill with invitee data from invitation
        // IMPORTANT: Always use invitee_* fields, never inviter_entity data
        form.reset({
          entityName: data.invitee_name || "",
          entityEmail: data.invitee_email || "",
          entityPhoneNumber: data.invitee_phone || "",
          instagram_url: data.invitee_instagram_handle
            ? normalizeInstagramHandle(data.invitee_instagram_handle)
            : "",
          description: "",
          city: "",
          neighborhood: "",
          street: "",
          operates_online: false,
          coordinates: {
            latitude: 0,
            longitude: 0,
            accuracy: 0,
          },
          // businessTypeId: "",
        });
      }
    } catch (error) {
      // Show toast for actual network/API errors
      toast.error("Failed to load invitation", {
        description:
          error instanceof Error
            ? error.message
            : "Please check the link and try again.",
      });
      // Set invitation to null so UI shows error state
      setInvitation(null);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (invitationId) {
      fetchInvitation();
    }
  }, [invitationId]);

  // Auto-proceed to onboarding after sign-in for outbound invites
  useEffect(() => {
    if (
      user &&
      invitation &&
      isOutboundInvite &&
      !hasAccepted &&
      !showAuthWizard &&
      (pendingOutboundAccept || searchParams.get("accept") === "1")
    ) {
      // User just signed in and it's an outbound invite - auto-proceed to onboarding
      setHasAccepted(true);
      setPendingOutboundAccept(false);
    }
  }, [
    user,
    invitation,
    isOutboundInvite,
    hasAccepted,
    showAuthWizard,
    pendingOutboundAccept,
    searchParams,
  ]);

  const nextStep = async () => {
    // Check authentication before moving to step 2 (business details)
    if (currentStep === 1) {
      if (!user) {
        // Show auth wizard inline
        setShowAuthWizard(true);
        return;
      }
    }
    const fieldsToValidate =
      currentStep === 1
        ? ([
            "entityName",
            "description",
            // "businessTypeId",
            "entityEmail",
            "instagram_url",
            "entityPhoneNumber",
          ] as const)
        : (["city", "operates_online", "coordinates"] as const);

    const valid = await form.trigger(fieldsToValidate);
    if (valid) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => setCurrentStep((s) => s - 1);

  const handleAccept = async () => {
    // Check authentication
    if (!user) {
      // Show auth wizard inline
      if (isOutboundInvite) setPendingOutboundAccept(true);
      setShowAuthWizard(true);
      return;
    }

    // For inbound invites: accept the invitation directly (entity already exists)
    if (isInboundInvite) {
      setIsProcessingInvitation(true);
      try {
        await acceptInvitation(invitationId);
        toast.success("Invitation accepted!", {
          description: "The partnership has been created.",
        });
        // Redirect to partnerships page
        router.push(`/entities/${invitation.invitee_entity_id}/partnerships`);
      } catch (error) {
        toast.error("Failed to accept invitation", {
          description:
            error instanceof Error ? error.message : "Please try again later.",
        });
      } finally {
        setIsProcessingInvitation(false);
      }
      return;
    }

    // For outbound invites: show onboarding form
    setHasAccepted(true);
  };

  const handleDecline = async () => {
    // Check authentication
    if (!user) {
      // Show auth wizard inline
      setShowAuthWizard(true);
      return;
    }

    setIsProcessingInvitation(true);
    try {
      await rejectInvitation(invitationId);
      toast.success("Invitation declined");
      router.push("/");
    } catch (error) {
      toast.error("Failed to decline invitation", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsProcessingInvitation(false);
    }
  };

  const handleSubmit = async (data: UserInitiateCommunityForEntity) => {
    if (!user) {
      // Show auth wizard inline
      setShowAuthWizard(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedInstagram = data.instagram_url
        ? normalizeInstagramHandle(data.instagram_url)
        : undefined;

      // Create entity and community - backend will automatically link the invitation
      const response = await createCommunity({
        name: data.entityName.trim(),
        description: data.description.trim(),
        city: data.city.trim(),
        neighborhood: data.neighborhood?.trim() || "",
        street: data.street?.trim() || "",
        operates_online: data.operates_online,
        latitude: data.operates_online
          ? undefined
          : Number(data.coordinates?.latitude),
        longitude: data.operates_online
          ? undefined
          : Number(data.coordinates?.longitude),
        accuracy: data.operates_online
          ? undefined
          : Number(data.coordinates?.accuracy ?? 0),
        // businessTypeId: data.businessTypeId || "",
        entityEmail: data.entityEmail,
        entityPhoneNumber: data.entityPhoneNumber?.trim() || undefined,
        instagram_url: normalizedInstagram,
        invitationId,
      });

      if (response?.success === false) {
        toast.error(response.message || "Failed to create business");
        return;
      }

      const entity = Array.isArray(response) ? response[0] : response;
      const entityId = entity?.id;

      if (entityId) {
        toast.success("Business created successfully!", {
          description: "Now let's set up your business identity.",
        });
        // Redirect to entity onboarding - invitation is already linked by backend
        router.push(`/entities/${entityId}/onboarding`);
      } else {
        toast.error("Business created but couldn't find entity ID");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create business", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show auth wizard if user needs to sign in
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading invitation...</p>
      </div>
    );
  }

  // Handle NOT_FOUND status
  if (isNotFound || !invitation) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-4">
                  <X className="h-16 w-16 text-destructive" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold mb-2">
                    Invitation Not Found
                  </h1>
                  <p className="text-muted-foreground">
                    This invitation link is invalid or the invitation has been
                    removed. Please check the link and try again, or contact the
                    person who sent you this invitation.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/explore")}
                    className="w-full sm:w-auto"
                  >
                    Go to Explore
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const inviterEntity = invitation.inviter_entity;
  const inviterName = inviterEntity?.name || "A Space";
  const inviterLogo = inviterEntity?.logo_url;
  const intentText = getPartnershipIntentDisplayText(invitation.intent);

  // Show message if invitation is expired or resolved
  if (isExpired || isResolved) {
    // Determine icon and colors based on status
    let StatusIcon = Clock;
    let iconColor = "text-muted-foreground";
    let title = "Invitation Status";
    let message = "";
    let showPartnershipLink = false;

    if (isExpired) {
      StatusIcon = Clock;
      iconColor = "text-destructive";
      title = "Invitation Has Expired";
      message =
        "This invitation link is no longer valid. Please contact the inviter for a new invitation.";
    } else if (isAccepted) {
      StatusIcon = CheckCircle2;
      iconColor = "text-green-600";
      title = "Invitation Accepted";
      message =
        "This invitation has already been accepted. The partnership is now active.";
      showPartnershipLink = true;
    } else if (isDeclined) {
      StatusIcon = XCircle;
      iconColor = "text-orange-600";
      title = "Invitation Declined";
      message =
        "This invitation has been declined. If you'd like to reconsider, please contact the inviter.";
    } else if (isCancelled) {
      StatusIcon = Ban;
      iconColor = "text-muted-foreground";
      title = "Invitation Cancelled";
      message =
        "This invitation has been cancelled. Please contact the inviter if you'd like to receive a new invitation.";
    } else {
      StatusIcon = Shield;
      iconColor = "text-muted-foreground";
      title = `Invitation ${invitationStatus || "Resolved"}`;
      message = `This invitation has been ${invitation.status?.toLowerCase() || "processed"}.`;
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-4">
                  <StatusIcon className={`h-16 w-16 ${iconColor}`} />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold mb-2">{title}</h1>
                  <p className="text-muted-foreground">{message}</p>
                </div>

                {inviterEntity && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground mb-3">
                      Invited by:
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      {inviterLogo && (
                        <Image
                          src={inviterLogo}
                          alt={inviterName}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                      <span className="font-medium text-lg">{inviterName}</span>
                    </div>
                  </div>
                )}

                {showPartnershipLink && invitation.invitee_entity_id && (
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      onClick={() =>
                        router.push(
                          `/entities/${invitation.invitee_entity_id}/partnerships`
                        )
                      }
                      className="w-full sm:w-auto"
                    >
                      View Partnership
                    </Button>
                  </div>
                )}

                {!showPartnershipLink && (
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/explore")}
                      className="w-full sm:w-auto"
                    >
                      Go to Explore
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // For inbound invites: show accept/decline buttons (entity already exists)
  // For outbound invites: show onboarding form if user has accepted
  if (isInboundInvite) {
    // Inbound invite - entity exists, just show accept/decline
    return (
      <div className="min-h-screen bg-background">
        <NeutralDialog
          open={showAuthWizard}
          onOpenChange={setShowAuthWizard}
          title="Sign in to accept or decline this invitation"
        >
          <AuthWizard
            mode="signin"
            returnUrl={`/entities/invitations/${invitationId}`}
            onSuccess={() => {
              setShowAuthWizard(false);
            }}
          />
        </NeutralDialog>
        <div className="container max-w-2xl mx-auto px-4 py-12">
          {/* Invitation details */}
          <div className="text-center mb-12">
            <div className="flex flex-col items-center gap-4 mb-6">
              {inviterLogo ? (
                <Image
                  src={inviterLogo}
                  alt={inviterName}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-border object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-border bg-muted flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-semibold mb-2">
                  {inviterName} wants to explore a partnership with you
                </h1>
                <Badge variant="secondary" className="mt-2">
                  {intentText}
                </Badge>
              </div>
            </div>

            {invitation.note && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Message from {inviterName}:
                    </p>
                    <blockquote className="text-base leading-relaxed border-l-4 border-primary pl-4 italic">
                      &ldquo;{invitation.note}&rdquo;
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Accept/Decline buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={handleAccept}
              disabled={isProcessingInvitation}
              className="flex-1"
            >
              {isProcessingInvitation ? "Processing..." : "Accept Invitation"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDecline}
              disabled={isProcessingInvitation}
              className="flex-1"
            >
              Decline
            </Button>
          </div>

          {!user && (
            <div className="text-center mt-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Please sign in to accept or decline this invitation
              </p>
              <Button
                size="lg"
                onClick={() => setShowAuthWizard(true)}
                className="w-full sm:w-auto"
              >
                Sign In / Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Outbound invite - show onboarding form if user has accepted
  if (hasAccepted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">
              Set up your Space on Tipper
            </h1>
            <p className="text-muted-foreground">
              A few quick details to get you started on Tipper.
            </p>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {currentStep === 1 && (
                <>
                  <CommunityStepEntityInfo />

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setHasAccepted(false)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep} className="flex-1">
                      Next
                    </Button>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <CommunityStepLocation />

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Creating..." : "Create & Continue"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    );
  }

  // Main invitation page
  return (
    <div className="min-h-screen bg-background">
      <Dialog open={showAuthWizard} onOpenChange={setShowAuthWizard}>
        <DialogContent className="p-0">
          <AuthWizard
            mode="signin"
            returnUrl={`/entities/invitations/${invitationId}`}
            onSuccess={() => {
              setShowAuthWizard(false);
              // For outbound invites, auto-proceed is gated by pendingOutboundAccept (or ?accept=1)
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="container max-w-2xl mx-auto px-4 py-12">
        {/* SECTION 1 — The Invitation (Above the fold) */}
        <div className="text-center mb-12">
          {/* Inviter Logo + Name */}
          <div className="flex flex-col items-center gap-4 mb-6">
            {inviterLogo ? (
              <Image
                src={inviterLogo}
                alt={inviterName}
                width={80}
                height={80}
                className="rounded-full border-2 border-border object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-border bg-muted flex items-center justify-center">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-semibold mb-2">
                {inviterName} wants to explore a partnership with you
              </h1>
              <Badge variant="secondary" className="mt-2">
                {intentText}
              </Badge>
            </div>
          </div>

          {/* Supporting line */}
          <p className="text-muted-foreground text-lg mb-8">
            This invitation is sent through Tipper, a private network for local
            business partnerships.
          </p>

          {/* CTA */}
          {user ? (
            <Button size="lg" onClick={handleAccept} className="mb-12">
              Accept & Continue
            </Button>
          ) : (
            <div className="mb-12 space-y-3">
              <Button
                size="lg"
                onClick={() => setShowAuthWizard(true)}
                className="w-full sm:w-auto"
              >
                Sign In / Sign Up
              </Button>
              <p className="text-sm text-muted-foreground">
                You need to sign in to accept this invitation
              </p>
            </div>
          )}
        </div>

        {/* SECTION 2 — Personal Message (If exists) */}
        {invitation.note && (
          <div className="mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Message from {inviterName}:
                  </p>
                  <blockquote className="text-base leading-relaxed border-l-4 border-primary pl-4 italic">
                    &ldquo;{invitation.note}&rdquo;
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* SECTION 3 — Why You (Context) */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Why you</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>
                {inviterName} sees potential for collaboration around{" "}
                <span className="font-medium text-foreground">
                  {intentText.toLowerCase()}
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>
                This is an invitation to explore partnership opportunities, not
                a commitment
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>
                If you accept, you&apos;ll create a private account and can
                decide how to proceed from there
              </span>
            </li>
          </ul>
        </div>

        <Separator className="my-12" />

        {/* SECTION 4 — What Happens If You Accept */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            What happens if you accept
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary">1</span>
              </div>
              <p>You create a private account</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary">2</span>
              </div>
              <p>You confirm your business details</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary">3</span>
              </div>
              <p>You decide whether to move forward</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground">
              No public listing. No payment. No obligation.
            </p>
          </div>
        </div>

        <Separator className="my-12" />

        {/* SECTION 5 — About Tipper (Lightweight) */}
        <div className="mb-12 text-center">
          <div className="mb-4">
            <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
          </div>
          <p className="text-muted-foreground mb-2">
            Tipper is a private network that helps local businesses discover
            aligned partners and collaborate around shared values, audiences,
            and locations.
          </p>
          <p className="text-sm text-muted-foreground">
            Your information is private and only shared with partners you
            choose.
          </p>
        </div>

        {/* FINAL CTA */}
        {user ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={handleAccept} className="flex-1">
              Accept & Continue
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDecline}
              className="flex-1"
            >
              Decline invitation
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={() => setShowAuthWizard(true)}
              className="w-full"
            >
              Sign In / Sign Up to Continue
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              You need to sign in to accept or decline this invitation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
