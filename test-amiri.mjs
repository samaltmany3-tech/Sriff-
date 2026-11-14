import { jsPDF } from "jspdf";
import fs from "fs";
import fetch from "node-fetch";

async function testPdf() {
  const doc = new jsPDF();
  
  const res = await fetch('https://raw.githubusercontent.com/aliftype/amiri/master/fonts/Amiri-Regular.ttf');
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  doc.addFileToVFS('Amiri.ttf', base64);
  doc.addFont('Amiri.ttf', 'Amiri', 'normal');
  doc.setFont('Amiri');
  
  let text = "مرحبا بالمستخدم في البرنامج";
  let shaped1 = doc.processArabic(text);
  doc.text(shaped1, 100, 20);

  fs.writeFileSync("test_amiri.pdf", Buffer.from(doc.output('arraybuffer')));
  console.log("Amiri Written");
}
testPdf();
