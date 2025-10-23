// src/app/servers/[id]/status/page.tsx

import Container from "@/components/Container";
import ServerStatus from "@/components/pages/ServerStatus";

const ServerStatusPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <Container title="Server Status">
      <ServerStatus ip={id} />
    </Container>
  );
};

export default ServerStatusPage;
