"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitClaimRequest } from "../../api/entities_api";
import {
  EntityUserPositionType__Enum,
  EntityType__Enum,
  VerificationType__Enum,
} from "@tipper/shared";
import { MediaType__Enum } from "@tipper/shared";
import { RequestClaimStatus__Enum } from "@tipper/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Building2,
  Mail,
  Phone,
  FileText,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  Camera,
  File,
  Mic,
  FileImage,
  Instagram,
  Info,
} from "lucide-react";
import BackButton from "@/components/back_button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { normalizeInstagramHandle } from "@/lib/utils/utils";
import {
  ClaimRequestFormSchema,
  type ClaimRequestFormData,
} from "./types/claim_request_schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const VerificationTypes = Object.values(VerificationType__Enum);
const ClaimMediaTypes = Object.values(MediaType__Enum);

interface ClaimRequestComponentProps {
  entity_id: string;
  community_id: string;
}

const ClaimRequestComponent = ({
  entity_id,
  community_id,
}: ClaimRequestComponentProps) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaTypes, setMediaTypes] = useState<{ type: MediaType__Enum }[]>([]);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const form = useForm<ClaimRequestFormData>({
    resolver: zodResolver(ClaimRequestFormSchema),
    defaultValues: {
      entity_email: "",
      entity_phone: "",
      instagram_url: "@",
      entity_type: EntityType__Enum.BUSINESS,
      verification_type: VerificationType__Enum.EMAIL,
      additional_notes: "",
      // user_entity_position: EntityUserPositionType__Enum.STAFF,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...filesArray]);
      // Default all uploads to IMAGE type
      setMediaTypes((prev) => [
        ...prev,
        ...filesArray.map(() => ({ type: MediaType__Enum.IMAGE })),
      ]);
    }
  };

  const handleMediaTypeChange = (index: number, type: MediaType__Enum) => {
    const updated = [...mediaTypes];
    updated[index] = { type };
    setMediaTypes(updated);
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="h-4 w-4" />;
    if (type.startsWith("video/")) return <Camera className="h-4 w-4" />;
    if (type.startsWith("audio/")) return <Mic className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onSubmit = async (data: ClaimRequestFormData) => {
    setSubmitStatus("idle");
    setErrorMessage("");
    console.log("data", data);
    try {
      // Normalize Instagram handle if provided
      const normalizedInstagramUrl = data.instagram_url
        ? normalizeInstagramHandle(data.instagram_url)
        : undefined;

      const response = await submitClaimRequest({
        ...data,
        instagram_url: normalizedInstagramUrl,
        entity_id,
        community_id,
        entity_type: data.entity_type,
        claim_status: RequestClaimStatus__Enum.PENDING,
        mediaFiles,
        mediaTypes,
      });
      console.log("response", response);
      // Only proceed if we got a successful response
      if (response) {
        setSubmitStatus("success");
        // Show success toast
        toast.success("Claim submitted successfully!", {
          description:
            "Your claim request has been submitted and is under review. We&apos;ll contact you within 2-3 business days.",
          duration: 5000,
        });

        // Reset form
        form.reset();
        setMediaFiles([]);
        setMediaTypes([]);

        // Redirect back to previous page after a short delay to show success message
        setTimeout(() => {
          router.back();
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      setSubmitStatus("error");
      setErrorMessage(err.message || "Failed to submit claim request");
      // Show error toast
      toast.error("Failed to submit claim", {
        description: err.message || "Please try again later.",
        duration: 5000,
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const handleChange = (key: string, value: any) => {
    form.setValue(key as keyof ClaimRequestFormData, value);
  };
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <BackButton buttonText="Entity Community" />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Yass you are Claiming Your space
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Verify your ownership and take control of your entity listing on
            Tipper
          </p>
        </div>

        {/* Verification Process Notice */}
        <Alert className="mb-6 border-tertiary bg-tertiary/10">
          <Shield className="h-5 w-5 text-tertiary" />
          <AlertTitle className="text-base font-semibold text-foreground">
            Verification Process
          </AlertTitle>
          <AlertDescription className="mt-2 text-sm text-foreground">
            After you submit this claim, a member of the Tipper team will{" "}
            <strong>contact you directly</strong> to verify your ownership. We
            will reach out via the contact information you provide below to
            complete the verification check. Please ensure all information is
            accurate and up-to-date.
          </AlertDescription>
        </Alert>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <Card className="mb-6 border-tertiary bg-tertiary-tint">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-tertiary" />

                <div>
                  <h3 className="font-semibold text-tertiary">
                    Claim Submitted Successfully!
                  </h3>
                  <p className="text-tertiary text-sm">
                    Your claim request has been submitted and is under review.
                    You&apos;ll be redirected to the community page shortly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {submitStatus === "error" && (
          <Card className="mb-6 border-primary bg-primary-tint">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-primary" />

                <div>
                  <h3 className="font-semibold text-primary">
                    Submission Failed
                  </h3>
                  <p className="text-primary text-sm">{errorMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Entity Verification Details
            </CardTitle>
            <CardDescription>
              Provide your entity contact information and verification method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-primary/50 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle className="text-sm font-semibold text-foreground">
                Important: Contact Information Must Match
              </AlertTitle>
              <AlertDescription className="mt-2 text-sm text-muted-foreground">
                The <strong>Email</strong>, <strong>Phone</strong>, and{" "}
                <strong>Instagram</strong> you provide below must match the
                information currently associated with this entity in the
                community listing. This is crucial for verification purposes.
                <br />
                <br />
                <strong>Note:</strong> If your claim is approved, these contact
                details will automatically update the entity&apos;s email,
                phone, and Instagram URL in our system.
              </AlertDescription>
            </Alert>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                encType="multipart/form-data"
                className="space-y-6"
              >
                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="entity_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Entity Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="business@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="entity_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Entity Phone
                          </FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value || ""}
                              onChange={field.onChange}
                              defaultCountry="lb" // Lebanon
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instagram_url"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className="flex items-center gap-2">
                            <Instagram className="h-4 w-4" />
                            Entity Instagram username (with @)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="@InstagramHandle" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Entity Type */}
                  <FormField
                    control={form.control}
                    name="entity_type"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="flex items-center gap-2">
                          <Instagram className="h-4 w-4" />
                          Entity Type
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Label
                              htmlFor="entity_type"
                              className="text-base font-semibold"
                            >
                              Entity Type
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Select the category that best describes your
                              organization. This helps customers find and
                              understand your entity type.
                            </p>

                            <Select
                              value={field.value || EntityType__Enum.BUSINESS}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className="w-full"
                                id="entity_type"
                              >
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
                                  value={
                                    EntityType__Enum.NON_GOVERNMENTAL_ORGANIZATION
                                  }
                                >
                                  Non-Governmental Organization
                                </SelectItem>
                                {/* <SelectItem value={EntityType__Enum.CIVIC_ORGANIZATION}>
                    Civic Organization
                  </SelectItem> */}
                                <SelectItem
                                  value={EntityType__Enum.PERSONAL_BRAND}
                                >
                                  Personal Brand
                                </SelectItem>
                                <SelectItem value={EntityType__Enum.OTHER}>
                                  Other
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="verification_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Method</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                          >
                            {VerificationTypes.map((type) => (
                              <option key={type} value={type}>
                                {type.replace("_", " ")}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* 
                  <FormField
                    control={form.control}
                    name="user_entity_position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Your Position in the Entity
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem
                              value={EntityUserPositionType__Enum.OWNER}
                            >
                              Owner
                            </SelectItem>
                            <SelectItem
                              value={EntityUserPositionType__Enum.MANAGER}
                            >
                              Manager
                            </SelectItem>
                            <SelectItem
                              value={EntityUserPositionType__Enum.STAFF}
                            >
                              Staff
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Please select your role within this entity
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <FormField
                    control={form.control}
                    name="additional_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Additional Notes
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional information that might help with verification..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* File Upload Section */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Supporting Documents
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload documents that prove your ownership (entity
                      license, utility bills, etc.)
                    </p>

                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload files or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Images, videos, audio, PDF, DOC (max 10MB each) for
                          entity verification
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* File List */}
                  {mediaFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">
                        Uploaded Files
                      </h4>
                      {mediaFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex-shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={mediaTypes[index]?.type || "IMAGE"}
                              onChange={(e) =>
                                handleMediaTypeChange(
                                  index,
                                  e.target.value as MediaType__Enum
                                )
                              }
                              className="text-xs px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-background text-foreground"
                            >
                              {ClaimMediaTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Submit Claim
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            By submitting this claim, you agree to our verification process.
            We&apos;ll review your submission and contact you within 2-3
            business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClaimRequestComponent;
