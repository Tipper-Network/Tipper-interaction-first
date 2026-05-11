import React from "react";

const WebsiteLink = ({
  websiteUrl,
  buttonText,
}: {
  websiteUrl: string;
  buttonText: string;
}) => {
  return (
    <div>
      <a
        href={websiteUrl}
        target="_blank"
        rel="noreferrer"
        className="font-medium underline decoration-muted-foreground/40 underline-offset-4"
      >
        {buttonText}
      </a>
    </div>
  );
};

export default WebsiteLink;
