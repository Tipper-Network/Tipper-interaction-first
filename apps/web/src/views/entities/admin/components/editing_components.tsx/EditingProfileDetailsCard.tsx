import React, { useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { updateEntityDetails } from "@/views/entities/shared/api/update_entitiy_api";
import { getEntityProfileDetailItems } from "@/views/entities/shared/utils/entity_items_resolver";
import { ProfileDetailsCard } from "@/views/entities/shared/components/profile_components/profile_details_card";
import {
  EntityDetailsDraftSchema,
  EntityDetailsDraft,
} from "@/views/entities/admin/validation/entity_details_schema";

type EditingProfileDetailsCardProps = {
  entity: any;
  isOwnEntity: boolean;
  onUpdated?: () => Promise<any> | void;
};

export default function EditingProfileDetailsCard({
  entity,
  isOwnEntity,
  onUpdated,
}: EditingProfileDetailsCardProps) {
  const asString = (v: unknown) => (typeof v === "string" ? v : "");
  const items = useMemo(
    () => getEntityProfileDetailItems(entity, { respectVisibility: false }),
    [entity]
  );

  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const form = useForm<EntityDetailsDraft>({
    resolver: zodResolver(EntityDetailsDraftSchema) as Resolver<EntityDetailsDraft>,
    defaultValues: {
      contact: {
        instagram_url: "@",
        phone: "",
        email: "",
      },
      address: {
        street: "",
        neighborhood: "",
        city: "",
        country: "",
      },
      links: {
        website: "",
        menuUrl: "",
        googleMapsUrl: "",
      },
      publicProfile: {
        instagramEnabled: true,
        phoneEnabled: true,
        emailEnabled: false,
        addressEnabled: true,
        websiteEnabled: false,
        menuEnabled: false,
        googleMapsEnabled: false,
      },
    },
    mode: "onSubmit",
  });

  const openDetailsSheet = () => {
    const links = (entity as any)?.metadata?.links ?? {};
    const publicProfile = (entity as any)?.metadata?.publicProfile ?? {};
    const googleMapsToken = links?.googleMapsToken ?? null;

    form.reset({
      contact: {
        instagram_url: (entity as any)?.instagram_url ?? "",
        phone: (entity as any)?.phone ?? "",
        email: (entity as any)?.email ?? "",
      },
      address: {
        street: (entity as any)?.address?.street ?? "",
        neighborhood: (entity as any)?.address?.neighborhood ?? "",
        city: (entity as any)?.address?.city ?? "",
        country: (entity as any)?.address?.country ?? "",
      },
      links: {
        website: links?.website ?? "",
        menuUrl: links?.menuUrl ?? "",
        // We store token in DB; show a share URL (user can still paste full URL or token)
        googleMapsUrl: googleMapsToken
          ? `https://maps.app.goo.gl/${googleMapsToken}`
          : "",
      },
      publicProfile: {
        instagramEnabled: publicProfile?.instagramEnabled ?? true,
        phoneEnabled: publicProfile?.phoneEnabled ?? true,
        emailEnabled: publicProfile?.emailEnabled ?? false,
        addressEnabled: publicProfile?.addressEnabled ?? true,
        websiteEnabled: publicProfile?.websiteEnabled ?? false,
        menuEnabled: publicProfile?.menuEnabled ?? false,
        googleMapsEnabled: publicProfile?.googleMapsEnabled ?? false,
      },
    });

    setEditDetailsOpen(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-2">
        <ProfileDetailsCard items={items} />
      </div>

      {isOwnEntity ? (
        <>
          <div className="flex justify-end">
            <Button variant="outline" onClick={openDetailsSheet}>
              Edit details
            </Button>
          </div>

          <Sheet open={editDetailsOpen} onOpenChange={setEditDetailsOpen}>
            <SheetContent
              side="bottom"
              overlayClassName="bg-black/10"
              className="h-[72dvh] rounded-t-2xl p-0"
            >
              <Form {...form}>
                <form
                  className="h-full flex flex-col overflow-hidden"
                  onSubmit={form.handleSubmit(async (values) => {
                    try {
                      // zodResolver already validates + normalizes (urls, empty->undefined, etc)
                      await updateEntityDetails(entity.id, values as any);
                      await onUpdated?.();
                      toast.success("Profile details updated");
                      setEditDetailsOpen(false);
                    } catch (e: any) {
                      toast.error("Failed to update profile details", {
                        description: e?.message ?? String(e),
                      });
                    }
                  })}
                >
                  <div className="flex items-center justify-center py-3">
                    <div className="h-1.5 w-12 rounded-full bg-muted" />
                  </div>

                  <SheetHeader className="px-4 pb-3">
                    <SheetTitle className="text-left">
                      Edit profile details
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground text-left">
                      Update contact info, address, and external links. Use the
                      switches to control what is public.
                    </p>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="text-sm font-semibold">Contact</div>

                        <FormField
                          control={form.control}
                          name="publicProfile.instagramEnabled"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between gap-3">
                              <FormLabel className="text-sm">
                                Instagram public
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={Boolean(field.value)}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contact.instagram_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">
                                Instagram
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={asString(field.value)}
                                  placeholder="@yourbusiness"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="publicProfile.phoneEnabled"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between gap-3 pt-2">
                              <FormLabel className="text-sm">
                                WhatsApp public
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={Boolean(field.value)}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contact.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">
                                WhatsApp
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={asString(field.value)}
                                  placeholder="+961..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="publicProfile.emailEnabled"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between gap-3 pt-2">
                              <FormLabel className="text-sm">
                                Email public
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={Boolean(field.value)}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contact.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={asString(field.value)}
                                  placeholder="contact@yourbusiness.com"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between gap-3 pt-3">
                          <div className="text-sm font-semibold">Address</div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm">Public</div>
                            <FormField
                              control={form.control}
                              name="publicProfile.addressEnabled"
                              render={({ field }) => (
                                <FormControl>
                                  <Switch
                                    checked={Boolean(field.value)}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              )}
                            />
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="address.street"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={asString(field.value)}
                                  placeholder="Street"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="address.neighborhood"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={asString(field.value)}
                                  placeholder="Neighborhood"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="address.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={asString(field.value)}
                                  placeholder="City"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="address.country"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={asString(field.value)}
                                  placeholder="Country"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2 pt-2 border-t">
                        <div className="text-sm font-semibold pt-3">Links</div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm">Website public</div>
                          <FormField
                            control={form.control}
                            name="publicProfile.websiteEnabled"
                            render={({ field }) => (
                              <FormControl>
                                <Switch
                                  checked={Boolean(field.value)}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="links.website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Website
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={asString(field.value)}
                                  placeholder="https://yourwebsite.com"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center justify-between gap-3 pt-2">
                          <div className="text-sm">Menu public</div>
                          <FormField
                            control={form.control}
                            name="publicProfile.menuEnabled"
                            render={({ field }) => (
                              <FormControl>
                                <Switch
                                  checked={Boolean(field.value)}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="links.menuUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Menu URL
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={asString(field.value)}
                                  placeholder="https://yourwebsite.com/menu"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center justify-between gap-3 pt-2">
                          <div className="text-sm">Google Maps public</div>
                          <FormField
                            control={form.control}
                            name="publicProfile.googleMapsEnabled"
                            render={({ field }) => (
                              <FormControl>
                                <Switch
                                  checked={Boolean(field.value)}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="links.googleMapsUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Google Maps share link
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={asString(field.value)}
                                  placeholder="https://maps.app.goo.gl/8ag7yR2xezRLPVRS8"
                                />
                              </FormControl>
                              <div className="text-xs text-muted-foreground">
                                You can paste the full share link,
                                `maps.app.goo.gl/...`, or just the token.
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t bg-background p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={
                          !form.formState.isDirty || form.formState.isSubmitting
                        }
                      >
                        {form.formState.isSubmitting ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => setEditDetailsOpen(false)}
                        type="button"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </>
      ) : null}
    </div>
  );
}
