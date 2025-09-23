"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (closeDialog: () => void) => void;
  loading?: boolean;
  variant?: "default" | "destructive";
  children: React.ReactNode;
  asChild?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  loading = false,
  variant = "default",
  children,
  asChild,
}) => {
  const [open, setOpen] = React.useState(false);
  const closeDialog = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              variant={variant}
              onClick={() => onConfirm?.(closeDialog)}
              disabled={loading}
            >
              {loading ? "Please wait..." : confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </>
    </Dialog>
  );
};

export default ConfirmDialog;
