"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Eye,
  ChevronRight,
  Banknote,
  Users,
  CircleDollarSign,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ShieldCheckIcon,
  MessageSquareIcon,
  CheckIcon,
  XIcon,
  PenLine,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  MinusCircle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { ViewToggle } from "@/components/shared/ViewToggle";
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
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import { Textarea } from "@/src/components/ui/textarea";
import { studentFineRecords as initialRecords } from "./mock-data";
import { PaymentReviewDialog } from "@/components/shared/PaymentReviewDialog";
import FineReceiptDialog from "./components/FineReceiptDialog";
import type { StudentFineRecord, FineItem, StudentFineStatus } from "./types";
import { toast } from "sonner";
import { StatCard } from "@/components/shared/StatCard";
import { DataPagination } from "@/components/shared/DataPagination";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

// ─── Helpers ───────────────────────────────────────────────────────────────
// All helpers operate at the StudentFineRecord level because payment is
// submitted in bulk once per student at the end of the semester.

function computeStudentStatus(record: StudentFineRecord): StudentFineStatus {
  const nonWaived = record.fineItems.filter((i) => !i.isWaived);
  if (nonWaived.length === 0) return "paid"; // every fine waived → fully settled
  const bps = record.bulkPaymentSubmission;
  if (bps?.status === "approved") return "paid"; // payment confirmed → settled
  if (bps?.status === "pending") return "pending"; // payment submitted, under review
  // No active payment: partial if some items have been waived, otherwise fully outstanding
  const hasWaived = record.fineItems.some((i) => i.isWaived);
  if (hasWaived) return "partial"; // mixed — some waived, rest still owed
  return "pending"; // fully outstanding, no payment yet
}

function computeRecordBadges(record: StudentFineRecord) {
  return {
    waivedCount: record.fineItems.filter((i) => i.isWaived).length,
    pendingAppeals: record.fineItems.filter(
      (i) => i.appeal?.status === "pending",
    ).length,
    rejectedAppeals: record.fineItems.filter(
      (i) => i.appeal?.status === "rejected",
    ).length,
  };
}

function computeAmountPaid(record: StudentFineRecord): number {
  if (record.bulkPaymentSubmission?.status !== "approved") return 0;
  return record.fineItems
    .filter((i) => !i.isWaived)
    .reduce((s, i) => s + i.amount, 0);
}

function computeBalance(record: StudentFineRecord): number {
  if (record.bulkPaymentSubmission?.status === "approved") return 0;
  return record.fineItems
    .filter((i) => !i.isWaived)
    .reduce((s, i) => s + i.amount, 0);
}

function computeTotal(items: FineItem[]): number {
  return items.filter((i) => !i.isWaived).reduce((s, i) => s + i.amount, 0);
}

// ─── Config ────────────────────────────────────────────────────────────────

const studentStatusConfig: Record<
  StudentFineStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof Clock;
  }
> = {
  pending: { label: "Pending", variant: "default", icon: Clock },
  partial: { label: "Partial", variant: "outline", icon: MinusCircle },
  paid: { label: "Paid", variant: "secondary", icon: CheckCircle },
};

const paymentStatusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof Clock;
  }
> = {
  pending: { label: "Pending", variant: "default", icon: Clock },
  approved: { label: "Approved", variant: "secondary", icon: CheckCircle },
  declined: { label: "Declined", variant: "destructive", icon: XCircle },
};

const appealStatusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof Clock;
  }
> = {
  pending: { label: "Pending", variant: "default", icon: Clock },
  approved: { label: "Approved", variant: "secondary", icon: CheckCircle },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
};

// ─── DetailRow ──────────────────────────────────────────────────────────────

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function FinesPage() {
  const [records, setRecords] = useState<StudentFineRecord[]>(initialRecords);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAppeal, setFilterAppeal] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [currentPage, setCurrentPage] = useState(1);

  // Drill-down state
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [fineDetailOpen, setFineDetailOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Appeal resolution state
  const [rejectingAppealItemId, setRejectingAppealItemId] = useState<
    string | null
  >(null);
  const [appealRejectReason, setAppealRejectReason] = useState("");

  // Manual payment state
  const [manualPayOpen, setManualPayOpen] = useState(false);
  const [manualPayMethod, setManualPayMethod] = useState("cash");
  const [manualPayRef, setManualPayRef] = useState("");
  const [manualPayDate, setManualPayDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [manualPayNotes, setManualPayNotes] = useState("");

  // Tab + receipt state
  const [dataView, setDataView] = useState<"submissions" | "unpaid">(
    "submissions",
  );
  const [receiptRecord, setReceiptRecord] = useState<StudentFineRecord | null>(
    null,
  );
  const [receiptOpen, setReceiptOpen] = useState(false);

  // ─ Derive live focused records from state ─
  const liveSelectedRecord = useMemo(
    () => records.find((r) => r.studentId === selectedStudentId) ?? null,
    [records, selectedStudentId],
  );

  const liveSelectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    for (const r of records) {
      const found = r.fineItems.find((i) => i.id === selectedItemId);
      if (found) return found;
    }
    return null;
  }, [records, selectedItemId]);

  // ─ Summaries ─
  const summaries = useMemo(
    () =>
      records.map((r) => ({
        record: r,
        total: computeTotal(r.fineItems),
        amountPaid: computeAmountPaid(r),
        balance: computeBalance(r),
        status: computeStudentStatus(r),
        badges: computeRecordBadges(r),
      })),
    [records],
  );

  const filtered = summaries.filter(({ record, status, balance }) => {
    // Tab filter
    if (dataView === "submissions") {
      if (!record.bulkPaymentSubmission) return false;
    } else {
      // unpaid: no payment submission at all, with non-zero balance
      if (record.bulkPaymentSubmission || balance === 0) return false;
    }
    const matchesSearch =
      record.studentName.toLowerCase().includes(search.toLowerCase()) ||
      record.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || status === filterStatus;
    const hasAppeal = (appealStatus: string) =>
      record.fineItems.some((i) => i.appeal?.status === appealStatus);
    const matchesAppeal =
      filterAppeal === "all"
        ? true
        : filterAppeal === "any"
          ? record.fineItems.some((i) => i.appeal)
          : filterAppeal === "pending"
            ? hasAppeal("pending")
            : filterAppeal === "approved"
              ? hasAppeal("approved")
              : filterAppeal === "rejected"
                ? hasAppeal("rejected")
                : filterAppeal === "none"
                  ? record.fineItems.every((i) => !i.appeal)
                  : true;
    return matchesSearch && matchesStatus && matchesAppeal;
  });

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ─ Stats ─
  const totalOutstanding = summaries.reduce((s, r) => s + r.balance, 0);
  const totalCollected = summaries.reduce((s, r) => s + r.amountPaid, 0);
  const pendingCount = summaries.filter(
    (r) => r.status === "pending" || r.status === "partial",
  ).length;

  // Tab counts
  const submissionsCount = summaries.filter(
    (s) => !!s.record.bulkPaymentSubmission,
  ).length;
  const unpaidFinesCount = summaries.filter(
    (s) => !s.record.bulkPaymentSubmission && s.balance > 0,
  ).length;

  // ─ Handlers ─
  // Bulk payment is approved/declined at the record level — one decision settles all fines.
  function updateRecordPaymentStatus(
    studentId: string,
    status: "approved" | "declined",
    rejectionReason?: string,
  ) {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.studentId !== studentId || !r.bulkPaymentSubmission) return r;
        return {
          ...r,
          bulkPaymentSubmission: {
            ...r.bulkPaymentSubmission,
            status,
            ...(rejectionReason ? { rejectionReason } : {}),
          },
        };
      }),
    );
  }

  function handleApprovePayment() {
    if (!selectedStudentId || !liveSelectedRecord?.bulkPaymentSubmission)
      return;
    const updatedRecord: StudentFineRecord = {
      ...liveSelectedRecord,
      bulkPaymentSubmission: {
        ...liveSelectedRecord.bulkPaymentSubmission,
        status: "approved" as const,
      },
    };
    updateRecordPaymentStatus(selectedStudentId, "approved");
    setReceiptRecord(updatedRecord);
    setReceiptOpen(true);
    toast.success("Bulk payment approved — all fines settled");
  }

  function handleRejectPayment(reason: string) {
    if (!selectedStudentId) return;
    updateRecordPaymentStatus(selectedStudentId, "declined", reason);
    toast.success("Bulk payment rejected");
  }

  function openBreakdown(studentId: string) {
    setSelectedStudentId(studentId);
    setBreakdownOpen(true);
  }

  function openFineDetail(itemId: string) {
    setSelectedItemId(itemId);
    setFineDetailOpen(true);
  }

  function handleAcceptAppeal(itemId: string) {
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        fineItems: r.fineItems.map((i) => {
          if (i.id !== itemId || !i.appeal) return i;
          return {
            ...i,
            isWaived: true,
            waivedBy: "Admin",
            waivedAt: new Date().toISOString().slice(0, 10),
            waivedReason: "Appeal approved — " + i.appeal.notes,
            appeal: {
              ...i.appeal,
              status: "approved" as const,
              resolvedBy: "Admin",
              resolvedAt: new Date().toISOString().slice(0, 10),
            },
          };
        }),
      })),
    );
    toast.success("Appeal accepted — fine has been waived");
  }

  function handleManualPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStudentId || !liveSelectedRecord) return;
    const balance = computeBalance(liveSelectedRecord);
    const newSubmission = {
      id: `manual-${Date.now()}`,
      receiptImage: "",
      amountPaid: balance,
      paymentMethod: manualPayMethod,
      ...(manualPayMethod === "gcash" && manualPayRef
        ? { gcashReferenceNumber: manualPayRef }
        : {}),
      dateOfPayment: manualPayDate,
      status: "approved" as const,
    };
    const updatedRecord: StudentFineRecord = {
      ...liveSelectedRecord,
      bulkPaymentSubmission: newSubmission,
    };
    setRecords((prev) =>
      prev.map((r) => (r.studentId === selectedStudentId ? updatedRecord : r)),
    );
    setReceiptRecord(updatedRecord);
    setReceiptOpen(true);
    toast.success("Manual payment logged — fines marked as paid");
    setManualPayOpen(false);
    setManualPayMethod("cash");
    setManualPayRef("");
    setManualPayNotes("");
  }

  function handleRejectAppeal(itemId: string, reason: string) {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        fineItems: r.fineItems.map((i) => {
          if (i.id !== itemId || !i.appeal) return i;
          return {
            ...i,
            appeal: {
              ...i.appeal,
              status: "rejected" as const,
              resolvedBy: "Admin",
              resolvedAt: new Date().toISOString().slice(0, 10),
              rejectionReason: reason.trim(),
            },
          };
        }),
      })),
    );
    setRejectingAppealItemId(null);
    setAppealRejectReason("");
    toast.success("Appeal rejected");
  }

  // ─ Render ─
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        variant="admin"
        title="Fines Management"
        context="2nd Semester · A.Y. 2025–2026"
        description="Review and manage student fines"
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          title="Students w/ Fines"
          value={records.length.toString()}
          description="Have at least one fine"
          icon={Users}
        />
        <StatCard
          title="Outstanding Balance"
          value={`₱${totalOutstanding.toLocaleString()}`}
          description="Total unpaid amount"
          icon={AlertTriangle}
        />
        <StatCard
          title="Total Collected"
          value={`₱${totalCollected.toLocaleString()}`}
          description="Total approved payments"
          icon={Banknote}
        />
        <StatCard
          title="Unsettled"
          value={pendingCount.toString()}
          description="Students with outstanding fines"
          icon={CircleDollarSign}
        />
      </div>

      {/* Main Card */}
      <Card className="border-border bg-card">
        <div className="px-6 pt-6">
          <Tabs
            value={dataView}
            onValueChange={(v) => {
              setDataView(v as "submissions" | "unpaid");
              setCurrentPage(1);
              setFilterStatus("all");
              setFilterAppeal("all");
            }}
          >
            <TabsList className="w-full flex-1">
              <TabsTrigger value="submissions">Payment Submissions</TabsTrigger>
              <TabsTrigger value="unpaid">Log Payments Manually</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Student Fine Records
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {filtered.length} student(s) found
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                placeholder="Search by name or ID..."
                value={search}
                onChange={(v) => {
                  setSearch(v);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64"
              />
              <Select
                value={filterStatus}
                onValueChange={(v) => {
                  setFilterStatus(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial (Some Waived)</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterAppeal}
                onValueChange={(v) => {
                  setFilterAppeal(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Appeals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Appeals</SelectItem>
                  <SelectItem value="any">Has Appeal</SelectItem>
                  <SelectItem value="pending">Appeal Pending</SelectItem>
                  <SelectItem value="approved">Appeal Approved</SelectItem>
                  <SelectItem value="rejected">Appeal Rejected</SelectItem>
                  <SelectItem value="none">No Appeal</SelectItem>
                </SelectContent>
              </Select>
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Student</TableHead>
                      <TableHead className="text-center"># Fines</TableHead>
                      {dataView === "submissions" ? (
                        <>
                          <TableHead className="text-right">
                            Total Amount
                          </TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">
                            Amount Paid
                          </TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </>
                      ) : (
                        <TableHead className="text-right">
                          Outstanding Balance
                        </TableHead>
                      )}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map(
                      ({
                        record,
                        total,
                        amountPaid,
                        balance,
                        status,
                        badges,
                      }) => {
                        const cfg = studentStatusConfig[status];
                        const StatusIcon = cfg.icon;
                        return (
                          <TableRow
                            key={record.studentId}
                            className="border-border"
                          >
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">
                                  {record.studentName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {record.studentId}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-sm">
                              {
                                record.fineItems.filter((i) => !i.isWaived)
                                  .length
                              }
                            </TableCell>
                            {dataView === "submissions" ? (
                              <>
                                <TableCell className="text-right text-sm font-medium">
                                  ₱{total.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge
                                      variant={cfg.variant}
                                      className="flex items-center gap-1 w-fit text-xs"
                                    >
                                      <StatusIcon className="size-3" />
                                      {cfg.label}
                                    </Badge>
                                    {badges.waivedCount > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs gap-1"
                                      >
                                        {badges.waivedCount} Waived
                                      </Badge>
                                    )}
                                    {badges.pendingAppeals > 0 && (
                                      <Badge
                                        variant="default"
                                        className="text-xs"
                                      >
                                        {badges.pendingAppeals} Appeal
                                        {badges.pendingAppeals !== 1 ? "s" : ""}{" "}
                                        Pending
                                      </Badge>
                                    )}
                                    {badges.rejectedAppeals > 0 && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs"
                                      >
                                        {badges.rejectedAppeals} Appeal
                                        {badges.rejectedAppeals !== 1
                                          ? "s"
                                          : ""}{" "}
                                        Rejected
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">
                                  ₱{amountPaid.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-sm font-medium">
                                  ₱{balance.toLocaleString()}
                                </TableCell>
                              </>
                            ) : (
                              <TableCell className="text-right text-sm font-medium">
                                ₱{balance.toLocaleString()}
                              </TableCell>
                            )}
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {dataView === "unpaid" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1.5 text-xs border-[#1B5E20]/40 text-[#1B5E20] hover:bg-[#C8E6C9] hover:text-[#1B5E20] dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-950"
                                    onClick={() => {
                                      setSelectedStudentId(record.studentId);
                                      setManualPayOpen(true);
                                    }}
                                  >
                                    <PenLine className="size-3.5" /> Log Payment
                                  </Button>
                                )}
                                {dataView === "submissions" &&
                                  record.bulkPaymentSubmission?.status ===
                                    "approved" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="gap-1.5 text-xs"
                                      onClick={() => {
                                        setReceiptRecord(record);
                                        setReceiptOpen(true);
                                      }}
                                    >
                                      <Receipt className="size-3.5" /> Receipt
                                    </Button>
                                  )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 text-xs"
                                  onClick={() =>
                                    openBreakdown(record.studentId)
                                  }
                                >
                                  <Eye className="size-3.5" /> View Details
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )}
                    {paginated.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={dataView === "submissions" ? 7 : 4}
                          className="py-8 text-center text-sm text-muted-foreground"
                        >
                          No records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map(
                  ({ record, total, amountPaid, balance, status, badges }) => {
                    const cfg = studentStatusConfig[status];
                    const StatusIcon = cfg.icon;
                    return (
                      <Card
                        key={record.studentId}
                        className="border-border bg-card"
                      >
                        <CardContent className="flex flex-col gap-3 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">
                                {record.studentName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {record.studentId}
                              </p>
                            </div>
                            <div className="flex flex-wrap justify-end gap-1 shrink-0">
                              {dataView === "submissions" ? (
                                <>
                                  <Badge
                                    variant={cfg.variant}
                                    className="flex items-center gap-1 text-xs shrink-0"
                                  >
                                    <StatusIcon className="size-3" />
                                    {cfg.label}
                                  </Badge>
                                  {badges.waivedCount > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {badges.waivedCount} Waived
                                    </Badge>
                                  )}
                                  {badges.pendingAppeals > 0 && (
                                    <Badge
                                      variant="default"
                                      className="text-xs"
                                    >
                                      {badges.pendingAppeals} Appeal
                                      {badges.pendingAppeals !== 1 ? "s" : ""}{" "}
                                      Pending
                                    </Badge>
                                  )}
                                  {badges.rejectedAppeals > 0 && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      {badges.rejectedAppeals} Appeal
                                      {badges.rejectedAppeals !== 1 ? "s" : ""}{" "}
                                      Rejected
                                    </Badge>
                                  )}
                                </>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1 text-xs shrink-0"
                                >
                                  <MinusCircle className="size-3" />
                                  Unpaid
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Separator />
                          {dataView === "submissions" ? (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-muted-foreground"># Fines</p>
                                <p className="font-medium">
                                  {
                                    record.fineItems.filter((i) => !i.isWaived)
                                      .length
                                  }
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Total Amount
                                </p>
                                <p className="font-medium">
                                  ₱{total.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Amount Paid
                                </p>
                                <p className="font-medium">
                                  ₱{amountPaid.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Balance</p>
                                <p className="font-medium">
                                  ₱{balance.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-muted-foreground">
                                  # Outstanding Fines
                                </p>
                                <p className="font-medium">
                                  {
                                    record.fineItems.filter((i) => !i.isWaived)
                                      .length
                                  }
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Outstanding Balance
                                </p>
                                <p className="font-medium">
                                  ₱{balance.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex flex-col gap-2 mt-1">
                            {dataView === "unpaid" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full gap-1.5 text-xs border-[#1B5E20]/40 text-[#1B5E20] hover:bg-[#C8E6C9] hover:text-[#1B5E20] dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-950"
                                onClick={() => {
                                  setSelectedStudentId(record.studentId);
                                  setManualPayOpen(true);
                                }}
                              >
                                <PenLine className="size-3.5" /> Log Manual
                                Payment
                              </Button>
                            )}
                            {dataView === "submissions" &&
                              record.bulkPaymentSubmission?.status ===
                                "approved" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full gap-1.5 text-xs"
                                  onClick={() => {
                                    setReceiptRecord(record);
                                    setReceiptOpen(true);
                                  }}
                                >
                                  <Receipt className="size-3.5" /> View Receipt
                                </Button>
                              )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full gap-1.5 text-xs"
                              onClick={() => openBreakdown(record.studentId)}
                            >
                              <Eye className="size-3.5" /> View Details
                              <ChevronRight className="ml-auto size-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  },
                )}
                {paginated.length === 0 && (
                  <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                    No records found.
                  </div>
                )}
              </div>
              <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Dialog 1: Student Fine Breakdown ───────────────────────────── */}
      <Dialog open={breakdownOpen} onOpenChange={setBreakdownOpen}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Fine Breakdown — {liveSelectedRecord?.studentName}
            </DialogTitle>
            <DialogDescription>
              {liveSelectedRecord?.studentId} ·{" "}
              {liveSelectedRecord?.fineItems.length} fine item(s)
            </DialogDescription>
          </DialogHeader>

          {/* Bulk payment submission banner */}
          {liveSelectedRecord?.bulkPaymentSubmission &&
            (() => {
              const bps = liveSelectedRecord.bulkPaymentSubmission;
              const pendingAppealItems = liveSelectedRecord.fineItems.filter(
                (i) => !i.isWaived && i.appeal?.status === "pending",
              );
              const coveredItems = liveSelectedRecord.fineItems.filter(
                (i) => !i.isWaived,
              );
              return (
                <div className="flex flex-col gap-2.5 rounded-md border border-border bg-muted/30 px-4 py-3">
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Banknote className="size-4 shrink-0 text-muted-foreground" />
                      <span className="text-sm font-semibold">
                        Bulk Payment Submission
                      </span>
                      {(() => {
                        const pCfg = paymentStatusConfig[bps.status];
                        const PIcon = pCfg.icon;
                        return (
                          <Badge
                            variant={pCfg.variant}
                            className="flex items-center gap-1 w-fit text-xs"
                          >
                            <PIcon className="size-3" />
                            {pCfg.label}
                          </Badge>
                        );
                      })()}
                    </div>
                    {bps.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPaymentOpen(true)}
                      >
                        Review Payment
                      </Button>
                    )}
                  </div>

                  {/* Covered fine items summary */}
                  {coveredItems.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      This submission covers{" "}
                      <span className="font-medium text-foreground">
                        {coveredItems.length} fine item
                        {coveredItems.length !== 1 ? "s" : ""}
                      </span>
                      {" — "}
                      {coveredItems.map((i, idx) => (
                        <span key={i.id}>
                          {i.fineTypeName}
                          {i.eventName ? ` (${i.eventName})` : ""}
                          {idx < coveredItems.length - 1 ? ", " : ""}
                        </span>
                      ))}
                      {" — totalling "}
                      <span className="font-medium text-foreground">
                        ₱{bps.amountPaid.toLocaleString()}
                      </span>
                      .
                    </p>
                  )}

                  {/* Soft advisory when pending appeals exist alongside a pending payment */}
                  {bps.status === "pending" &&
                    pendingAppealItems.length > 0 && (
                      <div className="flex items-start gap-2 rounded-sm border border-amber-400/30 bg-amber-50 dark:bg-amber-950/30 px-3 py-2">
                        <AlertTriangle className="size-3.5 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                          <span className="font-semibold">
                            {pendingAppealItems.length} fine item
                            {pendingAppealItems.length !== 1 ? "s" : ""} in this
                            payment
                            {pendingAppealItems.length !== 1
                              ? " have"
                              : " has"}{" "}
                            an unresolved appeal.
                          </span>{" "}
                          Approving this payment will settle all covered fines
                          regardless of appeal outcome. Consider resolving
                          pending appeals first, or approve if the amount has
                          been confirmed.
                        </p>
                      </div>
                    )}

                  {/* Declined rejection reason */}
                  {bps.status === "declined" && bps.rejectionReason && (
                    <div className="flex items-start gap-2 rounded-sm border border-destructive/20 bg-destructive/10 px-3 py-2">
                      <XIcon className="size-3.5 mt-0.5 shrink-0 text-destructive" />
                      <p className="text-xs text-destructive leading-relaxed">
                        {bps.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

          <div className="flex flex-col gap-3">
            {liveSelectedRecord?.fineItems.map((item) => {
              const statusColor = item.isWaived
                ? "border-muted bg-muted/30"
                : "border-border bg-card";
              return (
                <div
                  key={item.id}
                  className={`rounded-lg border p-4 flex flex-col gap-3 transition-colors ${statusColor}`}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-muted-foreground tabular-nums">
                        #{item.itemNumber}
                      </span>
                      <Badge
                        variant="outline"
                        className="font-mono text-xs py-0"
                      >
                        {item.fineTypeCode}
                      </Badge>
                      {item.isWaived && (
                        <Badge
                          variant="outline"
                          className="text-xs py-0 text-muted-foreground"
                        >
                          Waived
                        </Badge>
                      )}
                      {item.appeal &&
                        (() => {
                          const aCfg = appealStatusConfig[item.appeal.status];
                          const AIcon = aCfg.icon;
                          return (
                            <Badge
                              variant={aCfg.variant}
                              className="flex items-center gap-1 text-xs py-0"
                            >
                              <AIcon className="size-3" />
                              Appeal: {aCfg.label}
                            </Badge>
                          );
                        })()}
                    </div>
                    <span
                      className={`text-base font-bold shrink-0 ${
                        item.isWaived
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      ₱{item.amount.toLocaleString()}
                    </span>
                  </div>

                  {/* Fine type name */}
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {item.fineTypeName}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {item.eventName && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarIcon className="size-3 shrink-0" />
                        {item.eventName}
                        {item.eventDate && (
                          <span className="opacity-60">· {item.eventDate}</span>
                        )}
                      </span>
                    )}
                    {item.timeViolation && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ClockIcon className="size-3 shrink-0" />
                        {item.timeViolation}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <UserIcon className="size-3 shrink-0" />
                      Issued by {item.issuedBy} · {item.issuedAt}
                    </span>
                  </div>

                  {/* Reason */}
                  <p className="text-xs text-muted-foreground border-t border-border pt-2.5">
                    {item.reason}
                  </p>

                  {/* Waiver note */}
                  {item.isWaived && item.waivedReason && (
                    <div className="flex flex-col gap-2.5 rounded-md border border-border bg-muted/40 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground">
                          Fine Waived
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-5.5">
                        {item.waivedReason}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 pl-5.5">
                        {item.waivedBy && (
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <UserIcon className="size-3 shrink-0" />
                            Waived by {item.waivedBy}
                          </span>
                        )}
                        {item.waivedAt && (
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <CalendarIcon className="size-3 shrink-0" />
                            {item.waivedAt}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Appeal note */}
                  {item.appeal && (
                    <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/40 px-4 py-3">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <MessageSquareIcon className="size-3.5 shrink-0 text-muted-foreground" />
                          <span className="text-xs font-semibold text-foreground">
                            Student Appeal
                          </span>
                        </div>
                        {(() => {
                          const aCfg = appealStatusConfig[item.appeal.status];
                          const AIcon = aCfg.icon;
                          return (
                            <Badge
                              variant={aCfg.variant}
                              className="flex items-center gap-1 text-xs"
                            >
                              <AIcon className="size-3" />
                              {aCfg.label}
                            </Badge>
                          );
                        })()}
                      </div>

                      {/* Appeal notes in a blockquote-style indent */}
                      <blockquote className="border-l-2 border-muted-foreground/30 pl-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.appeal.notes}
                        </p>
                      </blockquote>

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <CalendarIcon className="size-3 shrink-0" />
                          Submitted {item.appeal.appealedAt}
                        </span>
                        {item.appeal.resolvedBy && (
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <UserIcon className="size-3 shrink-0" />
                            Resolved by {item.appeal.resolvedBy} ·{" "}
                            {item.appeal.resolvedAt}
                          </span>
                        )}
                      </div>

                      {/* Rejection reason callout */}
                      {item.appeal.status === "rejected" &&
                        item.appeal.rejectionReason && (
                          <div className="flex items-start gap-2 rounded-sm border border-destructive/20 bg-destructive/10 px-3 py-2">
                            <XIcon className="size-3.5 mt-0.5 shrink-0 text-destructive" />
                            <p className="text-xs text-destructive leading-relaxed">
                              {item.appeal.rejectionReason}
                            </p>
                          </div>
                        )}

                      {/* Accept / Reject actions — only for pending appeals */}
                      {item.appeal.status === "pending" && (
                        <>
                          <Separator />
                          {rejectingAppealItemId === item.id ? (
                            <div className="flex flex-col gap-2">
                              <p className="text-xs font-medium text-foreground">
                                Rejection reason
                              </p>
                              <Textarea
                                rows={3}
                                placeholder="Explain why the appeal is being rejected…"
                                value={appealRejectReason}
                                onChange={(e) =>
                                  setAppealRejectReason(e.target.value)
                                }
                                className="text-xs resize-none"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs"
                                  onClick={() => {
                                    setRejectingAppealItemId(null);
                                    setAppealRejectReason("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-8 text-xs gap-1.5"
                                  onClick={() =>
                                    handleRejectAppeal(
                                      item.id,
                                      appealRejectReason,
                                    )
                                  }
                                >
                                  <XIcon className="size-3.5" />
                                  Confirm Reject
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs gap-1.5 border-[#1B5E20]/40 text-[#1B5E20] hover:bg-[#C8E6C9] hover:text-[#1B5E20] dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-950"
                                onClick={() => handleAcceptAppeal(item.id)}
                              >
                                <CheckIcon className="size-3.5" />
                                Accept Appeal
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  setRejectingAppealItemId(item.id);
                                  setAppealRejectReason("");
                                }}
                              >
                                <XIcon className="size-3.5" />
                                Reject Appeal
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Pending bulk payment indicator — shown when this fine is covered by an unreviewed submission */}
                  {!item.isWaived &&
                    liveSelectedRecord?.bulkPaymentSubmission?.status ===
                      "pending" &&
                    (() => {
                      const bps = liveSelectedRecord.bulkPaymentSubmission;
                      return (
                        <div className="flex items-start gap-2 rounded-sm border border-border bg-muted/50 px-3 py-2">
                          <Banknote className="size-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                          <div className="flex flex-col gap-0.5">
                            <p className="text-xs font-medium text-foreground">
                              Included in pending bulk payment
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              This fine is part of a{" "}
                              <span className="font-medium text-foreground">
                                ₱{bps.amountPaid.toLocaleString()}{" "}
                                {bps.paymentMethod}
                              </span>{" "}
                              submission dated {bps.dateOfPayment}
                              {bps.gcashReferenceNumber
                                ? ` · Ref: ${bps.gcashReferenceNumber}`
                                : ""}
                              .{" "}
                              {item.appeal?.status === "pending"
                                ? 'This fine also has an unresolved appeal — resolve the appeal first, or use "Review Payment" above to settle regardless.'
                                : 'Use "Review Payment" above to approve or decline the full submission.'}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                  {/* View details */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="self-end gap-1.5 text-xs h-8"
                    onClick={() => openFineDetail(item.id)}
                  >
                    <Eye className="size-3.5" />
                    View Full Details
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Total row */}
          {liveSelectedRecord && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3 mt-1">
              <span className="text-sm font-medium text-muted-foreground">
                Total outstanding (
                {liveSelectedRecord.fineItems.filter((i) => !i.isWaived).length}{" "}
                fine
                {liveSelectedRecord.fineItems.filter((i) => !i.isWaived)
                  .length !== 1
                  ? "s"
                  : ""}
                )
              </span>
              <span className="text-base font-bold text-foreground">
                ₱{computeTotal(liveSelectedRecord.fineItems).toLocaleString()}
              </span>
            </div>
          )}

          {/* Manual payment action */}
          {liveSelectedRecord &&
            computeBalance(liveSelectedRecord) > 0 &&
            !liveSelectedRecord.bulkPaymentSubmission && (
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-[#1B5E20]/40 text-[#1B5E20] hover:bg-[#C8E6C9] hover:text-[#1B5E20] dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-950"
                  onClick={() => setManualPayOpen(true)}
                >
                  <PenLine className="size-3.5" />
                  Log Manual Payment
                </Button>
              </div>
            )}

          {/* View receipt for approved payments */}
          {liveSelectedRecord?.bulkPaymentSubmission?.status === "approved" && (
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => {
                  setReceiptRecord(liveSelectedRecord);
                  setReceiptOpen(true);
                }}
              >
                <Receipt className="size-3.5" />
                View Receipt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog 2: Fine Item Details ────────────────────────────────── */}
      <Dialog open={fineDetailOpen} onOpenChange={setFineDetailOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Fine Item Details — #{liveSelectedItem?.itemNumber}
            </DialogTitle>
            <DialogDescription>
              Complete details of this fine item.
            </DialogDescription>
          </DialogHeader>
          {liveSelectedItem && (
            <div className="flex flex-col gap-4">
              <Separator />

              {/* Core fine details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <DetailRow
                  label="Item Number"
                  value={`#${liveSelectedItem.itemNumber}`}
                />
                <DetailRow
                  label="Fine Type Code"
                  value={liveSelectedItem.fineTypeCode}
                />
                <DetailRow
                  label="Fine Type Name"
                  value={
                    <span className="flex items-center gap-2">
                      {liveSelectedItem.fineTypeName}
                      {liveSelectedItem.isWaived && (
                        <Badge variant="outline" className="py-0 text-xs">
                          Waived
                        </Badge>
                      )}
                    </span>
                  }
                />
                {liveSelectedItem.eventName && (
                  <DetailRow
                    label="Event Name"
                    value={liveSelectedItem.eventName}
                  />
                )}
                {liveSelectedItem.eventDate && (
                  <DetailRow
                    label="Event Date"
                    value={liveSelectedItem.eventDate}
                  />
                )}
                <DetailRow
                  label="Amount"
                  value={`₱${liveSelectedItem.amount.toLocaleString()}`}
                />
                <DetailRow label="Reason" value={liveSelectedItem.reason} />
                {liveSelectedItem.timeViolation && (
                  <DetailRow
                    label="Time Violation"
                    value={liveSelectedItem.timeViolation}
                  />
                )}
                <DetailRow
                  label="Issued By"
                  value={liveSelectedItem.issuedBy}
                />
                <DetailRow
                  label="Issued At"
                  value={liveSelectedItem.issuedAt}
                />
              </div>

              {/* Waiver details */}
              {liveSelectedItem.isWaived &&
                (liveSelectedItem.waivedBy ||
                  liveSelectedItem.waivedAt ||
                  liveSelectedItem.waivedReason) && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="size-3.5 shrink-0 text-muted-foreground" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Waiver Details
                        </p>
                      </div>
                      <div className="rounded-md border border-border bg-muted/40 px-4 py-3 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          {liveSelectedItem.waivedBy && (
                            <DetailRow
                              label="Waived By"
                              value={liveSelectedItem.waivedBy}
                            />
                          )}
                          {liveSelectedItem.waivedAt && (
                            <DetailRow
                              label="Waived At"
                              value={liveSelectedItem.waivedAt}
                            />
                          )}
                        </div>
                        {liveSelectedItem.waivedReason && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">
                              Reason
                            </span>
                            <p className="text-sm text-foreground leading-relaxed">
                              {liveSelectedItem.waivedReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

              {/* Appeal details */}
              {liveSelectedItem.appeal && (
                <>
                  <Separator />
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MessageSquareIcon className="size-3.5 shrink-0 text-muted-foreground" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Appeal Details
                        </p>
                      </div>
                      {(() => {
                        const aCfg =
                          appealStatusConfig[liveSelectedItem.appeal.status];
                        const AIcon = aCfg.icon;
                        return (
                          <Badge
                            variant={aCfg.variant}
                            className="flex items-center gap-1 text-xs"
                          >
                            <AIcon className="size-3" />
                            {aCfg.label}
                          </Badge>
                        );
                      })()}
                    </div>
                    <div className="rounded-md border border-border bg-muted/40 px-4 py-3 flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">
                          Student&apos;s Appeal Notes
                        </span>
                        <blockquote className="mt-1 border-l-2 border-muted-foreground/30 pl-3">
                          <p className="text-sm text-foreground leading-relaxed">
                            {liveSelectedItem.appeal.notes}
                          </p>
                        </blockquote>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <DetailRow
                          label="Appealed At"
                          value={liveSelectedItem.appeal.appealedAt}
                        />
                        {liveSelectedItem.appeal.resolvedBy && (
                          <DetailRow
                            label="Resolved By"
                            value={liveSelectedItem.appeal.resolvedBy}
                          />
                        )}
                        {liveSelectedItem.appeal.resolvedAt && (
                          <DetailRow
                            label="Resolved At"
                            value={liveSelectedItem.appeal.resolvedAt}
                          />
                        )}
                      </div>
                      {liveSelectedItem.appeal.status === "rejected" &&
                        liveSelectedItem.appeal.rejectionReason && (
                          <div className="flex items-start gap-2 rounded-sm border border-destructive/20 bg-destructive/10 px-3 py-2">
                            <XIcon className="size-3.5 mt-0.5 shrink-0 text-destructive" />
                            <p className="text-xs text-destructive leading-relaxed">
                              {liveSelectedItem.appeal.rejectionReason}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog 3.5: Manual Payment ──────────────────────────────── */}
      <Dialog
        open={manualPayOpen}
        onOpenChange={(open) => {
          setManualPayOpen(open);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Manual Payment</DialogTitle>
            <DialogDescription>
              Record a cash or direct payment for{" "}
              <span className="font-medium text-foreground">
                {liveSelectedRecord?.studentName}
              </span>
              . This will immediately mark all outstanding fines as settled.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleManualPayment} className="flex flex-col gap-4">
            {liveSelectedRecord && (
              <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Amount to settle
                </p>
                <p className="text-lg font-bold text-foreground mt-0.5">
                  ₱{computeBalance(liveSelectedRecord).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {
                    liveSelectedRecord.fineItems.filter((i) => !i.isWaived)
                      .length
                  }{" "}
                  fine item(s)
                </p>
              </div>
            )}
            {/* <div className="flex flex-col gap-1.5">
              <Label htmlFor="manualPayMethod">Payment Method <span className="text-destructive">*</span></Label>
              <Select value={manualPayMethod} onValueChange={setManualPayMethod}>
                <SelectTrigger id="manualPayMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="gcash">GCash</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {manualPayMethod !== "cash" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="manualPayRef">Reference Number</Label>
                <Input
                  id="manualPayRef"
                  placeholder={manualPayMethod === "gcash" ? "GCash reference no." : "Bank transaction ref."}
                  value={manualPayRef}
                  onChange={e => setManualPayRef(e.target.value)}
                />
              </div>
            )} */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="manualPayDate">
                Date of Payment <span className="text-destructive">*</span>
              </Label>
              <Input
                id="manualPayDate"
                type="date"
                value={manualPayDate}
                onChange={(e) => setManualPayDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="manualPayNotes">
                Notes{" "}
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="manualPayNotes"
                rows={2}
                placeholder="Any additional notes about this payment…"
                value={manualPayNotes}
                onChange={(e) => setManualPayNotes(e.target.value)}
                className="resize-none text-xs"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setManualPayOpen(false)}
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

      {/* ── Dialog 3: Bulk Payment Submission Review ─────────────────── */}
      <PaymentReviewDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        title="Bulk Payment Submission"
        description={`One payment covers all outstanding fines for ${liveSelectedRecord?.studentName ?? "this student"}.`}
        data={
          liveSelectedRecord?.bulkPaymentSubmission
            ? {
                lineItems: liveSelectedRecord.fineItems
                  .filter((i) => !i.isWaived)
                  .map((i) => ({
                    label: `${i.fineTypeName}${i.eventName ? ` — ${i.eventName}` : ""}`,
                    amount: i.amount,
                  })),
                showLineItemsTotal: true,
                amountPaid: liveSelectedRecord.bulkPaymentSubmission.amountPaid,
                paymentMethod:
                  liveSelectedRecord.bulkPaymentSubmission.paymentMethod,
                referenceNo:
                  liveSelectedRecord.bulkPaymentSubmission.gcashReferenceNumber,
                submittedAt:
                  liveSelectedRecord.bulkPaymentSubmission.dateOfPayment,
                approveConfirmMessage: `This will mark all fine items for ${liveSelectedRecord.studentName} as settled.`,
              }
            : null
        }
        onApprove={handleApprovePayment}
        onReject={handleRejectPayment}
      />

      {/* ── Receipt Preview ───────────────────────────────────────────── */}
      <FineReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        record={receiptRecord}
      />
    </div>
  );
}
