// ./app/servers/page.tsx
import Container from "@/components/Container";
import { ServersPage } from "@/components/pages/servers-page";

export default function ServerManagementPage() {
  return (
    <Container title="Server Management" addBtnTitle="Add New Server">
      <ServersPage />
    </Container>
  );
}
