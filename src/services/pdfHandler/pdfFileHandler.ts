import PDFParser, { Output } from "pdf2json";

export const pdfFileHandler = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const pdfParser = new PDFParser();

  const parsePdf = (): Promise<Output> => {
    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData) =>
        reject(errData.parserError)
      );
      pdfParser.on("pdfParser_dataReady", (pdfData) => resolve(pdfData));
      pdfParser.parseBuffer(buffer);
    });
  };

  const pdfData = await parsePdf();
  let fullText = "";

  pdfData.Pages.forEach((page) => {
    page.Texts.forEach((textObj) => {
      textObj.R.forEach((item) => {
        fullText += decodeURIComponent(item.T) + " ";
      });
    });
    fullText += "\n";
  });

  return fullText;
};
