import Link from "next/link";
import React from "react";

const InstagramUrlLink = ({
  instagram_url,
}: {
  instagram_url: string | null;
}) => {
  return (
    <div>
      <p>
        {instagram_url ? (
          <Link
            href={
              instagram_url.startsWith("http")
                ? instagram_url
                : `https://instagram.com/${instagram_url.replace(/^@/, "")}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:underline"
          >
            @{instagram_url}
          </Link>
        ) : (
          "N/A"
        )}
      </p>
    </div>
  );
};
export default InstagramUrlLink;
