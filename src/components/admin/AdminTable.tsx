import React, { useState, useRef } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,

  PrinterIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  PlusIcon,

  ArrowDownIcon,


} from "@heroicons/react/24/outline";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  className?: string;
}

interface PaginationProps {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function AdminTable({ searchQuery, setSearchQuery, handleSearch, setAddModalOpen, title, total, columns, pagination, loading, error }: {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  setAddModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title: any[];
  total?: number;
  columns: Column[];
  pagination?: PaginationProps;
  loading?: boolean;
  error?: string | null;
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

  // Excel Export
  const handleExportExcel = () => {
    const data = title.map((row: any) => {
      const obj: any = {};
      columns.forEach(col => {
        obj[col.label] = typeof col.render === 'function' ? col.render(row) : row[col.key];
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Table");
    XLSX.writeFile(wb, "admin-table.xlsx");
    setExportOpen(false);
  };

  // PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map(col => col.label);
    const tableRows = title.map((row: any) => columns.map(col => typeof col.render === 'function' ? col.render(row) : row[col.key]));
    autoTable(doc, { head: [tableColumn], body: tableRows });
    doc.save("admin-table.pdf");
    setExportOpen(false);
  };
  return <main className={`lg:col-span-4 space-y-6`}>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text" placeholder="Search for title..." className="flex h-9 w-full rounded-md border border-[#D0D5DD] bg-transparent pl-10 pr-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#98A2B3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-left" />
          <MagnifyingGlassIcon className="w-4 h-4 text-[#98A2B3] absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
        <button
          onClick={() => handleSearch()}



          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#D0D5DD] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-9 px-4 py-2"
        >
          Search
        </button>

      </div>
      {setAddModalOpen && (
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 bg-primary text-white shadow hover:bg-primary-dark h-9 px-4 py-2" onClick={() => setAddModalOpen(true)}>
          Add New   <PlusIcon className="w-4 h-4 mr-2" />
        </button>
      )}
    </div>
    <div className="bg-white rounded-xl border border-[#EAECF0] shadow-soft">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b border-[#EAECF0]">
        <div className="text-sm text-[#667085]">Total: <span className="font-semibold text-[#101828]">{total}</span></div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={exportRef}>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#D0D5DD] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-8 rounded-md px-3 text-xs"
              onClick={() => setExportOpen((prev) => !prev)}
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />Export
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-[#EAECF0] rounded shadow z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#F2F4F7]"
                  onClick={handleExportExcel}
                >
                  Export to Excel
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#F2F4F7]"
                  onClick={handleExportPDF}
                >
                  Export to PDF
                </button>
              </div>
            )}
          </div>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#D0D5DD] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-8 rounded-md px-3 text-xs">
            <PrinterIcon className="w-4 h-4 mr-2" />Print
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <table className="w-full caption-bottom text-sm ltr text-[#344054]">
            <thead className="bg-[#F9FAFB]">
              <tr className="border-b border-[#EAECF0]">
                <th className="h-10 px-2 align-middle font-medium text-[#98A2B3] w-12 text-center">
                  <input type="checkbox" className="h-4 w-4 rounded-sm border border-[#1976D2] shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2]" />
                </th>
                {columns.map((col) => (
                  <th key={col.key} className={col.className || "h-10 px-2 align-middle font-medium text-[#98A2B3] text-left"}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {title?.map((row: any) => (
                <tr key={row.id} className="border-b border-[#EAECF0] hover:bg-[#F9FAFB]">
                  <td className="p-2 align-middle text-center">
                    <input type="checkbox" className="h-4 w-4 rounded-sm border border-[#1976D2] shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2]" />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className={col.className || "p-2 align-middle text-left"}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {pagination && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
          <div className="text-sm text-[#667085]">
            Showing <span className="font-semibold text-[#101828]">{pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.perPage + 1}</span> to <span className="font-semibold text-[#101828]">{Math.min((pagination.page - 1) * pagination.perPage + title.length, pagination.total)}</span> of <span className="font-semibold text-[#101828]">{pagination.total}</span> customers
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-sm text-[#667085]">Rows per page:</label>
              <select id="pageSize" className="px-3 py-1 border border-[#EAECF0] rounded-md bg-white text-[#101828] text-sm" value={pagination.perPage} onChange={pagination.onPerPageChange}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center">
              <ul className="flex flex-row items-center gap-1">
                <li>
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#EAECF0] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-9 px-4 py-2 gap-1 pr-2.5"
                    aria-label="Go to previous page"
                    disabled={pagination.page === 1}
                    onClick={() => pagination.onPageChange(pagination.page - 1)}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    <span>Previous</span>
                  </button>
                </li>
                <li>
                  <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-[#D0D5DD] bg-transparent shadow-sm h-9 w-9 cursor-pointer">{pagination.page}</span>
                </li>
                <li>
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#EAECF0] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-9 px-4 py-2 gap-1 pl-2.5"
                    aria-label="Go to next page"
                    disabled={pagination.page === pagination.lastPage}
                    onClick={() => pagination.onPageChange(pagination.page + 1)}
                  >
                    <span>Next</span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  </main>;
}
export default AdminTable;