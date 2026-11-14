import { jsPDF } from "jspdf";

const doc = new jsPDF();
function formatRTLText(text, doc) {
  if (!text) return '';
  const shaped = doc.processArabic(text.toString());
  
  // 1. Reverse entire line
  let reversed = shaped.split('').reverse().join('');
  
  // 2. Re-reverse English + Numbers + their spaces and punctuation.
  // Regex to match a sequence of LTR characters.
  // Let's include basic LTR characters like [a-zA-Z0-9] and some punctuation [-,./:] 
  // ONLY if they are surrounded by LTR characters.
  reversed = reversed.replace(/[\w\d]+(?:[ \-,./:]+[\w\d]+)*/g, match => {
    return match.split('').reverse().join('');
  });
  
  // 3. Swap parentheses since reversing the line visually placed the Open Parenthesis on the right, 
  // but it visually looks like an open parenthesis facing left, which is wrong.
  reversed = reversed.replace(/[()]/g, m => m === '(' ? ')' : '(');

  return reversed;
}

const tests = [
  "مرحبا بالمستخدم",
  "فاتورة رقم 1234",
  "SRF-456",
  "تم استخراجه بواسطة تطبيق صرف",
  "التاريخ: 2026-04-17"
];

for (const t of tests) {
  console.log("In: ", t);
  console.log("Out:", formatRTLText(t, doc));
  console.log("---");
}
