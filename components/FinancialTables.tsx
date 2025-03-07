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
import { getStockBgColor } from "@/lib/getstockBgColor";
import CustomizedProgressBars from "./CustomizedProgressBars";

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

  useEffect(() => {
    // Load JSON data
    setFinancialData(financialsData as FinancialData);
  }, []);

  if (!financialData) {
    return <div className="text-center py-4 text-gray-500"><CustomizedProgressBars/></div>;
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


  return (
    <div className="container mx-auto lg:px-8 sm:px-0">
  {tableSections.map((section) => {
    const tableData = prepareTableData(section);
    const isOpen = openSection === section;

    return (
      <div key={section} className="mb-8">
        {/* Section Header */}
        <div
          className="flex items-center cursor-pointer mb-4 border-b dark:border-gray-700"
          onClick={() => setOpenSection(isOpen ? "" : section)}
        >
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mr-4 flex items-center">
            {sectionIcons[section]} {section}
          </h3>
          <div>{isOpen ? <ChevronUp /> : <ChevronDown />}</div>
        </div>

        {/* Table Content */}
        {isOpen ? (
          tableData ? (
            <>
              <h4 className="text-gray-500 dark:text-gray-400 mb-4">
                Consolidated Figures in Rs. Crores
              </h4>
              <div className="overflow-x-auto max-h-[600px]">
                <Table className="min-w-full border-collapse shadow-lg rounded-lg">
                  {/* Table Header */}
                  <TableHeader
                    className="text-white"
                    style={{ backgroundColor: getStockBgColor(stockName) }}
                  >
                    <TableRow>
                      <TableHead
                        className="sticky left-0 z-10 font-semibold text-left text-white px-4 py-2"
                        style={{ backgroundColor: getStockBgColor(stockName) }}
                      >
                        Financial Year
                      </TableHead>
                      {tableData.header.slice(1).map((header, index) => (
                        <TableHead
                          key={index}
                          className="text-left font-semibold px-4 py-2 text-black dark:text-white"
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className="bg-white dark:bg-[#151719]">
                    {tableData.rows.map((row, rowIndex) => (
                      <TableRow
                        key={rowIndex}
                        className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer duration-200"
                      >
                        <TableCell className="sticky left-0 z-10 bg-gray-100 dark:bg-gray-900 px-4 py-2 font-medium text-gray-800 dark:text-gray-300 whitespace-nowrap">
                          {row[tableData.header[0]]}
                        </TableCell>
                        {tableData.header.slice(1).map((header, colIndex) => (
                          <TableCell
                            key={colIndex}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap"
                          >
                            {row[header]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
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
