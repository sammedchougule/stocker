// "use client"
// import React, { useState, useEffect } from 'react';
// import financialsData from '../data/financials.json';
// import {
//     Layout,
//     FileBarChart,
//     LineChart,
//     Scale,
//     Coins,
// } from 'lucide-react';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
//   } from "@/components/ui/table";


// interface FinancialData {
//     [key: string]: {
//         "Quarterly Results": Record<string, string | number | null>[],
//         "Profit & Loss": Record<string, string | number | null>[],
//         "Balance Sheet": Record<string, string | number | null>[],
//         "Cash Flows": Record<string, string | number | null>[],
//         "Ratios": Record<string, string | number | null>[],
//     }
// }

// interface TableData {
//     header: string[];
//     rows: Record<string, string | number | null>[];
// }


// interface FinancialTablesProps {
//     stockName: string;
// }

// const FinancialTables: React.FC<FinancialTablesProps> = ({ stockName }) => {
//     const [financialData, setFinancialData] = useState<FinancialData | null>(null);
//     const [selectedTable, setSelectedTable] = useState<keyof FinancialData[string]>('Quarterly Results');

//     useEffect(() => {
//         // Load JSON data
//         setFinancialData(financialsData as FinancialData);
//     }, []);

//     if (!financialData) {
//         return <div className="text-center py-4 text-gray-500">Loading..</div>;
//     }

//     const currentStockData = financialData[stockName];
//     if (!currentStockData) {
//         return <div className="text-center py-4 text-gray-500">No financial data found for {stockName}</div>;
//     }

//     const handleTableChange = (tableType: keyof FinancialData[string]) => {
//         setSelectedTable(tableType);
//     };

//     const prepareTableData = (tableType: keyof FinancialData[string]): TableData | null => {
//         const data = currentStockData[tableType];

//         if (!data || data.length === 0) {
//             return null;
//         }

//         const headers = Object.keys(data[0]);

//         return {
//             header: headers,
//             rows: data
//         };
//     }

//     const tableData = prepareTableData(selectedTable);

//       const getIcon = (tableType: keyof FinancialData[string]) => {
//         switch (tableType) {
//             case "Quarterly Results":
//                 return <Layout className="mr-2 h-5 w-5" />;
//             case "Profit & Loss":
//                  return <FileBarChart className="mr-2 h-5 w-5" />;
//             case "Balance Sheet":
//                 return <Scale className="mr-2 h-5 w-5" />;
//             case "Cash Flows":
//                  return <Coins className="mr-2 h-5 w-5" />;
//             case "Ratios":
//                 return <LineChart className="mr-2 h-5 w-5" />;
//              default:
//                 return null;
//         }
//     };

//     return (
//         <div className="container mx-auto lg:px-8 sm:px-0">

//                 {/* Button Group */}

//                     <div className="flex flex-wrap gap-2 sm:gap-3 w-full">
//                         <button
//                             onClick={() => handleTableChange('Quarterly Results')}
//                             className={`px-3 py-2 flex items-center border border-gray-300 rounded-lg shadow 
//                                 ${selectedTable === 'Quarterly Results' ? 'text-white bg-gray-600' : ''}`}
//                         >
//                             {getIcon('Quarterly Results')}
//                             <span className="">Quarterly Results</span>
//                         </button>
//                         <button
//                             onClick={() => handleTableChange('Profit & Loss')}
//                             className={` px-3 py-2 flex items-center border border-gray-300 rounded-lg shadow 
//                                 ${selectedTable === 'Profit & Loss' ? 'text-white bg-gray-600' : ''}`}
//                         >
//                             {getIcon('Profit & Loss')}
//                             <span className="">Profit & Loss</span>
//                         </button>
//                         <button
//                             onClick={() => handleTableChange('Balance Sheet')}
//                             className={` px-3 py-2 flex items-center border border-gray-300 rounded-lg shadow 
//                                 ${selectedTable === 'Balance Sheet' ? 'text-white bg-gray-600' : ''}`}
//                         >
//                             {getIcon('Balance Sheet')}
//                             <span className="">Balance Sheet</span>
//                         </button>
//                         <button
//                             onClick={() => handleTableChange('Cash Flows')}
//                             className={` px-3 py-2 flex items-center border border-gray-300 rounded-lg shadow 
//                                 ${selectedTable === 'Cash Flows' ? 'text-white bg-gray-600' : ''}`}
//                         >
//                             {getIcon('Cash Flows')}
//                             <span className="">Cash Flows</span>
//                         </button>
//                         <button
//                             onClick={() => handleTableChange('Ratios')}
//                             className={` px-3 py-2 flex items-center border border-gray-300 rounded-lg shadow 
//                                 ${selectedTable === 'Ratios' ? 'text-white bg-gray-600' : ''}`}
//                         >
//                             {getIcon('Ratios')}
//                             <span className="">Ratios</span>
//                         </button>
//                     </div>


//                 {/* Table Section */}

//                     {tableData ? (
//                         <div className="overflow-auto max-h-[600px]">
//                             <div>
//                                 {/* Financial Statement Name shoulg be here */}
//                                 <h4 className='text-gray-500 mb-4'>Consolidated Figures in Rs. Crores</h4>
//                             </div>
//                             <Table className="min-w-full divide-y divide-gray-300 relative border border-gray-300">
//                                 <TableHeader className="bg-gray-100">
//                                     <TableRow>
//                                     <TableHead
//                                         className="sticky left-0 z-10 bg-gray-100 font-semibold text-left border-r border-b border-gray-300"
//                                     >
//                                         Financial Year
//                                     </TableHead>
//                                     {tableData.header.slice(1).map((header, index) => (
//                                         <TableHead
//                                         key={index}
//                                         className="text-left font-semibold border-r border-b border-gray-300"
//                                         >
//                                         {header}
//                                         </TableHead>
//                                     ))}
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody className="bg-white divide-y divide-gray-300">
//                                     {tableData.rows.map((row, rowIndex) => (
//                                     <TableRow key={rowIndex} className="hover:bg-gray-50">
//                                         <TableCell
//                                         className="sticky left-0 z-10 bg-white px-4 py-2 font-medium text-gray-800 border-r border-b border-gray-300 whitespace-nowrap"
//                                         >
//                                         {row[tableData.header[0]]}
//                                         </TableCell>
//                                         {tableData.header.slice(1).map((header, colIndex) => (
//                                         <TableCell
//                                             key={colIndex}
//                                             className="px-4 py-2 text-gray-700 border-r border-b border-gray-300 whitespace-nowrap"
//                                         >
//                                             {row[header]}
//                                         </TableCell>
//                                         ))}
//                                     </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </div>
//                     ) : (
//                         <div className="text-center py-4 text-gray-500">
//                             No data available for {selectedTable}
//                         </div>
//                     )}
//         </div>

//     );
// };

// export default FinancialTables;

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
import { ChevronDown, ChevronUp, ChartLine, Scale, ReceiptIndianRupee , Calculator, ChartPie } from "lucide-react";

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
      

    return (
        <div className="container mx-auto lg:px-8 sm:px-0">
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
                                                    <TableRow key={rowIndex} className="hover:bg-gray-200 transition-colors cursor-pointer duration-200">
                                                        <TableCell
                                                            className="sticky left-0 z-10 bg-gray-100 px-4 py-2 font-medium text-gray-800 whitespace-nowrap"
                                                        >
                                                            {row[tableData.header[0]]}
                                                        </TableCell>
                                                        {tableData.header.slice(1).map((header, colIndex) => (
                                                            <TableCell
                                                                key={colIndex}
                                                                className="px-4 py-2 text-gray-700 whitespace-nowrap"
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
