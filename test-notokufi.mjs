import { jsPDF } from "jspdf";
import fs from "fs";
import fetch from "node-fetch";

async function testPdf() {
  const doc = new jsPDF();
  
  const res = await fetch('https://raw.githubusercontent.com/googlefonts/noto-fonts/main/unhinted/ttf/NotoKufiArabic/NotoKufiArabic-Regular.ttf');
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  doc.addFileToVFS('NotoKufi.ttf', base64);
  doc.addFont('NotoKufi.ttf', 'NotoKufi', 'normal');
  doc.setFont('NotoKufi');
  
  let text = "مرحبا";
  let shaped1 = doc.processArabic(text);
  doc.text(shaped1, 100, 20);

  fs.writeFileSync("test_notokufi.pdf", Buffer.from(doc.output('arraybuffer')));
  console.log("NotoKufi Written");
}
testPdf();
