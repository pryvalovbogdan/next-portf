'use client';

import { PDFDocument, rgb } from 'pdf-lib';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

type PDFFile = string | File | null;

export default function Sample() {
  const [file, setFile] = useState<PDFFile>(null);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page
  const [editedFile, setEditedFile] = useState<Blob | null>(null);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = event.target;

    const nextFile = files?.[0];

    if (nextFile) {
      setFile(nextFile);

      const arrayBuffer = await nextFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Example: Add text to the first page
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      firstPage.drawText('Hello, world!', {
        x: 50,
        y: 750,
        size: 30,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const editedPdfFile = new Blob([pdfBytes], { type: 'application/pdf' });

      console.log('URL.createObjectURL(editedPdfFile)', URL.createObjectURL(editedPdfFile));
      setFile(nextFile);
      setEditedFile(editedPdfFile);
    }
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
    setPageNumber(1);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function downloadEditedFile() {
    if (editedFile) {
      const url = URL.createObjectURL(editedFile);
      const a = document.createElement('a');

      a.href = url;
      a.download = 'edited.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up the object URL
    }
  }

  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');

  async function extractTextPositions(pdfData: ArrayBuffer, findText: string) {
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    const positions: { pageIndex: number; x: number; y: number; width: number; height: number }[] = [];

    for (let pageIndex = 0; pageIndex < pdf.numPages; pageIndex++) {
      const page = await pdf.getPage(pageIndex + 1);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1 });

      textContent.items.forEach((item: any) => {
        if (item.str.includes(findText)) {
          const transform = pdfjs.Util.transform(
            pdfjs.Util.transform(viewport.transform, item.transform),
            [1, 0, 0, -1, 0, 0],
          );
          const x = transform[4];
          const y = transform[5];
          const width = item.width;
          const height = item.height;

          positions.push({ pageIndex, x, y, width, height });
        }
      });
    }

    return positions;
  }

  async function findAndReplaceText() {
    if (editedFile && findText && replaceText) {
      const arrayBuffer = await editedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const textPositions = await extractTextPositions(arrayBuffer, findText);

      console.log('textPositions', textPositions);
      const pages = pdfDoc.getPages();

      textPositions.forEach(({ pageIndex, x, y, width, height }) => {
        const page = pages[pageIndex];

        // Overlay white rectangle to cover existing text
        page.drawRectangle({
          x,
          y,
          width,
          height,
          color: rgb(1, 1, 1),
          borderColor: rgb(1, 1, 1),
        });

        // Add the new text at the same position
        page.drawText(replaceText, {
          x,
          y,
          size: 12,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const editedPdfFile = new Blob([pdfBytes], { type: 'application/pdf' });

      setEditedFile(URL.createObjectURL(editedPdfFile));
      setEditedFile(editedPdfFile);
    }
  }

  return (
    <div className='Example'>
      <header>
        <h1>react-pdf sample page</h1>
      </header>
      <div className='Example__container'>
        <div className='Example__container__load'>
          <label htmlFor='file'>Load from file:</label> <input onChange={onFileChange} type='file' />
        </div>
        <div className='Example__container__document'>
          {/*<Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>*/}
          {/*  <Page pageNumber={pageNumber} />*/}
          {/*</Document>*/}
          {editedFile && (
            <Document file={editedFile} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
          )}
          <div>
            <p>
              Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
            </p>
            <button type='button' disabled={pageNumber <= 1} onClick={previousPage}>
              Previous
            </button>
            <button type='button' disabled={pageNumber >= numPages} onClick={nextPage}>
              Next
            </button>
            {editedFile && (
              <button type='button' onClick={downloadEditedFile}>
                Download Edited PDF
              </button>
            )}
            <div>
              <input type='text' placeholder='Find text' value={findText} onChange={e => setFindText(e.target.value)} />
              <input
                type='text'
                placeholder='Replace with'
                value={replaceText}
                onChange={e => setReplaceText(e.target.value)}
              />
              <button onClick={findAndReplaceText}>Find and Replace Text</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
