import Container from "@/components/Container";
import { AdsPage } from "@/components/pages/ads-page";

export default function AdsManagementPage() {
  return (
    <Container title="Ads Management" addBtnTitle="Add New Ad">
      <AdsPage />
    </Container>
  );
}
