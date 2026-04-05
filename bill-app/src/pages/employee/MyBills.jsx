import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import BillsTable from "../../components/common/BillsTable";
import SubmitBillModal from "../../components/common/SubmitBillModal";
import { Plus } from "lucide-react";
import { DEMO_BILLS } from "../../utils/mockData";

const MyBills = () => {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const myBills = DEMO_BILLS.filter(b => b.submittedBy?.id === "4");

  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 className="page-title">My Bills</h1>
          <p className="page-subtitle">All your submitted reimbursement requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Submit Bill</button>
      </div>
      <div className="card">
        <BillsTable bills={myBills} onRefresh={() => setRefresh(r => r + 1)} emptyMessage="No bills submitted yet." />
      </div>
      {showModal && <SubmitBillModal onClose={() => setShowModal(false)} onSuccess={() => setRefresh(r => r + 1)} />}
    </DashboardLayout>
  );
};

export default MyBills;
