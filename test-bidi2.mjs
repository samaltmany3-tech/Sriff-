import { jsPDF } from "jspdf";

const doc = new jsPDF();
function formatRTLText(text, doc) {
  if (!text) return '';
  const shaped = doc.processArabic(text.toString());
  
  let reversed = shaped.split('').reverse().join('');
  
  // Re-reverse English + Numbers
  reversed = reversed.replace(/[\w\d]+(?:[ \-,./:]+[\w\d]+)*/g, match => {
    return match.split('').reverse().join('');
  });
  
  reversed = reversed.replace(/[()]/g, m => m === '(' ? ')' : '(');

  return reversed;
}

const tests = [
  "المبلغ 1,500.50 ريال",
  "المبلغ 1500 ريال",
  "Test 123",
  "Ahmed 123 علي",
  "123"
];

for (const t of tests) {
  console.log("In: ", t);
  console.log("Out:", formatRTLText(t, doc));
  console.log("---");
}
