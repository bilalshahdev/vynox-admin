import Container from "@/components/Container";
import { AdForm } from "@/components/forms/AdForm";

const EditAdPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Container title="Edit Ad">
      <AdForm id={id} />
    </Container>
  );
};

export default EditAdPage;
