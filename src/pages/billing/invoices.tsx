import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import DataTable, { Column, Row } from "src/component/DataTable";
import { listOfInvoice } from "src/services/billingService";
import useLoading from "src/hooks/loading";

function formatDate(timestamp: string): string {
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date: Date = new Date(timestamp);
  const day: number = date.getDate();
  const month: string = months[date.getMonth()];
  const year: number = date.getFullYear();

  return `${day} ${month} ${year}`;
}

const getStatusChipColor = (status: any) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "success";
    case "unpaid":
      return "error";
    default:
      return "warning";
  }
};

const addDollarSign = (value: number | string): string => {
  return `$ ${value}`;
};

const InvoiceTable: React.FC = () => {
  const [invoices, setInvoices] = useState<Row[]>([]);
  const { loading, startLoading, stopLoading } = useLoading();

  const getListOfInvoices = () => {
    startLoading();
    listOfInvoice().then((response) => {
      if (response) {
        stopLoading();
        setInvoices(response.data);
      }
    });
  };

  useEffect(() => {
    getListOfInvoices();
  }, []);

  const columns: Column[] = [
    { id: "invoice_number", label: "invoice number", sortable: true },
    { id: "total_cost", label: "Total Cost", sortable: true, strictFunction: addDollarSign },
    { id: "created_at", label: "Invoice Date", sortable: true, strictFunction: formatDate },
    { id: "status", label: "Status", sortable: false, showChip: true, strictFunction: getStatusChipColor },
    { id: "pdf", label: "Download", sortable: false, downloadableLink: true },
  ];

  return (
    <Box>
      <DataTable
        columns={columns}
        data={invoices}
        heading="Billing History"
        loading={loading}
      />
    </Box>
  );
}

export default InvoiceTable;

