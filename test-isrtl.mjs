import { jsPDF } from "jspdf";
const doc = new jsPDF();
try {
  doc.text("test", 10, 10, { isRTL: true });
  console.log("isRTL supported!");
} catch (e) {
  console.log("isRTL error:", e);
}
