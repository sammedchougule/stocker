"use client"
import React, { useState, useEffect } from 'react';
import financialsData from '../data/financials.json';
import {
    Layout,
    FileBarChart,
    LineChart,
    Scale,
    Coins,
} from 'lucide-react';

interface FinancialData {
    [key: string]: {
        "Quarterly Results": Record<string, string | number | null>[],
        "Profit & Loss": Record<string, string | number | null>[],
        "Balance Sheet": Record<string, string | number | null>[],
        "Cash Flows": Record<string, string | number | null>[],
        "Ratios": Record<string, string | number | null>[],
    }
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
    const [selectedTable, setSelectedTable] = useState<keyof FinancialData[string]>('Quarterly Results');

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

    const handleTableChange = (tableType: keyof FinancialData[string]) => {
        setSelectedTable(tableType);
    };

    const prepareTableData = (tableType: keyof FinancialData[string]): TableData | null => {
        const data = currentStockData[tableType];

        if (!data || data.length === 0) {
            return null;
        }

        const headers = Object.keys(data[0]);

        return {
            header: headers,
            rows: data
        };
    }

    const tableData = prepareTableData(selectedTable);

      const getIcon = (tableType: keyof FinancialData[string]) => {
        switch (tableType) {
            case "Quarterly Results":
                return <Layout className="mr-2 h-5 w-5" />;
            case "Profit & Loss":
                 return <FileBarChart className="mr-2 h-5 w-5" />;
            case "Balance Sheet":
                return <Scale className="mr-2 h-5 w-5" />;
            case "Cash Flows":
                 return <Coins className="mr-2 h-5 w-5" />;
            case "Ratios":
                return <LineChart className="mr-2 h-5 w-5" />;
             default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col items-center w-full">
        {/* Button Group */}
        <div className="mb-5 flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
            <button
                onClick={() => handleTableChange('Quarterly Results')}
                className={`group px-3 py-2 flex items-center border border-gray-300 bg-gray-100 rounded-lg shadow hover:bg-gray-200 ${selectedTable === 'Quarterly Results' ? 'text-blue-500' : ''}`}
            >
                {getIcon('Quarterly Results')}
                <span className="group-hover:underline">Quarterly Results</span>
            </button>
            <button
                onClick={() => handleTableChange('Profit & Loss')}
                className={`group px-3 py-2 flex items-center border border-gray-300 bg-gray-100 rounded-lg shadow hover:bg-gray-200 ${selectedTable === 'Profit & Loss' ? 'text-green-500' : ''}`}
            >
                {getIcon('Profit & Loss')}
                <span className="group-hover:underline">Profit & Loss</span>
            </button>
            <button
                onClick={() => handleTableChange('Balance Sheet')}
                className={`group px-3 py-2 flex items-center border border-gray-300 bg-gray-100 rounded-lg shadow hover:bg-gray-200 ${selectedTable === 'Balance Sheet' ? 'text-yellow-700' : ''}`}
            >
                {getIcon('Balance Sheet')}
                <span className="group-hover:underline">Balance Sheet</span>
            </button>
            <button
                onClick={() => handleTableChange('Cash Flows')}
                className={`group px-3 py-2 flex items-center border border-gray-300 bg-gray-100 rounded-lg shadow hover:bg-gray-200 ${selectedTable === 'Cash Flows' ? 'text-orange-500' : ''}`}
            >
                {getIcon('Cash Flows')}
                <span className="group-hover:underline">Cash Flows</span>
            </button>
            <button
                onClick={() => handleTableChange('Ratios')}
                className={`group px-3 py-2 flex items-center border border-gray-300 bg-gray-100 rounded-lg shadow hover:bg-gray-200 ${selectedTable === 'Ratios' ? 'text-red-500' : ''}`}
            >
                {getIcon('Ratios')}
                <span className="group-hover:underline">Ratios</span>
            </button>
        </div>

        {/* Table Section */}
        {tableData ? (
            <div className="container mx-auto px-4 py-4">
                <div className="inline-block min-w-full overflow-x-auto">
                    <div className="overflow-hidden border border-gray-300 rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-300 relative">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th
                                        className="sticky left-0 z-10 bg-gray-100 px-4 py-2 font-semibold text-left border-r border-gray-300"
                                    >
                                        Financial Year
                                    </th>
                                    {tableData.header.slice(1).map((header, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-2 text-left font-semibold border-r border-gray-300"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-300">
                                {tableData.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-gray-50">
                                        <td
                                            className="sticky left-0 z-10 bg-white px-4 py-2 font-medium text-gray-800 border-r border-gray-300 whitespace-nowrap"
                                        >
                                            {row[tableData.header[0]]}
                                        </td>
                                        {tableData.header.slice(1).map((header, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="px-4 py-2 text-gray-700 border-r border-gray-300 whitespace-nowrap"
                                            >
                                                {row[header]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-center py-4 text-gray-500">
                No data available for {selectedTable}
            </div>
        )}
    </div>
</div>

    );
};

export default FinancialTables;