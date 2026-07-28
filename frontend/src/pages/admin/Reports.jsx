import { FileText, Download } from "lucide-react";

const REPORTS = [
  { id: "R001", title: "Monthly Revenue Report", period: "November 2024", size: "2.4 MB", generatedAt: "2024-12-01" },
  { id: "R002", title: "User Growth Report", period: "Q4 2024", size: "1.1 MB", generatedAt: "2024-12-05" },
  { id: "R003", title: "Seller Performance Report", period: "November 2024", size: "3.7 MB", generatedAt: "2024-12-03" },
  { id: "R004", title: "Order Analytics Report", period: "November 2024", size: "1.8 MB", generatedAt: "2024-12-02" },
  { id: "R005", title: "Product Inventory Report", period: "December 2024", size: "0.9 MB", generatedAt: "2024-12-10" },
];

const AdminReports = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Reports</h1>

    <div className="grid gap-4">
      {REPORTS.map((report) => (
        <div
          key={report.id}
          className="rounded-xl border bg-white p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition"
        >
          <div className="p-3 bg-blue-50 rounded-xl">
            <FileText size={20} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800">{report.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{report.period} · {report.size} · Generated: {report.generatedAt}</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors shrink-0">
            <Download size={15} />
            Download
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default AdminReports;
