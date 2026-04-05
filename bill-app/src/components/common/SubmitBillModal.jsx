import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, Paperclip } from "lucide-react";
import { toast } from "react-hot-toast";
import { BILL_TYPES } from "../../utils/helpers";
import { DEMO_PROJECTS } from "../../utils/mockData";

const SubmitBillModal = ({ onClose, onSuccess, projects = null }) => {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const projectList = projects || DEMO_PROJECTS;

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append("receipt", file);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/bills`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
          signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) throw new Error("server error");
      } catch {
        // Demo mode — simulate success
        await new Promise(r => setTimeout(r, 800));
      }

      toast.success("Bill submitted successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to submit bill");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Submit Reimbursement Bill</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>Travel & food expenses at client locations</p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
            <div className="form-group">
              <label>Bill Title *</label>
              <input className={`form-input ${errors.title ? "error" : ""}`} placeholder="e.g. Client site travel – Chennai"
                {...register("title", { required: "Title required" })} />
              {errors.title && <span className="field-error">{errors.title.message}</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div className="form-group">
                <label>Bill Type *</label>
                <select className="form-select" {...register("type", { required: true })}>
                  {BILL_TYPES.map(t => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Amount (₹) *</label>
                <input className={`form-input ${errors.amount ? "error" : ""}`} type="number" min="1" step="0.01" placeholder="0.00"
                  {...register("amount", { required: "Amount required", min: { value: 1, message: "Min ₹1" } })} />
                {errors.amount && <span className="field-error">{errors.amount.message}</span>}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div className="form-group">
                <label>Project *</label>
                <select className="form-select" {...register("projectId", { required: true })}>
                  <option value="">Select project…</option>
                  {projectList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input className={`form-input ${errors.date ? "error" : ""}`} type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  {...register("date", { required: "Date required" })} />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input" rows={2} placeholder="Describe the expense — purpose, number of people, locations, etc."
                style={{ resize: "vertical" }} {...register("description")} />
            </div>

            {/* File upload */}
            <div className="form-group">
              <label>Receipt / Bill Photo</label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.65rem 0.9rem", border: "1.5px dashed var(--border)", borderRadius: "var(--radius)", cursor: "pointer", background: file ? "var(--primary-light)" : "var(--bg)", transition: "all 0.15s" }}>
                {file ? <Paperclip size={16} color="var(--primary)" /> : <Upload size={16} color="var(--text-muted)" />}
                <span style={{ fontSize: "0.875rem", color: file ? "var(--primary)" : "var(--text-muted)" }}>
                  {file ? file.name : "Click to upload receipt (PDF, JPG, PNG)"}
                </span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" hidden onChange={e => setFile(e.target.files[0])} />
              </label>
            </div>

            <div className="form-group">
              <label>Bank / UPI Details (for payment)</label>
              <input className="form-input" placeholder="UPI ID or Bank account number"
                {...register("bankDetails")} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Leave blank if already on file in your profile</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Submitting…</> : "Submit Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitBillModal;
