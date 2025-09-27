import Container from "@/components/Container";
import DropdownDetails from "@/components/pages/dropdown-detail-page";
import React from "react";

const DropdownDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  if(!id) return
  return (
    <Container title="Dropdown details">
      <DropdownDetails id={id} />
    </Container>
  );
};

export default DropdownDetailPage;
