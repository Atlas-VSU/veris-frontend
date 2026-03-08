"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Separator } from "@/src/components/ui/separator";
import type { PaymentLog } from "../../../types";
import Image from "next/image";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: PaymentLog | null;
};

export default function ReceiptPreviewDialog({
  open,
  onOpenChange,
  receipt,
}: Props) {
  function handlePrint() {
  if (!receipt) return

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt - ${receipt.id}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: sans-serif; display: flex; justify-content: center; padding: 32px; background: white; }
          .receipt { border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; width: 320px; font-size: 14px; color: #000; }
          .header { text-align: center; margin-bottom: 16px; }
          .header img { width: 40px; height: 40px; margin: 0 auto 8px; display: block; }
          .org-name { font-weight: 700; font-size: 16px; }
          .university { font-size: 11px; margin-top: 2px; }
          .subtitle { font-size: 11px; color: #6b7280; margin-top: 2px; }
          hr { border: none; border-top: 1px solid #e5e7eb; margin: 12px 0; }
          .row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
          .value { font-weight: 500; }
          .section-label { font-size: 11px; color: #6b7280; margin-bottom: 4px; }
          .student-name { font-weight: 500; font-size: 14px; }
          .student-id { font-size: 11px; margin-top: 2px; }
          .total-row { display: flex; justify-content: space-between; font-weight: 600; font-size: 16px; }
          .footer { text-align: center; font-size: 11px; }
          .footer p + p { margin-top: 4px; }
          .footer-note { margin-top: 24px; text-align: center; font-size: 11px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <img src="/ussc-logo-1.webp" alt="Org Logo" />
            <p class="org-name">University Supreme Student Council</p>
            <p class="university">Visayas State University Main Campus</p>
            <p class="subtitle">Official Payment Receipt</p>
          </div>

          <hr />
          <div class="row"><span>Receipt No.</span><span class="value">${receipt.id}</span></div>
          <div class="row"><span>Date</span><span>${receipt.paidAt}</span></div>

          <hr />
          <p class="section-label">Received From</p>
          <p class="student-name">${receipt.studentName}</p>
          <p class="student-id">${receipt.studentId}</p>

          <hr />
          <div class="row"><span>${receipt.feeName}</span><span>₱${receipt.amountPaid.toLocaleString()}</span></div>

          <hr />
          <div class="total-row"><span>Total Paid</span><span>₱${receipt.amountPaid.toLocaleString()}</span></div>

          <hr />
          <div class="footer">
            <p>Payment Method: ${receipt.paymentMethod}</p>
            <p>Verified by ${receipt.verifiedBy}</p>
          </div>
          <p class="footer-note">This serves as an official proof of payment.</p>
        </div>
      </body>
    </html>
  `

  const newWindow = window.open("", "", "width=600,height=700")
  if (newWindow) {
    newWindow.document.write(html)
    newWindow.document.close()
    //newWindow.print()
  }
}

  if (!receipt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
          <DialogDescription>Preview before printing</DialogDescription>
        </DialogHeader>

        <div
          id="receipt-print"
          className="border rounded-lg p-6 bg-white text-black text-sm max-w-sm mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-4">
            <Image
              src="/ussc-logo-1.webp"
              alt="Org Logo"
              width={40}
              height={40}
              className="mx-auto mb-2"
            />
            <p className="font-bold text-lg">University Supreme Student Council</p>
            <p className="text-xs">Visayas State University - Baybay Main Campus</p>
            <p className="text-xs text-muted-foreground">
              Official Payment Receipt
            </p>
          </div>

          <Separator className="my-3" />

          {/* Receipt Info */}
          <div className="flex justify-between text-xs">
            <span>Receipt No.</span>
            <span className="font-medium">{receipt.id}</span>
          </div>

          <div className="flex justify-between text-xs">
            <span>Date</span>
            <span>{receipt.paidAt}</span>
          </div>

          <Separator className="my-3" />

          {/* Student Info */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Received From</p>
            <p className="font-medium">{receipt.studentName}</p>
            <p className="text-xs">{receipt.studentId}</p>
          </div>

          <Separator className="my-3" />

          {/* Payment Details */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{receipt.feeName}</span>
              <span>₱{receipt.amountPaid.toLocaleString()}</span>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Total */}
          <div className="flex justify-between font-semibold text-base">
            <span>Total Paid</span>
            <span>₱{receipt.amountPaid.toLocaleString()}</span>
          </div>

          <Separator className="my-4" />

          {/* Footer */}
          <div className="text-center text-xs space-y-1">
            <p>Payment Method: {receipt.paymentMethod}</p>
            <p>Verified by {receipt.verifiedBy}</p>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            This serves as an official proof of payment.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <Button onClick={handlePrint}>Print</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
