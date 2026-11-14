import { jsPDF } from "jspdf";
import fs from "fs";
import fetch from "node-fetch";

async function testPdf() {
  const doc = new jsPDF();
  
  const res = await fetch('https://raw.githubusercontent.com/googlefonts/cairo/main/fonts/ttf/Cairo-Regular.ttf');
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  doc.addFileToVFS('Cairo.ttf', base64);
  doc.addFont('Cairo.ttf', 'Cairo', 'normal');
  doc.setFont('Cairo');
  
  let text = "مرحبا";
  let shaped1 = doc.processArabic(text);
  doc.text(shaped1, 100, 20);

  fs.writeFileSync("test_cairo.pdf", Buffer.from(doc.output('arraybuffer')));
  console.log("Cairo Written");
}
testPdf();
