import React from "react";

type GoogleMapsUrlProps = {
  /**
   * Canonical: stored in DB (short-link token).
   */
  googleMapsToken?: string;
};

const GoogleMapsUrl = ({ googleMapsToken }: GoogleMapsUrlProps) => {
  const token = googleMapsToken ?? null;
  if (!token) return null;

  return (
    <div>
      <a
        href={`https://maps.app.goo.gl/${token}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open map
      </a>
    </div>
  );
};

export default GoogleMapsUrl;
