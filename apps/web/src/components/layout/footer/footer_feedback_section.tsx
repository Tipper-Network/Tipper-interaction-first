"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WHATSAPP_TIPPER_PHONE } from "@/lib/constants/randoms";
import { ArrowRightIcon } from "@/icons/utility_icons";

const FooterFeedbackSection = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    const formattedPhone = WHATSAPP_TIPPER_PHONE.replace(/\D/g, "");

    setIsSubmitting(true);

    try {
      // TODO: Wire this to the real API client later
      console.log("Feedback submission:", feedback);

      // Simulate API call
      const whatsappUrl = `https://wa.me/${formattedPhone || ""}?text=${encodeURIComponent(feedback)}`;
      router.push(whatsappUrl);
      toast.success("Thank you for your feedback!");
      setFeedback("");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-pink-50/50 rounded-lg  h-auto max-w-sm">
      <h3 className="text-dark font-semibold mb-4 text-lg">Feedback</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2 items-start">
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What did you see???"
            className="flex-1 min-h-[120px] resize-none bg-white"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !feedback.trim()}
            className="bg-primary hover:bg-primary-shade text-white px-3 py-2 h-auto min-h-[120px] flex items-center justify-center"
            size="icon"
          >
            <ArrowRightIcon size={36} />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          open your heart. the day will come when this no longer matters.
        </p>
      </form>
    </div>
  );
};

export default FooterFeedbackSection;
