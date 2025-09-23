import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // ShadCN UI compatible
import Link from "next/link";
import { cloneElement, useState } from "react";
import { FiEdit2, FiEye, FiSettings, FiTrash2 } from "react-icons/fi";

import ConfirmDialog from "./ConfirmDialog";
import Tooltip from "./Tooltip";

type ActionType = "view" | "edit" | "delete" | "settings";

interface TableActionsProps {
  id: string;
  baseRoute: string;
  actions?: ActionType[];
  module?: string;
  onDelete?: (id: string, closeDialog: () => void) => void;
  deleteLoading?: boolean;

  // Optional dialog-based edit support
  editDialog?: {
    title: string;
    description?: string;
    content: React.ReactNode;
    modal?: boolean;
  };

  // ✅ Optional dialog-based view support
  viewDialog?: {
    title: string;
    description?: string;
    content: React.ReactNode;
    modal?: boolean;
  };
}

const TableActions: React.FC<TableActionsProps> = ({
  id,
  baseRoute,
  actions = ["view", "edit", "delete", "settings"],
  module = "Item",
  onDelete,
  deleteLoading = false,
  editDialog,
  viewDialog,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  return (
    <div className="flex gap-4 items-center">
      {/* ✅ View Action */}
      {actions.includes("view") && (
        <>
          {viewDialog?.title ? (
            <Dialog
              modal={viewDialog.modal}
              open={viewDialogOpen}
              onOpenChange={setViewDialogOpen}
            >
              <DialogTrigger>
                <Tooltip content={`View ${module}`}>
                  <FiEye size={18} className="cursor-pointer text-blue-500" />
                </Tooltip>
              </DialogTrigger>
              <DialogContent className="max-h-[500px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{viewDialog.title}</DialogTitle>
                  {viewDialog.description && (
                    <DialogDescription>
                      {viewDialog.description}
                    </DialogDescription>
                  )}
                </DialogHeader>
                {viewDialog.content &&
                  cloneElement(
                    viewDialog.content as React.ReactElement<{
                      closeDialog: () => void;
                    }>,
                    {
                      closeDialog: () => setViewDialogOpen(false),
                    }
                  )}
              </DialogContent>
            </Dialog>
          ) : (
            <Tooltip content={`View ${module}`}>
              <Link href={`${baseRoute}/${id}`}>
                <FiEye size={18} className="cursor-pointer text-blue-500" />
              </Link>
            </Tooltip>
          )}
        </>
      )}

      {/* ✅ Settings Action */}
      {actions.includes("settings") && (
        <Tooltip content={`Settings ${module}`}>
          <Link href={`${baseRoute}/${id}/settings`}>
            <FiSettings size={18} className="cursor-pointer text-blue-500" />
          </Link>
        </Tooltip>
      )}

      {/* ✅ Edit Action */}
      {actions.includes("edit") && (
        <>
          {editDialog?.title ? (
            <Dialog
              modal={editDialog.modal}
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
            >
              <DialogTrigger>
                <Tooltip content={`Edit ${module}`}>
                  <FiEdit2 size={18} className="cursor-pointer text-blue-500" />
                </Tooltip>
              </DialogTrigger>
              <DialogContent className="max-h-[500px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editDialog.title}</DialogTitle>
                  {editDialog.description && (
                    <DialogDescription>
                      {editDialog.description}
                    </DialogDescription>
                  )}
                </DialogHeader>
                {editDialog.content &&
                  cloneElement(
                    editDialog.content as React.ReactElement<{
                      closeDialog: () => void;
                    }>,
                    {
                      closeDialog: () => setEditDialogOpen(false),
                    }
                  )}
              </DialogContent>
            </Dialog>
          ) : (
            <Tooltip content={`Edit ${module}`}>
              <Link href={`${baseRoute}/${id}/edit`}>
                <FiEdit2 size={18} className="cursor-pointer text-blue-500" />
              </Link>
            </Tooltip>
          )}
        </>
      )}

      {/* ✅ Delete Action */}
      {actions.includes("delete") && onDelete && (
        <ConfirmDialog
          title={`Delete ${module}`}
          description={`Are you sure you want to delete this ${module.toLowerCase()}?`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={(closeDialog) => onDelete(id, closeDialog)}
          loading={deleteLoading}
          variant="destructive"
        >
          <Tooltip content={`Delete ${module}`}>
            <FiTrash2 size={18} className="cursor-pointer text-red-500" />
          </Tooltip>
        </ConfirmDialog>
      )}
    </div>
  );
};

export default TableActions;
