"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement, ReactElement, useState } from "react";
import { Button } from "./ui/button";

interface Props {
  addBtnTitle: string;
  isDialog?: boolean;
  dialogContent?: React.ReactNode;
  modal?: boolean;
}

const AddButton = ({
  addBtnTitle,
  isDialog = false,
  dialogContent,
  modal = true,
}: Props) => {
  const pathname = usePathname();
  const href = `${pathname}/add`;
  const [open, setOpen] = useState(false);

  const ButtonContent = (
    <Button variant="signature">
      <Plus />
      <span className="hidden sm:inline-block capitalize">{`Add ${addBtnTitle}`}</span>
    </Button>
  );

  if (isDialog && dialogContent) {
    return (
      <Dialog modal={modal} open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{ButtonContent}</DialogTrigger>
        <DialogContent className=" max-h-[500px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add {addBtnTitle}</DialogTitle>
            {/* <DialogDescription>
              Add a new {addBtnTitle} to the system.
            </DialogDescription> */}
          </DialogHeader>
          {dialogContent &&
            cloneElement(
              dialogContent as ReactElement<{ closeDialog: () => void }>,
              {
                closeDialog: () => setOpen(false),
              }
            )}
        </DialogContent>
      </Dialog>
    );
  }

  return <Link href={href}>{ButtonContent}</Link>;
};

export default AddButton;
