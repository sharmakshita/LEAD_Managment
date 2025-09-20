import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import api from "../api/axios.js";

const LeadsList = () => {
  const [rowData, setRowData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeads = async () => {
    const res = await api.get(`/leads?page=${page}&limit=10`);
    setRowData(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchLeads();
  }, [page]);

  const columns = [
    { field: "first_name" },
    { field: "last_name" },
    { field: "email" },
    { field: "phone" },
    { field: "company" },
    { field: "status" },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact rowData={rowData} columnDefs={columns} pagination={false} />
      <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
      <span>{page} / {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
};

export default LeadsList;
