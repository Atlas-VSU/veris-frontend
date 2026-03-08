"use client";

import { use, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Eye,
  XCircle,
  MinusCircle,
  PenLine,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Separator } from "@/src/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { SearchInput } from "@/components/shared/SearchInput";
import { ViewToggle } from "@/components/shared/ViewToggle";
import type { ViewMode } from "@/components/shared/ViewToggle";
import { fees, paymentLogs as initialPaymentLogs } from "../../mock-data";
import { students } from "@/src/features/admin/members/mock-data";
import type { PaymentLog, PaymentLogStatus } from "../../types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/shared/StatCard";
import { DataPagination } from "@/components/shared/DataPagination";
import Image from "next/image";
import ReceiptPreviewDialog from "./components/ReceiptPreviewDialog";
import ManualPaymentDialog from "./components/ManualPaymentDialog";

const ITEMS_PER_PAGE = 10;

type RowStatus = PaymentLogStatus | "unpaid";

type AllStudentRow = {
  studentId: string;
  studentName: string;
  status: RowStatus;
  log?: PaymentLog;
};

const statusConfig: Record<
  RowStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof Clock;
  }
> = {
  pending_verification: {
    label: "Pending Verification",
    variant: "default",
    icon: Clock,
  },
  verified: { label: "Verified", variant: "secondary", icon: CheckCircle },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
  unpaid: { label: "Unpaid", variant: "outline", icon: MinusCircle },
};

const paymentMethodLabels: Record<string, string> = {
  gcash: "GCash",
  cash: "Cash",
};

export default function PaymentLogsPage({
  params,
}: {
  params: Promise<{ fee_id: string }>;
}) {
  const { fee_id } = use(params);
  const router = useRouter();

  const fee = fees.find((f) => f.id === fee_id);
  const [logs, setLogs] = useState<PaymentLog[]>(
    initialPaymentLogs.filter((l) => l.feeId === fee_id),
  );
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [dataView, setDataView] = useState<"submissions" | "all-students">(
    "submissions",
  );
  const [currentLogsPage, setCurrentLogsPage] = useState(1);
  const [currentRowsPage, setCurrentRowsPage] = useState(1);

  const [selectedLog, setSelectedLog] = useState<PaymentLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Manual payment state
  const [manualLogTarget, setManualLogTarget] = useState<AllStudentRow | null>(
    null,
  );
  const [manualLogOpen, setManualLogOpen] = useState(false);
  const [manualLogMethod, setManualLogMethod] = useState("cash");
  const [manualLogRef, setManualLogRef] = useState("");
  const [manualLogDate, setManualLogDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [receiptLog, setReceiptLog] = useState<PaymentLog | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  if (!fee) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Fee not found.</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => router.push("/admin-fees")}
        >
          <ArrowLeft className="size-4 mr-1" /> Back to Fees
        </Button>
      </div>
    );
  }

  // All-students unified rows: every approved/pending student matched with their log (or unpaid)
  const allStudentRows: AllStudentRow[] = students
    .filter((s) => s.status === "approved" || s.status === "pending")
    .map((s) => {
      const log = logs.find((l) => l.studentId === s.studentId);
      return {
        studentId: s.studentId,
        studentName: `${s.firstName} ${s.lastName}`,
        status: log ? log.status : "unpaid",
        log,
      };
    });

  // Filtered data for each view
  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.studentName.toLowerCase().includes(search.toLowerCase()) ||
      l.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredRows = allStudentRows.filter((r) => {
    if (r.status !== "unpaid") return false;
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalLogsPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentLogsPage - 1) * ITEMS_PER_PAGE,
    currentLogsPage * ITEMS_PER_PAGE,
  );

  const totalRowsPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE);
  const paginatedRows = filteredRows.slice(
    (currentRowsPage - 1) * ITEMS_PER_PAGE,
    currentRowsPage * ITEMS_PER_PAGE,
  );

  const pendingCount = logs.filter(
    (l) => l.status === "pending_verification",
  ).length;
  const verifiedCount = logs.filter((l) => l.status === "verified").length;
  const rejectedCount = logs.filter((l) => l.status === "rejected").length;
  const unpaidCount = allStudentRows.filter(
    (r) => r.status === "unpaid",
  ).length;

  function handleApprove(id: string) {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "verified" as PaymentLogStatus,
              verifiedBy: "Admin",
              verifiedAt: new Date().toISOString().split("T")[0],
            }
          : l,
      ),
    );
    toast.success("Payment verified successfully");
    setDetailOpen(false);
    setSelectedLog(null);
  }

  function handleReject(id: string) {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setLogs((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: "rejected" as PaymentLogStatus, rejectionReason }
          : l,
      ),
    );
    toast.success("Payment rejected");
    setRejectOpen(false);
    setDetailOpen(false);
    setSelectedLog(null);
    setRejectionReason("");
  }

  function openDetail(log: PaymentLog) {
    setSelectedLog(log);
    setDetailOpen(true);
  }

  function handleManualLog(e: React.FormEvent) {
    e.preventDefault();
    if (!manualLogTarget || !fee) return;
    const newLog: PaymentLog = {
      // eslint-disable-next-line react-hooks/purity
      id: `manual-${Date.now()}`,
      feeId: fee.id,
      feeName: fee.title,
      studentId: manualLogTarget.studentId,
      studentName: manualLogTarget.studentName,
      status: "verified",
      amountPaid: fee.amount,
      paymentMethod: manualLogMethod as PaymentLog["paymentMethod"],
      ...(manualLogMethod === "gcash" && manualLogRef
        ? { gcashReferenceNumber: manualLogRef }
        : {}),
      receiptImage: "",
      paidAt: manualLogDate,
      verifiedBy: "Admin",
      verifiedAt: new Date().toISOString().slice(0, 10),
    };
    setLogs((prev) => [...prev, newLog]);
    toast.success(`Payment logged for ${manualLogTarget.studentName}`);
    setManualLogOpen(false);
    setManualLogTarget(null);
    setManualLogMethod("cash");
    setManualLogRef("");
    setManualLogDate(new Date().toISOString().slice(0, 10));
    setReceiptLog(newLog);
    setReceiptOpen(true);
    toast.success(`Payment logged for ${manualLogTarget.studentName}`);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2 text-muted-foreground"
          onClick={() => router.push("/admin-fees")}
        >
          <ArrowLeft className="size-4 mr-1" /> Back to Fees
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {fee.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Payment Logs · {fee.semester} {fee.academicYear} · ₱
          {fee.amount.toLocaleString()}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          title="Pending"
          value={pendingCount}
          description="Awaiting verification"
          icon={Clock}
        />
        <StatCard
          title="Verified"
          value={verifiedCount}
          description="Payments confirmed"
          icon={CheckCircle}
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          description="Payments declined"
          icon={XCircle}
        />
        <StatCard
          title="Unpaid"
          value={unpaidCount}
          description="No submission yet"
          icon={MinusCircle}
        />
      </div>

      {/* Payment Logs */}
      <Card className="bg-card border-border">
        <div className="px-6 pt-6">
          <Tabs
            value={dataView}
            onValueChange={(v) => {
              setDataView(v as "submissions" | "all-students");
              setFilterStatus("all");
            }}
          >
            <TabsList className="w-full flex-1">
              <TabsTrigger value="submissions">Payment Submissions</TabsTrigger>
              <TabsTrigger value="all-students">Log Payments Manually</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3">
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Payment Logs
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage and track payments for this fee
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                placeholder="Search student..."
                value={search}
                onChange={(v) => {
                  setSearch(v);
                  setCurrentLogsPage(1);
                  setCurrentRowsPage(1);
                }}
                className="w-64"
              />
              {dataView === "submissions" && (
                <Select
                  value={filterStatus}
                  onValueChange={(v) => {
                    setFilterStatus(v);
                    setCurrentLogsPage(1);
                    setCurrentRowsPage(1);
                  }}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending_verification">
                      Pending
                    </SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* ── SUBMISSIONS VIEW ── */}
          {dataView === "submissions" &&
            (viewMode === "table" ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden sm:table-cell">Amount Paid</TableHead>
                        <TableHead className="hidden sm:table-cell">Paid At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedLogs.map((log) => {
                        const config = statusConfig[log.status];
                        const Icon = config.icon;
                        return (
                          <TableRow key={log.id} className="border-border">
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">{log.studentName}</span>
                                <span className="text-xs text-muted-foreground">{log.studentId}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={config.variant}
                                className="flex items-center gap-1 w-fit text-xs"
                              >
                                <Icon className="size-3" />
                                {config.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm font-medium hidden sm:table-cell">
                              ₱{log.amountPaid.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                              {log.paidAt}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-xs"
                                onClick={() => openDetail(log)}
                              >
                                <Eye className="size-3.5" /> View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {paginatedLogs.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No payment submissions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <DataPagination
                  currentPage={currentLogsPage}
                  totalPages={totalLogsPages}
                  totalItems={filteredLogs.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentLogsPage}
                />
              </>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedLogs.map((log) => {
                    const config = statusConfig[log.status];
                    const Icon = config.icon;
                    return (
                      <Card key={log.id} className="border-border bg-card">
                        <CardContent className="flex flex-col gap-3 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">
                                {log.studentName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {log.studentId}
                              </p>
                            </div>
                            <Badge
                              variant={config.variant}
                              className="flex items-center gap-1 text-xs shrink-0"
                            >
                              <Icon className="size-3" />
                              {config.label}
                            </Badge>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Amount Paid</p>
                              <p className="font-medium">₱{log.amountPaid.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Paid At</p>
                              <p className="font-medium">{log.paidAt}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full gap-1.5 text-xs"
                            onClick={() => openDetail(log)}
                          >
                            <Eye className="size-3.5" /> View Details
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {paginatedLogs.length === 0 && (
                    <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                      No payment submissions found
                    </div>
                  )}
                </div>
                <DataPagination
                  currentPage={currentLogsPage}
                  totalPages={totalLogsPages}
                  totalItems={filteredLogs.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentLogsPage}
                />
              </>
            ))}

          {/* ── ALL STUDENTS VIEW ── */}
          {dataView === "all-students" &&
            (viewMode === "table" ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead>Student</TableHead>
                        <TableHead className="text-right">Amount Due</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRows.map((row) => (
                        <TableRow key={row.studentId} className="border-border">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-foreground">{row.studentName}</span>
                              <span className="text-xs text-muted-foreground">{row.studentId}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm font-medium">₱{fee.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs border-[#1B5E20]/40 text-[#1B5E20] hover:bg-[#C8E6C9] hover:text-[#1B5E20] dark:text-[#8BC34A] dark:border-[#1B5E20]/30 dark:hover:bg-[#1B5E20]/20"
                              onClick={() => {
                                setManualLogTarget(row);
                                setManualLogOpen(true);
                              }}
                            >
                              <PenLine className="size-3.5" /> Log Payment
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedRows.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No unpaid students found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <DataPagination
                  currentPage={currentRowsPage}
                  totalPages={totalRowsPages}
                  totalItems={filteredRows.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentRowsPage}
                />
              </>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedRows.map((row) => (
                    <Card key={row.studentId} className="border-border bg-card">
                      <CardContent className="flex flex-col gap-3 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                              {row.studentName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {row.studentId}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 text-xs shrink-0"
                          >
                            <MinusCircle className="size-3" />
                            Unpaid
                          </Badge>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Amount Due</p>
                            <p className="font-medium">₱{fee.amount.toLocaleString()}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full gap-1.5 text-xs border-[#1B5E20]/40 text-[#1B5E20] hover:bg-[#C8E6C9] hover:text-[#1B5E20] dark:text-[#8BC34A] dark:border-[#1B5E20]/30 dark:hover:bg-[#1B5E20]/20"
                          onClick={() => {
                            setManualLogTarget(row);
                            setManualLogOpen(true);
                          }}
                        >
                          <PenLine className="size-3.5" /> Log Payment
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {paginatedRows.length === 0 && (
                    <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                      No unpaid students found
                    </div>
                  )}
                </div>
                <DataPagination
                  currentPage={currentRowsPage}
                  totalPages={totalRowsPages}
                  totalItems={filteredRows.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentRowsPage}
                />
              </>
            ))}
        </CardContent>
      </Card>

      {/* Manual Payment Dialog */}
      <ManualPaymentDialog
        open={manualLogOpen}
        onOpenChange={(open) => {
          setManualLogOpen(open);
          if (!open) setManualLogTarget(null);
        }}
        target={manualLogTarget}
        fee={fee}
        manualLogDate={manualLogDate}
        setManualLogDate={setManualLogDate}
        onSubmit={handleManualLog}
      />

      <ReceiptPreviewDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        receipt={receiptLog}
      />

      {/* Payment Detail Modal */}
      {selectedLog && (
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>Fee: {fee.title}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              {/* Status Badge */}
              {(() => {
                const config = statusConfig[selectedLog.status];
                const Icon = config.icon;
                return (
                  <Badge
                    variant={config.variant}
                    className="flex items-center gap-1 w-fit"
                  >
                    <Icon className="size-3" />
                    {config.label}
                  </Badge>
                );
              })()}

              <Separator />

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedLog.studentName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Student ID</p>
                  <p className="text-sm font-mono text-foreground">
                    {selectedLog.studentId}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Receipt Image */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Receipt Image
                </p>
                <div className="relative h-40 w-full rounded-md border border-border bg-muted overflow-hidden flex items-center justify-center">
                  <Image
                    src={selectedLog.receiptImage}
                    alt="Payment receipt"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    Receipt Preview
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Amount Paid</p>
                  <p className="text-sm font-bold text-foreground">
                    ₱{selectedLog.amountPaid.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Payment Method
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedLog.paymentMethod &&
                      (paymentMethodLabels[selectedLog.paymentMethod] ??
                        selectedLog.paymentMethod)}
                  </p>
                </div>
                {selectedLog.gcashReferenceNumber && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">
                      GCash Reference No.
                    </p>
                    <p className="text-sm font-mono text-foreground">
                      {selectedLog.gcashReferenceNumber}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Paid At</p>
                  <p className="text-sm text-foreground">
                    {selectedLog.paidAt}
                  </p>
                </div>
              </div>

              {/* Verified info — only shown when verified */}
              {selectedLog.status === "verified" && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Verified By
                      </p>
                      <p className="text-sm text-foreground">
                        {selectedLog.verifiedBy}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Verified At
                      </p>
                      <p className="text-sm text-foreground">
                        {selectedLog.verifiedAt}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Rejection reason — only shown when rejected */}
              {selectedLog.status === "rejected" &&
                selectedLog.rejectionReason && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Reason for Rejection
                      </p>
                      <p className="text-sm text-foreground">
                        {selectedLog.rejectionReason}
                      </p>
                    </div>
                  </>
                )}
            </div>

            {/* Approve / Reject — only for pending */}
            {selectedLog.status === "pending_verification" && (
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setDetailOpen(false);
                    setRejectOpen(true);
                  }}
                >
                  <XCircle className="size-4 mr-1" /> Reject
                </Button>
                <Button onClick={() => handleApprove(selectedLog.id)}>
                  <CheckCircle className="size-4 mr-1" /> Approve
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Reason Modal */}
      {selectedLog && (
        <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Reject Payment</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting {selectedLog.studentName}&apos;s
                payment.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reject-reason">Reason</Label>
              <Textarea
                id="reject-reason"
                placeholder="e.g. Receipt image is unclear..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(selectedLog.id)}
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
