"use client";

import { useDeleteFaq, useGetFaqs } from "@/hooks/useFaqs";
import { Faq } from "@/types/api.types";
import { useState } from "react";
import TableActions from "../Actions";
import { DataTable } from "../DataTable";
import FaqForm from "../forms/FaqForm";
import Tooltip from "../Tooltip";
import { TableCell } from "../ui/table";

const Faqs = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetFaqs(page);
  const faqs: Faq[] = data?.data ?? [];
  const P = data?.pagination;
  const { mutate: deleteFaq, isPending: deleteLoading } = useDeleteFaq();
  const cols = ["Question", "Answer", "Actions"];

  const row = (faq: Faq) => {
    return (
      <>
        <TableCell className="max-w-20 truncate">
          <Tooltip content={faq.question}>
            <span>{faq.question}</span>
          </Tooltip>
        </TableCell>
        <TableCell className="max-w-60 truncate">
          <Tooltip content={faq.answer}>
            <span>{faq.answer}</span>
          </Tooltip>
        </TableCell>
        <TableCell>
          <TableActions
            id={faq._id}
            baseRoute="/faqs"
            module="Faq"
            editDialog={{
              title: "Edit Faq",
              content: <FaqForm id={faq._id} />,
            }}
            // actions={["delete"]}
            actions={["edit", "delete"]}
            onDelete={(id, closeDialog) =>
              deleteFaq(id, {
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
    <DataTable
      data={faqs}
      isLoading={isLoading}
      cols={cols}
      row={row}
      pagination={pagination}
    />
  );
};

export default Faqs;
