// src/app/servers/[id]/edit/page.tsx

import Container from "@/components/Container";
import { ServerForm } from "@/components/forms/ServerForm";
import React from "react";

const EditServerPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <Container title="Edit Server">
      <ServerForm id={id} />
    </Container>
  );
};

export default EditServerPage;
