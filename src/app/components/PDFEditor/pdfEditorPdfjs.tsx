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
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfBytes = await pdfDoc.save();
      const editedPdfFile = new Blob([pdfBytes], { type: 'application/pdf' });

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
      const url = URL.createObjectURL(editedFile);
      const a = document.createElement('a');

      a.href = url;
      a.download = 'edited.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  async function extractTextAxis(pdfData: ArrayBuffer, findText: string) {
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    const textPositions: PositionData[] = [];

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
          const fontSize = item.transform[0]; // Get current font size
          const color = item.color ? item.color : rgb(0, 0, 0); // Get available color

          textPositions.push({ pageIndex, x, y, width, height, fontSize, color, str: item.str });
        }
      });
    }

    return textPositions;
  }

  async function findAndReplaceText() {
    if (editedFile && findText && replaceText) {
      const arrayBuffer = await editedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const textPositions = await extractTextAxis(arrayBuffer, findText);

      const pages = pdfDoc.getPages();

      textPositions.forEach(({ pageIndex, x, y, width, height, color, fontSize, str }) => {
        const page = pages[pageIndex];

        // Cover existing text with white bf
        page.drawRectangle({
          x: x,
          y: page.getHeight() - y, // 840 height of canvas
          width,
          height: height,
          color: rgb(1, 1, 1),
          borderColor: rgb(1, 1, 1),
        });

        // Rewrite existing ext with replaced word
        page.drawText(str.replace(findText, replaceText), {
          x: x,
          y: page.getHeight() - y,
          size: fontSize,
          color: color,
        });
      });

      const pdfBytes = await pdfDoc.save();
      const editedPdfFile = new Blob([pdfBytes], { type: 'application/pdf' });

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
