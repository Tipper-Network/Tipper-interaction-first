"use client";

import { useState, useMemo, startTransition } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Save, X, Loader2 } from "lucide-react";
import { useEntityDetails } from "../../hooks/entities_hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateEntityProfile } from "@/views/entities/shared/api/update_entitiy_api";
import { toast } from "sonner";
import { EntityType__Enum } from "@tipper/shared";
import { useEntityLogo } from "../../hooks/entities_media_hooks";
import LogoViewComponent from "@/components/logo_view_component";
import {
  UpdateEntityPayloadSchema,
  type EntityProfileFormData,
  formDataToPayload,
} from "./entity_profile_setup_types";
import ContactSection from "./sections/contact_section";
import OwnerSection from "./sections/owner_section";
import ScheduleSection from "./sections/schedule_section";
import LocationSection from "./sections/location_section";
import { normalizeInstagramHandle } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";

interface EntityProfileSetupProps {
  entityId: string;
}

const EntityProfileSetup = ({ entityId }: EntityProfileSetupProps) => {
  const {
    data: entity,
    isLoading,
    isError,
    refetch,
  } = useEntityDetails(entityId, 1000 * 20);
  const [editMode, setEditMode] = useState(true);
  const { data: entityLogo } = useEntityLogo(entityId);

  // Transform entity data to form values - memoized to prevent unnecessary re-renders
  const formValues: EntityProfileFormData | undefined = useMemo(() => {
    if (!entity) return undefined;
    return {
      name: entity.name || "",
      description: entity.description || "",
      address: entity.address || {
        street: "",
        neighborhood: "",
        city: "",
        country: "",
      },
      phone: entity.phone || "",
      email: entity.email || "",
      instagram_url: entity.instagram_url || "",
      latitude: entity.latitude ?? undefined,
      longitude: entity.longitude ?? undefined,
      owner_name: entity.owner_name || "",
      owner_phone_number: entity.owner_phone_number || "",
      schedule: entity.schedule || {},
      entity_type: entity.entity_type || EntityType__Enum.BUSINESS,
      operates_online: entity.operates_online ?? false,
      metadata: entity.metadata || {},
    };
  }, [entity]);

  // Memoize defaultValues to prevent object recreation on every render
  const defaultFormValues = useMemo<EntityProfileFormData>(
    () => ({
      name: "",
      description: "",
      address: {
        street: "",
        neighborhood: "",
        city: "",
        country: "",
      },
      phone: "",
      email: "",
      instagram_url: "",
      latitude: undefined,
      longitude: undefined,
      owner_name: "",
      owner_phone_number: "",
      schedule: {},
      entity_type: EntityType__Enum.BUSINESS,
      operates_online: false,
      metadata: {},
    }),
    []
  );

  const form: UseFormReturn<EntityProfileFormData> =
    useForm<EntityProfileFormData>({
      resolver: zodResolver(UpdateEntityPayloadSchema),
      values: formValues, // Automatically syncs form with entity data when it changes
      defaultValues: defaultFormValues,
      mode: "onSubmit", // Only validate on submit - prevents expensive re-renders
      reValidateMode: "onSubmit", // Only re-validate on submit after errors
      shouldUnregister: false, // Keep form values in DOM
    });
  const router = useRouter();
  const isSaving = form.formState.isSubmitting;

  if (isLoading)
    return (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading business details...
      </div>
    );
  if (isError || !entity)
    return (
      <div className="p-6 text-destructive">
        Failed to load business details.
      </div>
    );

  const handleSave = async (data: EntityProfileFormData) => {
    console.log("[EntityProfileSetup] handleSave called with data:", data);
    try {
      // Normalize Instagram handle before saving
      const normalizedData = {
        ...data,
        instagram_url: data.instagram_url
          ? `@${normalizeInstagramHandle(data.instagram_url)}`
          : undefined,
      };

      // Convert form data to API payload (type-safe, excludes logo_url)
      const payload = formDataToPayload(normalizedData);

      console.log("[EntityProfileSetup] Saving entity profile:", payload);
      await updateEntityProfile(entityId, payload);

      // Refetch entity data to get the latest saved values
      await refetch();

      // Reset form with fresh data to clear dirty state
      form.reset();

      setEditMode(false);
      router.push(`/entities/${entityId}/${entity.entity_type}/profile`);
      toast.success("Entity profile updated successfully!");
    } catch (err: any) {
      console.error("[EntityProfileSetup] Save error:", err);
      toast.error(
        `Failed to update entity profile: ${err.message || "Unknown error"}`
      );
    }
  };

  return (
    <FormProvider {...form}>
      <div className="w-full p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 lg:mb-8">
          <div className="flex items-center gap-4">
            <LogoViewComponent entityId={entityId} entity_name={entity.name} />
            <div className="flex-1">
              {editMode ? (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="text-2xl sm:text-3xl font-bold text-foreground"
                    />
                  )}
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground capitalize">
                  {entity.name}
                </h1>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditMode(false);
                  }}
                  disabled={isSaving}
                  type="button"
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isSaving) return; // Prevent multiple clicks
                    console.log(
                      "[EntityProfileSetup] Header save button clicked"
                    );
                    form.handleSubmit(handleSave, (errors) => {
                      console.error(
                        "[EntityProfileSetup] Validation errors:",
                        errors
                      );
                      toast.error("Please fix the form errors before saving");
                    })(e);
                  }}
                  disabled={isSaving}
                  type="button"
                  className="relative disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={isSaving ? "Saving..." : "Save changes"}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 text-tertiary animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 text-tertiary" />
                  )}
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("[EntityProfileSetup] Edit button clicked");
                  setEditMode(true);
                }}
                type="button"
              >
                <Edit className="h-4 w-4 text-primary" />
              </Button>
            )}
          </div>
        </div>

        {/* Main Content - Flex layout: stacked on mobile, split on lg */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Basic Info (on lg screens) */}
          <div className="  space-y-4 gap-2  md:w-1/2">
            {/* Entity Type */}
            <div className="space-y-2">
              <Label htmlFor="entity_type" className="text-base font-semibold">
                Entity Type
              </Label>
              <p className="text-sm text-muted-foreground">
                Select the category that best describes your organization. This
                helps customers find and understand your entity type.
              </p>
              {editMode ? (
                <FormField
                  control={form.control}
                  name="entity_type"
                  render={({ field }) => (
                    <Select
                      value={field.value || EntityType__Enum.BUSINESS}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full" id="entity_type">
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EntityType__Enum.BUSINESS}>
                          Business
                        </SelectItem>
                        <SelectItem
                          value={EntityType__Enum.SOCIAL_ORGANIZATION}
                        >
                          Social Organization
                        </SelectItem>
                        <SelectItem
                          value={EntityType__Enum.NON_GOVERNMENTAL_ORGANIZATION}
                        >
                          Non-Governmental Organization
                        </SelectItem>
                        <SelectItem value={EntityType__Enum.CIVIC_ORGANIZATION}>
                          Civic Organization
                        </SelectItem>
                        <SelectItem value={EntityType__Enum.GUILD}>
                          Guild
                        </SelectItem>
                        <SelectItem value={EntityType__Enum.PERSONAL_BRAND}>
                          Personal Brand
                        </SelectItem>
                        <SelectItem value={EntityType__Enum.OTHER}>
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {entity.entity_type
                    ? entity.entity_type
                        .split("_")
                        .map(
                          (word: any) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")
                    : "Business"}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Description
              </Label>
              <p className="text-sm text-muted-foreground">
                Provide a clear and engaging description of your entity. Include
                what you do, your mission, and what makes you unique. This helps
                customers understand your value proposition.
              </p>
              {editMode ? (
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Example: A family-owned restaurant specializing in authentic Italian cuisine, serving fresh pasta and wood-fired pizzas since 2010. We pride ourselves on using locally sourced ingredients and creating a warm, welcoming atmosphere for all our guests."
                      rows={4}
                      className="resize-none"
                    />
                  )}
                />
              ) : (
                <p className="text-muted-foreground">
                  {entity.description || "No description provided."}
                </p>
              )}
            </div>

            {/* Contact Information Section */}
            <ContactSection form={form} editMode={editMode} entity={entity} />

            {/* Owner Information Section */}
            <OwnerSection form={form} editMode={editMode} entity={entity} />

            {/* Business Hours Section */}
            <ScheduleSection form={form} editMode={editMode} entity={entity} />
          </div>
          {/* Location Information Section */}
          <div className="space-y-4 gap-2 md:w-1/2">
            <LocationSection form={form} editMode={editMode} entity={entity} />
          </div>
        </div>

        {/* Save Button */}
        {editMode && (
          <div className="mt-6 lg:mt-8 w-full">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isSaving) return; // Prevent multiple clicks
                console.log("[EntityProfileSetup] Save button clicked");
                console.log(
                  "[EntityProfileSetup] Form errors:",
                  form.formState.errors
                );
                console.log(
                  "[EntityProfileSetup] Form values:",
                  form.getValues()
                );
                form.handleSubmit(handleSave, (errors) => {
                  console.error(
                    "[EntityProfileSetup] Validation errors:",
                    errors
                  );
                  toast.error("Please fix the form errors before saving");
                })(e);
              }}
              disabled={isSaving}
              className="bg-primary text-white w-full lg:w-auto lg:min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default EntityProfileSetup;
