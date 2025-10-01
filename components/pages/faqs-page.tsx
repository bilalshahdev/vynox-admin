"use client";

import { useDeleteFaq, useGetFaqs } from "@/hooks/useFaqs";
import Loader from "../Loader";
import { useState } from "react";
import { DataTable } from "../DataTable";
import { TableCell } from "../ui/table";
import Tooltip from "../Tooltip";
import { Faq } from "@/types/api.types";
import TableActions from "../Actions";
import FaqForm from "../forms/FaqForm";

const Faqs = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetFaqs(page);
  const faqs: Faq[] = data?.data ?? [];
  const P = data?.pagination;
  const { mutate: deleteFaq, isPending: deleteLoading } = useDeleteFaq();
  const cols = ["Question", "Answer", "Actions"];

  if (isLoading) return <Loader />;

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
    <div>
      <DataTable data={faqs} cols={cols} row={row} pagination={pagination} />
    </div>
  );
};

export default Faqs;
