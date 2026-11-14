import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";

function formatRTLText(text, doc) {
  if (!text) return '';
  const shaped = doc.processArabic(text.toString());
  let reversed = shaped.split('').reverse().join('');
  reversed = reversed.replace(/[\w\d]+(?:[ \-,./:]+[\w\d]+)*/g, match => match.split('').reverse().join(''));
  reversed = reversed.replace(/[()]/g, m => m === '(' ? ')' : '(');
  return reversed;
}

async function testPdf() {
  const doc = new jsPDF();
  const fetch = (await import('node-fetch')).default;
  
  const res = await fetch('https://raw.githubusercontent.com/googlefonts/tajawal/main/fonts/ttf/Tajawal-Regular.ttf');
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  doc.addFileToVFS('Tajawal.ttf', base64);
  doc.addFont('Tajawal.ttf', 'Tajawal', 'normal');
  doc.setFont('Tajawal');
  
  autoTable(doc, {
    startY: 20,
    head: [['الملاحظات', 'المبلغ']],
    body: [
      ['هذا السطر الأول به 1500 ريال', '1500'],
      ['تجربة ثانية', '3000'],
      ['SRF-456', '500']
    ],
    styles: { font: 'Tajawal', halign: 'right' },
    didParseCell: function(data) {
        // we can change data.cell.text
        if (data.cell.text && Array.isArray(data.cell.text)) {
            data.cell.text = data.cell.text.map(t => formatRTLText(t, doc));
        }
    }
  });

  fs.writeFileSync("test3.pdf", Buffer.from(doc.output('arraybuffer')));
  console.log("Written");
}
testPdf();
