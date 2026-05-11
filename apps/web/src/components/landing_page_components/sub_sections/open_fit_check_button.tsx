"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { NeutralDialog } from "@/components/neutral_dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fitCheckSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email."),
  roleType: z.enum(["individual", "business", "community", "creator", "other"]),
  whoAreYou: z
    .string()
    .min(50, "Tell us a bit more about who you are (at least 50 characters)."),
  whyTipper: z
    .string()
    .min(50, "Tell us a bit more about why you want to get on Tipper."),
  currentReach: z.string().optional(),
  primaryLink: z
    .string()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "Please provide a valid URL."
    )
    .optional(),
  heardFrom: z
    .enum(["friend", "community", "social_media", "event", "other"])
    .optional(),
  heardFromOther: z.string().optional(),
  acceptContact: z
    .boolean()
    .refine((v) => v, "You need to allow us to contact you about this."),
});

type FitCheckFormValues = z.infer<typeof fitCheckSchema>;

export default function OpenFitCheckButton() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FitCheckFormValues>({
    resolver: zodResolver(fitCheckSchema),
    defaultValues: {
      fullName: "",
      email: "",
      roleType: "individual",
      whoAreYou: "",
      whyTipper: "",
      currentReach: "",
      primaryLink: "",
      heardFrom: undefined,
      heardFromOther: "",
      acceptContact: false,
    },
  });

  const heardFrom = form.watch("heardFrom");

  const onSubmit = async (values: FitCheckFormValues) => {
    // TODO: wire this to the real API client later
    console.log("Fit check submission:", values);
    setSubmitted(true);
    // you can keep values or reset them after success
    // reset();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      // Reset success state when closing
      setSubmitted(false);
      form.reset();
    }
  };

  return (
    <>
      <Button variant="secondary" size="lg" onClick={() => setOpen(true)}>
        Apply to get on Tipper
      </Button>

      <NeutralDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Fit Check – join Tipper"
        description="We manually onboard spaces that are a good fit. Tell us who you are and why you want to be on Tipper."
      >
        {submitted ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Thank you for your application. We&apos;ll review your fit and
              reach out if it&apos;s a match.
            </p>
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* About you */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Alex Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Who are you?</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Which one did you choose?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">
                              Initiator?
                            </SelectItem>
                          </SelectContent>
                          <SelectItem value="business">Pioneer? </SelectItem>
                          <SelectItem value="community">Innovator? </SelectItem>
                          <SelectItem value="other">Other? </SelectItem>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Narrative */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="whoAreYou"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tell us about you / your space</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Describe who you are, what you do, and the kind of space or work you hold."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whyTipper"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why do you want to be on Tipper?</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="What would you use Tipper for? How does it fit with your work or community?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Extra context */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentReach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Roughly how many people do you reach today? (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 200 monthly visitors, 1.2k IG followers"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Main link (website / IG / portfolio, optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heardFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        How did you hear about Tipper? (optional)
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="friend">Friend</SelectItem>
                            <SelectItem value="community">
                              Community / org
                            </SelectItem>
                            <SelectItem value="social_media">
                              Social media
                            </SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {heardFrom === "other" && (
                  <FormField
                    control={form.control}
                    name="heardFromOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell us more</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Where did you hear about Tipper?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Consent + actions */}
              <FormField
                control={form.control}
                name="acceptContact"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border border-input"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        I agree that Tipper can contact me about this
                        application and future onboarding.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Sending..."
                    : "Submit application"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </NeutralDialog>
    </>
  );
}
