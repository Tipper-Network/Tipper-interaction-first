import EntityOnboardingForm from "@/features/onboarding/components/entity_onboarding_form/entity_onboarding_form";

interface Props {
  params: Promise<{ id: string }>;
}

const SetupEntityIdentityPage = async ({ params }: Props) => {
  // const [entityId, setEntityId] = useState<string | null>(null);
  const { id: entityId } = await params;

  return (
    <>
      <EntityOnboardingForm entityId={entityId} />
    </>
  );
};

export default SetupEntityIdentityPage;
