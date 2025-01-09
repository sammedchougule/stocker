"use client";

import React, { useState, useEffect } from "react";
import financialsData from "../data/financials.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  ChartLine,
  Scale,
  ReceiptIndianRupee,
  Calculator,
  ChartPie,
} from "lucide-react";

interface FinancialData {
  [key: string]: {
    "Quarterly Results": Record<string, string | number | null>[];
    "Profit & Loss": Record<string, string | number | null>[];
    "Balance Sheet": Record<string, string | number | null>[];
    "Cash Flows": Record<string, string | number | null>[];
    "Ratios": Record<string, string | number | null>[];
  };
}

interface TableData {
  header: string[];
  rows: Record<string, string | number | null>[];
}

interface FinancialTablesProps {
  stockName: string;
}

const FinancialTables: React.FC<FinancialTablesProps> = ({ stockName }) => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [openSection, setOpenSection] = useState<string>("Quarterly Results");
  const [viewType, setViewType] = useState<"Normal" | "Growth">("Normal");

  useEffect(() => {
    // Load JSON data
    setFinancialData(financialsData as FinancialData);
  }, []);

  if (!financialData) {
    return <div className="text-center py-4 text-gray-500">Loading..</div>;
  }

  const currentStockData = financialData[stockName];
  if (!currentStockData) {
    return <div className="text-center py-4 text-gray-500">No financial data found for {stockName}</div>;
  }

  const prepareTableData = (tableType: keyof FinancialData[string]): TableData | null => {
    const data = currentStockData[tableType];

    if (!data || data.length === 0) {
      return null;
    }

    const headers = Object.keys(data[0]);

    return {
      header: headers,
      rows: data,
    };
  };

  const tableSections: (keyof FinancialData[string])[] = [
    "Quarterly Results",
    "Profit & Loss",
    "Balance Sheet",
    "Cash Flows",
    "Ratios",
  ];

  const sectionIcons: Record<string, React.ReactNode> = {
    "Quarterly Results": <ChartLine className="mr-2" />,
    "Profit & Loss": <Scale className="mr-2" />,
    "Balance Sheet": <ReceiptIndianRupee className="mr-2" />,
    "Cash Flows": <Calculator className="mr-2" />,
    "Ratios": <ChartPie className="mr-2" />,
  };

  const calculateGrowth = (current: number, previous: number): string | number => {
    if (previous === 0) {
      return "-"; // Handle division by zero
    }
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(2) + "%";
  };

  const getCellColor = (value: string | number): string => {
    if (typeof value === "string" || isNaN(value as number)) {
      return ""; // No color for existing percentages or non-numeric values
    }
    const change = parseFloat(value.slice(0, -1)); // Extract percentage value
    return change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "";
  };

  return (
    <div className="container mx-auto lg:px-8 sm:px-0">
      <div className="flex justify-between mb-4">
        <button
          className={`px-4 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-200 ${
            viewType === "Normal" && "bg-gray-100"
          }`}
          onClick={() => setViewType("Normal")}
        >
          Normal
        </button>
        <button
          className={`px-4 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-200 ${
            viewType === "Growth" && "bg-gray-100"
          }`}
          onClick={() => setViewType("Growth")}
        >
          Growth
        </button>
      </div>

      {tableSections.map((section) => {
        const tableData = prepareTableData(section);
        const isOpen = openSection === section;

        return (
          <div key={section} className="mb-8">
            <div
              className="flex items-center cursor-pointer mb-4 border-b"
              onClick={() => setOpenSection(isOpen ? "" : section)}
            >
              <h3 className="text-xl font-medium text-gray-800 mr-4 flex items-center">
                {sectionIcons[section]} {section}
              </h3>
              <div className="flex-1 text-center text-gray-600">
                {!isOpen && `View ${section} Statement`}
              </div>
              <div>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>
            {isOpen ? (
              tableData ? (
                <>
                  <h4 className="text-gray-500 mb-4">Consolidated Figures in Rs. Crores</h4>
                  <div className="overflow-auto max-h-[600px]">
                    <Table className="min-w-full border-collapse overflow-hidden shadow-lg rounded-lg">
                      <TableHeader className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
                        <TableRow>
                          <TableHead
                            className="sticky left-0 z-10 bg-gradient-to-r from-blue-400 to-indigo-500 font-semibold text-left px-4 py-2"
                          >
                            Financial Year
                          </TableHead>
                          {tableData.header.slice(1).map((header, index) => (
                            <TableHead
                              key={index}
                              className="text-left font-semibold px-4 py-2"
                            >
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white">
                        {tableData.rows.map((row, rowIndex) => (
                          <TableRow
                            key={rowIndex}
                            className="hover:bg-gray-200 transition-colors cursor-pointer duration-200"
                          >
                            <TableCell
                              className="sticky left-0 z-10 bg-gray-100 px-4 py-2 font-medium text-gray-800 whitespace-nowrap"
                            >
                              {row[tableData.header[0]]}
                            </TableCell>
                            {tableData.header.slice(1).map((header, colIndex) => {
                              const cellValue = row[header];
                              let displayValue = cellValue;

                              if (viewType === "Growth" && typeof cellValue === "number") {
                                // Calculate and display growth percentage
                                if (rowIndex > 0) {
                                  const previousValue =
                                    tableData.rows[rowIndex - 1][header] as number;
                                  displayValue = calculateGrowth(cellValue, previousValue);
                                } else {
                                  displayValue = "-"; // No previous value for first row
                                }
                              }

                              return (
                                <TableCell
                                  key={colIndex}
                                  className={`px-4 py-2 text-gray-700 whitespace-nowrap ${getCellColor(
                                    displayValue
                                  )}`}
                                >
                                  {displayValue}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No data available for {section}
                </div>
              )
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default FinancialTables;
