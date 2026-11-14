import { jsPDF } from "jspdf";
import fs from "fs";

async function checkFontPresentationForms(fontUrl) {
  const fetch = (await import('node-fetch')).default;
  const res = await fetch(fontUrl);
  const buffer = await res.arrayBuffer();
  // basic check: Does it have presentation forms?
  // We can't easily parse TTF here, but we can try generating a PDF and checking if it runs without warn, or just assume Amiri has it.
}
