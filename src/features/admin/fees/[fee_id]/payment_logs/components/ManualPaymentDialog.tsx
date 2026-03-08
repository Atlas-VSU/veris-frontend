"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { PenLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import type { Fee } from "../../../types";

type AllStudentRow = {
  studentId: string;
  studentName: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: AllStudentRow | null;
  fee: Fee | undefined;
  manualLogDate: string;
  setManualLogDate: (date: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function ManualPaymentDialog({
  open,
  onOpenChange,
  target,
  fee,
  manualLogDate,
  setManualLogDate,
  onSubmit,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Manual Payment</DialogTitle>
          <DialogDescription>
            Record a direct payment for{" "}
            <span className="font-medium text-foreground">
              {target?.studentName}
            </span>
            . This will be marked as verified immediately.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {fee && (
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Fee</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {fee.title}
              </p>
              <p className="text-lg font-bold text-foreground mt-0.5">
                ₱{fee.amount.toLocaleString()}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="feeManualPayDate">
              Date of Payment <span className="text-destructive">*</span>
            </Label>
            <Input
              id="feeManualPayDate"
              type="date"
              value={manualLogDate}
              onChange={(e) => setManualLogDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-1.5">
              <PenLine className="size-3.5" /> Mark as Paid
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}