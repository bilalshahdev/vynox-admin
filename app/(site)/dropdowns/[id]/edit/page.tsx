import Container from "@/components/Container";
import DropdownForm from "@/components/forms/DropdownForm";

const EditDropdown = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <Container title="Edit Dropdown">
      <DropdownForm id={id} />
    </Container>
  );
};

export default EditDropdown;
