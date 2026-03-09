"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  Upload,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  FileSearch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { mockTransactions, type Transaction } from "@/lib/mock-data";
import TransactionDetailModal from "@/components/dashboard/TransactionDetailModal";

const CATEGORIES = [
  "Все",
  "Супермаркеты",
  "Такси",
  "Кафе",
  "ЖКХ",
  "Развлечения",
  "Покупки",
  "Зарплата",
  "Возвраты",
  "Транспорт",
  "Подписки",
];

const PAGE_SIZES = [10, 25, 50] as const;

type SortKey = keyof Pick<Transaction, "date" | "amount" | "merchant" | "category">;
type SortDir = "asc" | "desc";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState("Все");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [modalTx, setModalTx] = useState<Transaction | null>(null);

  // Filter
  const filtered = useMemo(() => {
    return mockTransactions.filter((tx) => {
      const matchSearch =
        !search ||
        tx.merchant.toLowerCase().includes(search.toLowerCase()) ||
        tx.category.toLowerCase().includes(search.toLowerCase());
      const matchType =
        typeFilter === "all" ||
        (typeFilter === "income" && tx.type === "income") ||
        (typeFilter === "expense" && tx.type === "expense");
      const matchCategory =
        categoryFilter === "Все" || tx.category === categoryFilter;
      return matchSearch && matchType && matchCategory;
    });
  }, [search, typeFilter, categoryFilter]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: string | number = a[sortKey];
      let bv: string | number = b[sortKey];
      if (sortKey === "amount") {
        av = a.amount;
        bv = b.amount;
      } else if (sortKey === "date") {
        // parse DD.MM.YYYY
        const parseDate = (d: string) => {
          const [day, month, year] = d.split(".");
          return new Date(`${year}-${month}-${day}`).getTime();
        };
        av = parseDate(a.date);
        bv = parseDate(b.date);
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((t) => t.id)));
    }
  };

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("Все");
    setPage(1);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3.5 h-3.5 text-default-400" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-[#00E5FF]" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-[#00E5FF]" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-default-400 mb-1">
            <span>Dashboard</span>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Транзакции</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground">Транзакции</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF]/20 transition-colors">
          <Upload className="w-4 h-4" />
          Импортировать выписку
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-default-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Поиск по месту и категории..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-content2 border border-divider text-sm placeholder:text-default-400 focus:outline-none focus:border-[#00E5FF] transition-all"
            />
          </div>

          {/* Type filter */}
          <div className="flex rounded-xl overflow-hidden border border-divider h-10">
            {(["all", "income", "expense"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTypeFilter(t);
                  setPage(1);
                }}
                className={`px-4 text-sm font-medium transition-colors ${
                  typeFilter === t
                    ? "bg-content3 text-foreground"
                    : "bg-content2 text-default-400 hover:bg-content3"
                }`}
              >
                {t === "all" ? "Все" : t === "income" ? "Доходы" : "Расходы"}
              </button>
            ))}
          </div>

          {/* Category select */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl bg-content2 border border-divider text-sm text-foreground focus:outline-none focus:border-[#00E5FF] transition-all"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3.5 h-10 rounded-xl bg-content2 border border-divider text-sm text-default-500 hover:text-foreground hover:bg-content3 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Сбросить
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-divider bg-content2/50">
                <th className="pl-5 pr-3 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginated.length > 0 && selected.size === paginated.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-divider accent-[#00E5FF] cursor-pointer"
                  />
                </th>
                <th
                  className="px-3 py-4 text-left cursor-pointer select-none"
                  onClick={() => toggleSort("date")}
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium text-default-400">
                    Дата и время
                    <SortIcon col="date" />
                  </div>
                </th>
                <th
                  className="px-3 py-4 text-left cursor-pointer select-none"
                  onClick={() => toggleSort("category")}
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium text-default-400">
                    Категория
                    <SortIcon col="category" />
                  </div>
                </th>
                <th
                  className="px-3 py-4 text-left cursor-pointer select-none"
                  onClick={() => toggleSort("merchant")}
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium text-default-400">
                    Место покупки
                    <SortIcon col="merchant" />
                  </div>
                </th>
                <th className="px-3 py-4 text-left text-xs font-medium text-default-400">
                  Счет
                </th>
                <th
                  className="px-3 py-4 text-right cursor-pointer select-none"
                  onClick={() => toggleSort("amount")}
                >
                  <div className="flex items-center justify-end gap-1.5 text-xs font-medium text-default-400">
                    Сумма
                    <SortIcon col="amount" />
                  </div>
                </th>
                <th className="px-3 py-4 text-right text-xs font-medium text-default-400">
                  Баланс после
                </th>
                <th className="pr-5 py-4 w-10" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <FileSearch className="w-12 h-12 text-default-300 mb-3" />
                      <p className="text-default-500 font-medium">Ничего не найдено</p>
                      <p className="text-sm text-default-400 mt-1">
                        Попробуйте изменить фильтры
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setModalTx(tx)}
                    className={`border-b border-divider/40 hover:bg-content2/50 transition-colors cursor-pointer ${
                      selected.has(tx.id) ? "bg-[#00E5FF]/5" : ""
                    }`}
                  >
                    <td
                      className="pl-5 pr-3 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(tx.id)}
                        onChange={() => toggleSelect(tx.id)}
                        className="rounded border-divider accent-[#00E5FF] cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3.5 text-default-400 whitespace-nowrap text-xs">
                      {tx.date} {tx.time}
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-content2 text-xs font-medium text-default-600">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 font-medium text-foreground">
                      {tx.merchant}
                    </td>
                    <td className="px-3 py-3.5 text-default-500 text-xs">
                      {tx.account}
                    </td>
                    <td className="px-3 py-3.5 text-right font-semibold tabular-nums">
                      <span
                        className={
                          tx.amount > 0 ? "text-[#00FFA3]" : "text-[#FF3366]"
                        }
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount.toLocaleString("ru-RU")} ₽
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right text-default-400 text-xs tabular-nums">
                      {tx.balanceAfter.toLocaleString("ru-RU")} ₽
                    </td>
                    <td className="pr-5 py-3.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalTx(tx);
                        }}
                        className="text-default-400 hover:text-foreground transition-colors"
                        aria-label="Открыть детали"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-divider">
          <div className="flex items-center gap-2 text-sm text-default-400">
            <span>Строк:</span>
            {PAGE_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setPageSize(s);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  pageSize === s
                    ? "bg-content3 text-foreground"
                    : "hover:bg-content2 text-default-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-default-400 mr-2">
              {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, sorted.length)} из {sorted.length}
            </span>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg hover:bg-content2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg hover:bg-content2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {modalTx && (
        <TransactionDetailModal tx={modalTx} onClose={() => setModalTx(null)} />
      )}
    </div>
  );
}
