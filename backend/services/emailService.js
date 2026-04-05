const nodemailer = require("nodemailer");

// ── Transport ─────────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || "smtp.gmail.com",
  port:   parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ── Shared HTML wrapper ───────────────────────────────────────────────────────
const wrap = (title, color, body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
    .container { max-width:560px; margin:32px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.08); }
    .header { background:${color}; padding:28px 32px; }
    .header h1 { color:#fff; margin:0; font-size:20px; font-weight:600; }
    .body { padding:32px; color:#333; line-height:1.6; }
    .badge { display:inline-block; padding:4px 12px; border-radius:20px; background:${color}22; color:${color}; font-weight:600; font-size:13px; }
    .detail-box { background:#f9f9f9; border-left:4px solid ${color}; padding:16px 20px; border-radius:0 6px 6px 0; margin:20px 0; }
    .detail-box p { margin:4px 0; font-size:14px; }
    .detail-box strong { min-width:130px; display:inline-block; color:#555; }
    .footer { padding:20px 32px; font-size:12px; color:#999; border-top:1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>💰 BillTrack — ${title}</h1></div>
    <div class="body">${body}</div>
    <div class="footer">This is an automated message from BillTrack. Please do not reply.</div>
  </div>
</body>
</html>`;

// ── Format currency ───────────────────────────────────────────────────────────
const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ── 1. Bill Submitted ─────────────────────────────────────────────────────────
const sendSubmittedEmail = async (bill, submitter, approverEmail) => {
  const html = wrap("New Bill Submitted", "#0f62fe", `
    <p>Hi there,</p>
    <p>A new reimbursement bill has been submitted and is awaiting your approval.</p>
    <div class="detail-box">
      <p><strong>Title:</strong> ${bill.title}</p>
      <p><strong>Type:</strong> ${bill.type}</p>
      <p><strong>Amount:</strong> ${inr(bill.amount)}</p>
      <p><strong>Submitted by:</strong> ${submitter.name} (${submitter.employeeId || submitter.email})</p>
      <p><strong>Date:</strong> ${new Date(bill.date).toLocaleDateString("en-IN")}</p>
      ${bill.description ? `<p><strong>Description:</strong> ${bill.description}</p>` : ""}
    </div>
    <p>Please log in to BillTrack to review and approve or reject this bill.</p>
  `);
  return send({
    to:      approverEmail,
    subject: `[BillTrack] New Bill: ${bill.title} — ${inr(bill.amount)}`,
    html,
  });
};

// ── 2. Bill Approved ──────────────────────────────────────────────────────────
const sendApprovedEmail = async (bill, employee, paymentAdminEmail) => {
  const html = wrap("Bill Approved ✅", "#198038", `
    <p>Hi <strong>${employee.name}</strong>,</p>
    <p>Great news! Your reimbursement bill has been <span class="badge">Approved</span>.</p>
    <div class="detail-box">
      <p><strong>Title:</strong> ${bill.title}</p>
      <p><strong>Amount:</strong> ${inr(bill.amount)}</p>
      <p><strong>Approved on:</strong> ${new Date(bill.approvedAt).toLocaleDateString("en-IN")}</p>
      ${bill.approvalNote ? `<p><strong>Note:</strong> ${bill.approvalNote}</p>` : ""}
    </div>
    <p>Your payment will be processed shortly by the Finance team. You will receive another notification once payment is made.</p>
  `);
  await send({
    to:      employee.email,
    cc:      paymentAdminEmail,
    subject: `[BillTrack] Bill Approved: ${bill.title} — ${inr(bill.amount)}`,
    html,
  });
};

// ── 3. Bill Rejected ──────────────────────────────────────────────────────────
const sendRejectedEmail = async (bill, employee) => {
  const html = wrap("Bill Rejected ❌", "#da1e28", `
    <p>Hi <strong>${employee.name}</strong>,</p>
    <p>Your reimbursement bill has been <span class="badge" style="background:#fde8e8;color:#da1e28;">Rejected</span>.</p>
    <div class="detail-box">
      <p><strong>Title:</strong> ${bill.title}</p>
      <p><strong>Amount:</strong> ${inr(bill.amount)}</p>
      <p><strong>Rejected on:</strong> ${new Date(bill.rejectedAt).toLocaleDateString("en-IN")}</p>
      <p><strong>Reason:</strong> ${bill.rejectionReason || "No reason provided"}</p>
    </div>
    <p>If you believe this is an error, please contact your manager or re-submit with the corrected information.</p>
  `);
  return send({
    to:      employee.email,
    subject: `[BillTrack] Bill Rejected: ${bill.title}`,
    html,
  });
};

// ── 4. Bill Paid ──────────────────────────────────────────────────────────────
const sendPaidEmail = async (bill, employee) => {
  const html = wrap("Payment Processed 💸", "#0043ce", `
    <p>Hi <strong>${employee.name}</strong>,</p>
    <p>Your reimbursement has been <span class="badge" style="background:#d0e4ff;color:#0043ce;">Paid</span>.</p>
    <div class="detail-box">
      <p><strong>Title:</strong> ${bill.title}</p>
      <p><strong>Amount Paid:</strong> ${inr(bill.amount)}</p>
      <p><strong>Paid on:</strong> ${new Date(bill.paidAt).toLocaleDateString("en-IN")}</p>
      ${bill.txRef ? `<p><strong>Transaction Ref:</strong> ${bill.txRef}</p>` : ""}
      ${bill.bankDetails?.upiId ? `<p><strong>Paid to UPI:</strong> ${bill.bankDetails.upiId}</p>` : ""}
      ${bill.bankDetails?.bankAccount ? `<p><strong>Bank Account:</strong> ****${bill.bankDetails.bankAccount.slice(-4)}</p>` : ""}
    </div>
    <p>Please check your bank account / UPI for the credited amount. Keep this email as your payment record.</p>
  `);
  return send({
    to:      employee.email,
    subject: `[BillTrack] Payment Done: ${bill.title} — ${inr(bill.amount)}`,
    html,
  });
};

// ── Internal send helper ──────────────────────────────────────────────────────
const send = async (options) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("📧 [EMAIL SKIPPED — no SMTP config]", options.subject);
    return;
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || "BillTrack <noreply@billtrack.app>",
      ...options,
    });
    console.log("📧 Email sent:", info.messageId);
  } catch (err) {
    // Don't crash the request if email fails — just log
    console.error("📧 Email error:", err.message);
  }
};

module.exports = {
  sendSubmittedEmail,
  sendApprovedEmail,
  sendRejectedEmail,
  sendPaidEmail,
};
