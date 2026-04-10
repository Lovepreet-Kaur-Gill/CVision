import PDFParser from "pdf2json";

export async function extractTextFromPDF(buffer) {
  const pdfParser = new PDFParser(null, 1);

  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error("PDF2JSON Error:", errData.parserError);
      reject(new Error("Failed to parse PDF"));
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const rawText = pdfParser.getRawTextContent();
      const cleanText = rawText.replace(/----------------Page \(\d+\) Break----------------/g, "");
      resolve(cleanText);
    });

    pdfParser.parseBuffer(buffer);
  });
}