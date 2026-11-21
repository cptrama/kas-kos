"use server";

import { createClient } from "@/lib/supabase/server";

export interface GroupFinancialStats {
  totalCollected: number;
  totalPending: number;
  totalExpenses: number;
  expensesCount: number;
  activeMembersCount: number;
}

/**
 * Server Action: Mengambil ringkasan statistik kas untuk Dashboard Koordinator
 */
export async function getGroupFinancialStats(groupId: string): Promise<GroupFinancialStats> {
  const supabase = await createClient();

  // 1. Ambil jumlah anggota aktif dalam grup
  const { count: memberCount, error: memberErr } = await supabase
    .from("group_members")
    .select("id", { count: "exact", head: true })
    .eq("group_id", groupId);

  const activeMembersCount = memberCount || 0;

  // 2. Ambil seluruh data pengeluaran dan porsi tagihan bill_items
  const { data: expenses, error: expErr } = await supabase
    .from("expenses")
    .select(`
      id,
      total_amount,
      bill_items (
        id,
        split_amount,
        status
      )
    `)
    .eq("group_id", groupId);

  if (expErr || !expenses) {
    return {
      totalCollected: 0,
      totalPending: 0,
      totalExpenses: 0,
      expensesCount: 0,
      activeMembersCount,
    };
  }

  let totalCollected = 0;
  let totalPending = 0;
  let totalExpenses = 0;

  for (const exp of expenses) {
    totalExpenses += Number(exp.total_amount) || 0;
    if (exp.bill_items && Array.isArray(exp.bill_items)) {
      for (const item of exp.bill_items) {
        const amount = Number(item.split_amount) || 0;
        if (item.status === "paid") {
          totalCollected += amount;
        } else {
          totalPending += amount;
        }
      }
    }
  }

  return {
    totalCollected,
    totalPending,
    totalExpenses,
    expensesCount: expenses.length,
    activeMembersCount,
  };
}
