import { Loading } from "@/components/ui/loading";

/**
 * Loading state for entity setup identity page
 */
export default function SetupIdentityLoading() {
  return (
    <Loading variant="spinner" message="Loading setup..." fullPage={true} />
  );
}
