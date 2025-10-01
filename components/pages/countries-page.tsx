"use client";

import { useDeleteCountry, useGetCountries } from "@/hooks/useCountry";
import Loader from "../Loader";
import { useState } from "react";
import { DataTable } from "../DataTable";
import { TableCell } from "../ui/table";
import Tooltip from "../Tooltip";
import { Country } from "@/types/api.types";
import TableActions from "../Actions";
import CountryForm from "../forms/CountryForm";

const Countries = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetCountries(page);
  const countries: Country[] = data?.data ?? [];
  const P = data?.pagination;
  const { mutate: deleteCountry, isPending: deleteLoading } =
    useDeleteCountry();

  const cols = ["Name", "Slug", "Country Code", "Actions"];

  if (isLoading) return <Loader />;

  const row = (country: Country) => (
    <>
      <TableCell className="max-w-32 truncate">
        <Tooltip content={country.name}>
          <span>{country.name}</span>
        </Tooltip>
      </TableCell>
      <TableCell>{country.slug}</TableCell>
      <TableCell>{country.country_code || country._id}</TableCell>
      <TableCell>
        <TableActions
          id={country._id}
          baseRoute="/countries"
          module="Country"
          editDialog={{
            title: "Edit Country",
            content: <CountryForm country={country} />,
          }}
          actions={["edit", "delete"]}
          onDelete={(id, closeDialog) =>
            deleteCountry(id, {
              onSuccess: () => {
                closeDialog();
              },
            })
          }
          deleteLoading={deleteLoading}
        />
      </TableCell>
    </>
  );

  const pagination = {
    page: P?.page,
    limit: P?.limit,
    total: P?.total,
    setPage,
  };

  return (
    <div>
      <DataTable
        data={countries}
        cols={cols}
        row={row}
        pagination={pagination}
      />
    </div>
  );
};

export default Countries;
