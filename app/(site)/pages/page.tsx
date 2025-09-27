// ./app/pages/page.tsx
import Container from "@/components/Container";
import { PagesPage } from "@/components/pages/pages-page";

export default function Pages() {
  return (
    <Container title="Pages" addBtnTitle="Add Page">
      <PagesPage />
    </Container>
  );
}
