import React from "react";
import Image from "next/image";
import { useEntityLogo } from "@/views/entities/shared/hooks/entities_media_hooks";

const LogoViewComponent = ({
  entityId,
  entity_name,
}: {
  entityId: string;
  entity_name?: string;
}) => {
  const { data: entityLogoData } = useEntityLogo(entityId);
  return (
    <>
      <div>
        {entityLogoData?.url ? (
          <Image
            src={entityLogoData.url}
            alt={entity_name || "Community"}
            width={80}
            height={80}
            className="rounded-full object-cover bg-primary-tint "
          />
        ) : (
          <Image
            src={"/assets/icons/Tipper_Icons_Event_Circle_Ruby.svg"}
            alt="Ze Logo"
            width={80}
            height={80}
            className="rounded-full border bg-primary-tint object-cover flex-shrink-0 "
          />
        )}
      </div>
    </>
  );
};

export default LogoViewComponent;
