import Container from "@/components/Container";
import CountryForm from "@/components/forms/CountryForm";
import Countries from "@/components/pages/countries-page";

const CountriesPage = () => {
  return (
    <Container
      title="Countries"
      addBtnTitle="Country"
      isDialog
      dialogContent={<CountryForm />}
    >
      <Countries />
    </Container>
  );
};

export default CountriesPage;
