import { jsPDF } from "jspdf";
import fs from "fs";

async function testPdf() {
  const doc = new jsPDF();
  const fetch = (await import('node-fetch')).default;
  
  // Try using Amiri which is known to work with jsPDF processArabic
  const res = await fetch('https://raw.githubusercontent.com/aliftype/amiri/master/fonts/Amiri-Regular.ttf');
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  doc.addFileToVFS('Amiri.ttf', base64);
  doc.addFont('Amiri.ttf', 'Amiri', 'normal');
  doc.setFont('Amiri');
  
  let text = "مرحبا بالمستخدم في تقرير";
  
  // Test 1: Just the text text
  doc.text(text, 100, 20);
  
  // Test 2: processArabic
  let shaped1 = doc.processArabic(text);
  doc.text(shaped1, 100, 30);
  
  // Test 3: processArabic + reverse
  let shaped2 = shaped1.split('').reverse().join('');
  doc.text(shaped2, 100, 40);

  // Test 4: Tajawal
  const resT = await fetch('https://raw.githubusercontent.com/googlefonts/tajawal/main/fonts/ttf/Tajawal-Regular.ttf');
  const bufferT = await resT.arrayBuffer();
  const base64T = Buffer.from(bufferT).toString('base64');
  doc.addFileToVFS('Tajawal.ttf', base64T);
  doc.addFont('Tajawal.ttf', 'Tajawal', 'normal');
  doc.setFont('Tajawal');
  
  doc.text(shaped2, 100, 50);

  fs.writeFileSync("test_fonts.pdf", Buffer.from(doc.output('arraybuffer')));
  console.log("Written");
}
testPdf();
