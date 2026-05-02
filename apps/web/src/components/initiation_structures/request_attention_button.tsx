"use client";

import React, { useEffect, useState } from "react";
import { NeutralDialog } from "@/components/NeutralDialog";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import RequestCallComponent from "@/components/landing_page_components/sub_sections/request_call_component";

interface RequestEntityInitiationButtonProps {
  title?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  expandButton?: boolean;
}

// WhatsApp contact for entity initiation requests
// Update this with your actual WhatsApp business number
const WHATSAPP_MESSAGE =
  "Hello! I'd like to request that my entity be initiated on Tipper. Can you help me get started?";

export default function RequestEntityInitiationButton({
  title = "Request your entity to be initiated",
  className,
  variant = "outline",
  expandButton = false,
}: RequestEntityInitiationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Expand the button
    setIsExpanded(true);

    // After 3 seconds, retract it
    const timer = setTimeout(() => {
      setIsExpanded(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {expandButton ? (
        <motion.button
          className="relative overflow-hidden bg-tertiary text font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow  "
          initial={{ width: 56, height: 56 }}
          animate={{
            width: isExpanded ? "auto" : 56,
            height: 56,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex items-center  ">
            {!isExpanded && (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isExpanded ? 1 : 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center "
              >
                <Image
                  src="/assets/icons/Tipper_Icons_People_Circle_Emerald.svg"
                  alt="initiate community "
                  width={200}
                  height={200}
                />
              </motion.div>
            )}
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="whitespace-nowrap flex items-center px-3"
                >
                  <Image
                    src="/assets/icons/Tipper_Icons_People_Circle_Emerald.svg"
                    alt="initiate community "
                    width={40}
                    height={40}
                  />
                  <span className="text-white">Initiate A Community</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      ) : (
        <Button
          variant={variant}
          onClick={() => setIsModalOpen(true)}
          className={className}
        >
          <Image
            className="h-12 w-12 "
            src="/assets/icons/Tipper_Icons_People_Transparent_Emerald.svg"
            alt="initiate community "
            width={40}
            height={40}
          />
          {title}
        </Button>
      )}

      <NeutralDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Can't make a phone call?"
        description="Click the button bellow to start a conversation with the dude in charge. We'll help you get your entity set up on Tipper."
        titleClassName="text-primary"
        className="-p-8 -px-8"
        childrenClassName="px-0 py-0"
      >
        <RequestCallComponent />
      </NeutralDialog>
    </>
  );
}
