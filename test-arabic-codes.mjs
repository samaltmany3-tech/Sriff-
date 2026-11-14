import { jsPDF } from "jspdf";

const doc = new jsPDF();
const text = "مرحبا";
const shaped = doc.processArabic(text);

console.log("Original Char 0:", text.charCodeAt(0).toString(16), text[0]);
console.log("Shaped Char 0:", shaped.charCodeAt(0).toString(16), shaped[0]);
console.log("Shaped Char Last:", shaped.charCodeAt(shaped.length - 1).toString(16), shaped[shaped.length - 1]);
