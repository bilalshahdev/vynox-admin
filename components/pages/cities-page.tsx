"use client";

import { useDeleteCity, useGetCities } from "@/hooks/useCity";
import { City } from "@/types/api.types";
import { useState } from "react";
import TableActions from "../Actions";
import { DataTable } from "../DataTable";
import CityForm from "../forms/CityForm";
import Tooltip from "../Tooltip";
import { TableCell } from "../ui/table";

const Cities = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetCities(page);
  const cities: City[] = data?.data ?? [];
  const P = data?.pagination;
  const { mutate: deleteCity, isPending: deleteLoading } = useDeleteCity();

  const cols = ["Name", "State", "Country", "Latitude", "Longitude", "Actions"];

  const row = (city: City) => {
    const countryName =
      typeof city.country === "string"
        ? city.country
        : city.country?.name ?? "";
    return (
      <>
        <TableCell className="max-w-32 truncate">
          <Tooltip content={city.name}>
            <span>{city.name}</span>
          </Tooltip>
        </TableCell>
        <TableCell>{city.state}</TableCell>
        <TableCell>{countryName}</TableCell>
        <TableCell>{city.latitude}</TableCell>
        <TableCell>{city.longitude}</TableCell>
        <TableCell>
          <TableActions
            id={city._id}
            baseRoute="/cities"
            module="City"
            editDialog={{
              title: "Edit City",
              content: <CityForm city={city} />,
            }}
            actions={["edit", "delete"]}
            onDelete={(id, closeDialog) =>
              deleteCity(id, {
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
  };

  const pagination = {
    page: P?.page,
    limit: P?.limit,
    total: P?.total,
    setPage,
  };

  return (
    <div>
      <DataTable
        isLoading={isLoading}
        data={cities}
        cols={cols}
        row={row}
        pagination={pagination}
      />
    </div>
  );
};

export default Cities;
