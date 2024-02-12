



import React from 'react';
import { Box, Typography } from '@mui/material';
import DataTable, { Column } from 'src/component/DataTable'; // Assuming the file path to your GenericTable component


const InvoiceTable: React.FC = () => {
  const columns:Column[] = [
    { id: 'id', label: 'ID', sortable: true, showChip: false },
    { id: 'total_cost', label: 'Total Cost', sortable: true },
    { id: 'created_at', label: 'Invoice Date', sortable: true },
    { id: 'Chip', label: 'Chip', sortable: false },
    { id: 'pdf', label: 'Download', sortable: false },
  ];

  const data = [
    { id: '2', total_cost: 100, created_at: '2024-02-06', Chip: 'Paid', pdf: 'invoice_1.pdf' },
    { id: '8', total_cost: 350, created_at: '2024-02-07', Chip: 'Pending', pdf: 'invoice_2.pdf' },
    { id: '3', total_cost: 250, created_at: '2024-02-02', Chip: 'successful', pdf: 'invoice_3.pdf' },
   
  ];

  return (
    <Box>
      
      <DataTable columns={columns} data={data} heading="Billing History" />

    </Box>
  );
}

export default InvoiceTable;
