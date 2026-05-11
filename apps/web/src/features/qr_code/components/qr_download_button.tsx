"use client";
import Image from "next/image";
import { NeutralDialog } from "@/components/neutral_dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import QrCodeStyling from "./qr_code_styling";

type QRCodeComponentProps = {
  logo?: string;
  id?: string;
  preferedSection?: string;
  dimentions: number;
  QrCodeMessage: string;
  disableClick?: boolean; // New prop to disable click handling when wrapped
  downloadUrl?: string;
  slug?: string;
};

export default function QRCodeComponent(props: QRCodeComponentProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (props.disableClick) {
      console.log("QRCodeComponent click disabled - letting parent handle it");
      return;
    }

    setOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        className="w-fill space-x-2 h-auto"
        onClick={handleClick}
      >
        <div>{props.QrCodeMessage}</div>
        <Image
          src="/icons/qr.svg"
          className=""
          alt=""
          height={props.dimentions}
          width={props.dimentions}
        />
      </Button>
      <NeutralDialog
        title={props.QrCodeMessage}
        description={props.QrCodeMessage}
        open={open}
        onOpenChange={setOpen}
        className=""
      >
        <QrCodeStyling
          logo={props.logo}
          downloadUrl={props.downloadUrl}
          preferedSection={props.preferedSection}
          slug={props.slug}
          downloadButton={true}
        />
        {/* <ManageQrCode /> */}
        <Button className="mt-4" onClick={() => setOpen(false)}>
          Close
        </Button>
      </NeutralDialog>
    </>
  );
}
