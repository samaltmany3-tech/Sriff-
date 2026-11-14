import { jsPDF } from "jspdf";
import fs from "fs";
import { fileURLToPath } from 'url';

async function testPdf() {
  const doc = new jsPDF();
  
  // Try to find a way to get Arabic working natively or with a simple fetch in node
  const fetch = (await import('node-fetch')).default;
  
  try {
    const res = await fetch('https://raw.githubusercontent.com/googlefonts/tajawal/main/fonts/ttf/Tajawal-Regular.ttf');
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    doc.addFileToVFS('Tajawal.ttf', base64);
    doc.addFont('Tajawal.ttf', 'Tajawal', 'normal');
    doc.setFont('Tajawal');
    
    // We will test if isRTL helps
    doc.text("مرحبا", 100, 20, { isRTL: true });
    
    fs.writeFileSync("test.pdf", Buffer.from(doc.output('arraybuffer')));
    console.log("Success");
  } catch (err) {
    console.error(err);
  }
}
testPdf();
