import fetch from "node-fetch";

async function testPdf() {
  const res = await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/amiri/Amiri-Bold.ttf');
  console.log(res.status);
}
testPdf();
