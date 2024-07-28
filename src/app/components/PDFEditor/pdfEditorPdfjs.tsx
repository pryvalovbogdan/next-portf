'use client';

import { PDFDocument, rgb } from 'pdf-lib';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { ChangeEvent, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { PositionData } from './types';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const PdfEditor = () => {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [editedFile, setEditedFile] = useState<Blob | null>(null);
  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');

  async function onFileChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const { files } = event.target;

    const file = files?.[0];

    if (file) {
      // Convert uploaded file to an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      // Load the PDF document from the ArrayBuffer
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      // Save the loaded PDF document back to bytes
      const pdfBytes = await pdfDoc.save();
      // Create a Blob from the saved PDF bytes
      const editedPdfFile = new Blob([pdfBytes], { type: 'application/pdf' });

      // Set the edited file state to the newly created Blob
      setEditedFile(editedPdfFile);
    }
  }

  const onDocumentLoaded = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
    setNumPages(nextNumPages);
    setCurrentPage(1);
  };

  const setPreviousPage = () => {
    changeCurrentPage(-1);
  };

  const setNextPage = () => {
    changeCurrentPage(1);
  };

  const changeCurrentPage = (offset: number) => {
    setCurrentPage(prevPageNumber => prevPageNumber + offset);
  };

  function downloadEditedFile() {
    if (editedFile) {
      // Create a URL for the edited file Blob
      const url = URL.createObjectURL(editedFile);
      // Create a temporary anchor element
      const a = document.createElement('a');

      // Set the href and download attributes of the anchor element
      a.href = url;
      a.download = 'edited.pdf';
      // Append the anchor to the document body and click it to trigger the download
      document.body.appendChild(a);
      a.click();
      // Remove the anchor from the document body and revoke the object URL
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  // Function to extract the positions of text in the PDF
  async function extractTextAxis(pdfData: ArrayBuffer, findText: string) {
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    const textPositions: PositionData[] = [];

    // Iterate through each page in the PDF
    for (let pageIndex = 0; pageIndex < pdf.numPages; pageIndex++) {
      const page = await pdf.getPage(pageIndex + 1);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1 });

      // Iterate through each text item on the page
      textContent.items.forEach((item: any) => {
        if (item.str.includes(findText)) {
          // Calculate the position and transformation of the text item
          const transform = pdfjs.Util.transform(
            pdfjs.Util.transform(viewport.transform, item.transform),
            [1, 0, 0, -1, 0, 0],
          );

          const x = transform[4];
          const y = transform[5];
          const width = item.width;
          const height = item.height;
          const fontSize = item.transform[0]; // Get current font size
          const color = item.color ? item.color : rgb(0, 0, 0); // Get available color

          // Add the text position data to the array
          textPositions.push({ pageIndex, x, y, width, height, fontSize, color, str: item.str });
        }
      });
    }

    return textPositions;
  }

  // Function to find and replace text in the PDF
  async function findAndReplaceText() {
    if (editedFile && findText && replaceText) {
      // Convert the edited file to an ArrayBuffer
      const arrayBuffer = await editedFile.arrayBuffer();
      // Load the PDF document from the ArrayBuffer
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      // Extract text positions from the PDF
      const textPositions = await extractTextAxis(arrayBuffer, findText);

      const pages = pdfDoc.getPages();

      // Iterate through each text position
      textPositions.forEach(({ pageIndex, x, y, width, height, color, fontSize, str }) => {
        const page = pages[pageIndex];

        // Cover existing text with a white rectangle
        page.drawRectangle({
          x: x,
          y: page.getHeight() - y, // Adjust y-coordinate for PDF coordinate system
          width,
          height: height,
          color: rgb(1, 1, 1),
          borderColor: rgb(1, 1, 1),
        });

        // Rewrite existing text with the replaced word
        page.drawText(str.replace(findText, replaceText), {
          x: x,
          y: page.getHeight() - y,
          size: fontSize,
          color: color,
        });
      });

      // Save the modified PDF document
      const pdfBytes = await pdfDoc.save();
      const editedPdfFile = new Blob([pdfBytes], { type: 'application/pdf' });

      // Set the edited file state to the newly created Blob
      setEditedFile(editedPdfFile);
    }
  }

  return (
    <div className='relative'>
      <header>
        <h1>Edit your PDF</h1>
      </header>
      <div>
        <div className='flex justify-center items-center gap-2'>
          <label htmlFor='file'>Load file:</label> <input onChange={onFileChange} type='file' />
        </div>
        {editedFile && (
          <>
            <Document file={editedFile} onLoadSuccess={onDocumentLoaded}>
              <Page pageNumber={currentPage} />
            </Document>
            <div>
              <p className='mt-2'>
                Page {currentPage || (numPages ? 1 : '--')} of {numPages || '--'}
              </p>
              <div className='flex justify-center items-center flex-col'>
                <div>
                  <button type='button' disabled={currentPage <= 1} onClick={setPreviousPage}>
                    Previous
                  </button>
                  <button type='button' disabled={numPages ? currentPage >= numPages : false} onClick={setNextPage}>
                    Next
                  </button>
                </div>
                {editedFile && (
                  <button type='button' onClick={downloadEditedFile}>
                    Download PDF
                  </button>
                )}
              </div>
              <div className='absolute flex justify-center flex-col items-center left-14 top-32 bg-slate-400'>
                <input
                  type='text'
                  className='bg-slate-100 text-black placeholder-blue-700 p-2 border-amber-950 border-2 border-sky mb-0.5'
                  placeholder='Find text'
                  value={findText}
                  onChange={e => setFindText(e.target.value)}
                />
                <input
                  type='text'
                  placeholder='Replace with'
                  value={replaceText}
                  className='bg-slate-100 text-black placeholder-blue-700 p-2 border-amber-950 border-2 border-sky'
                  onChange={e => setReplaceText(e.target.value)}
                />
                <button onClick={findAndReplaceText}>Find and Replace Text</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfEditor;
