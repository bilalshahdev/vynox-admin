import Container from "@/components/Container";
import FaqForm from "@/components/forms/FaqForm";
import Faqs from "@/components/pages/faqs-page";

const FaqsPage = () => {
  return (
    <Container
      title="FAQs"
      addBtnTitle="Faq"
      isDialog
      dialogContent={<FaqForm />}
    >
      <Faqs />
    </Container>
  );
};

export default FaqsPage;
