import Container from "@/components/Container";
import PageForm from "@/components/forms/PageForm";

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Container title="Edit Page">
      <PageForm id={id} />
    </Container>
  );
};

export default EditPage;
