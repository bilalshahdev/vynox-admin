import Container from "@/components/Container";
import CityForm from "@/components/forms/CityForm";
import Cities from "@/components/pages/cities-page";

const CitiesPage = () => {
  return (
    <Container
      title="Cities"
      addBtnTitle="City"
      isDialog
      dialogContent={<CityForm />}
    >
      <Cities />
    </Container>
  );
};

export default CitiesPage;
