"use client";

import {
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import BusinessTypeInput from "../utils/business_type_input_field";
import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

export default function CommunityStepEntityInfo() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mb-4">
        <FormField
          control={form.control}
          name="operates_online"
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <div>
          <p className="font-medium">Online-only business</p>
          <p className="text-sm text-muted-foreground">
            Turn this on if you don&apos;t have a physical location to pin.
          </p>
        </div>
      </div>
      <FormField
        control={form.control}
        name="entityName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business/Organization Name *</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Enter the name of the business or organization"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="entityEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Email *</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Enter The business email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="entityPhoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Phone</FormLabel>
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
          <FormItem>
            <FormLabel>Business Instagram Handle </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Enter The business Instagram handle eg. @businessname"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value || ""}
                placeholder="Describe your business or organization"
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* <FormField
        control={form.control}
        name="businessTypeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Type *</FormLabel>
            <FormControl>
              <BusinessTypeInput
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
    </div>
  );
}
