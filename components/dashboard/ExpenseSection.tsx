"use client";

import { useState } from "react";
import CoordinatorQuickActions from "@/components/dashboard/CoordinatorQuickActions";
import CreateExpenseModal from "@/components/dashboard/CreateExpenseModal";
import ExpenseTable from "@/components/dashboard/ExpenseTable";
import { ExpenseWithItems } from "@/app/actions/expense";

interface ExpenseSectionProps {
  activeGroup: {
    id: string;
    group_name: string;
    invite_code: string;
  };
  isAdmin: boolean;
  memberCount: number;
  initialExpenses: ExpenseWithItems[];
  currentUserId?: string | null;
}

export default function ExpenseSection({
  activeGroup,
  isAdmin,
  memberCount,
  initialExpenses,
  currentUserId,
}: ExpenseSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Tombol Aksi Cepat Koordinator (Quick Actions) */}
      <CoordinatorQuickActions
        inviteCode={activeGroup.invite_code}
        groupName={activeGroup.group_name}
        isAdmin={isAdmin}
        onOpenCreateExpense={() => setIsModalOpen(true)}
      />

      {/* Modal Pop-up Tambah Tagihan Kas Bersama (Auto-Split Engine) */}
      <CreateExpenseModal
        groupId={activeGroup.id}
        memberCount={memberCount}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Data Table Tagihan Pengeluaran dengan Filter Status & Badges Tabler */}
      <ExpenseTable
        expenses={initialExpenses}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
        onOpenCreateModal={() => setIsModalOpen(true)}
      />
    </>
  );
}
