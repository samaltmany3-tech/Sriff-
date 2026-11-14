import { jsPDF } from "jspdf";
import fs from "fs";

async function testPdf() {
  const doc = new jsPDF();
  const fetch = (await import('node-fetch')).default;
  
  const res = await fetch('https://raw.githubusercontent.com/googlefonts/tajawal/main/fonts/ttf/Tajawal-Regular.ttf');
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  doc.addFileToVFS('Tajawal.ttf', base64);
  doc.addFont('Tajawal.ttf', 'Tajawal', 'normal');
  doc.setFont('Tajawal');
  
  let text = "مرحبا بكم في التطبيق";
  
  // Option 1: Just shape, maybe jsPDF handles RTL magically?
  let shaped1 = doc.processArabic(text);
  doc.text(shaped1, 100, 20);
  
  // Option 2: reverse shaped String
  let shaped2 = shaped1.split('').reverse().join('');
  doc.text(shaped2, 100, 30);

  // Option 3: what if we just split words, reverse words, then reverse letters?
  function reverseRTL(str) {
      if (!str) return str;
      let shaped = doc.processArabic(str);
      // reverse it
      return shaped.split('').reverse().join('');
  }
  
  doc.text(reverseRTL("فاتورة رقم 123"), 100, 40);

  fs.writeFileSync("test2.pdf", Buffer.from(doc.output('arraybuffer')));
  console.log("Written");
}
testPdf();
