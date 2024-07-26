'use client';

import { useEffect, useRef, useState } from 'react';

const PdfEditor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const canvasRef = useRef(null);
  const [text, setText] = useState('');

  const handleFileUpload = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = e => {
      const pdfArrayBuffer = e.target.result;
      const textContents = extractTextFromPDF(pdfArrayBuffer);

      console.log('Extracted Text:', textContents);
    };

    reader.readAsArrayBuffer(file);
  };

  // Function to clean up the extracted PDF text
  const cleanPDFText = pdfText => {
    // Remove PDF-specific tags and metadata
    // Example patterns (basic cleanup)
    pdfText = pdfText.replace(/%PDF-\d\.\d/g, ''); // Remove PDF version
    pdfText = pdfText.replace(/(\d{1,5} \d{1,5} R)/g, ''); // Remove object references
    pdfText = pdfText.replace(/(\d{1,5} \d{1,5} \d{1,5} obj[\s\S]*?endobj)/g, ''); // Remove objects
    pdfText = pdfText.replace(/(stream[\s\S]*?endstream)/g, ''); // Remove streams
    pdfText = pdfText.replace(/(\d{1,5} 0 R)/g, ''); // Remove cross-reference
    pdfText = pdfText.replace(/\/\w+/g, ''); // Remove PDF dictionary entries

    // Additional clean-up patterns can be added as needed

    return pdfText;
  };

  const extractTextFromPDF = pdfArrayBuffer => {
    let text = '';

    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(pdfArrayBuffer);
    // Convert Uint8Array to a string
    let pdfText = '';

    // Decode Uint8Array to a string
    // Assuming text is not encoded or compressed
    for (let i = 0; i < uint8Array.length; i++) {
      const charCode = uint8Array[i];

      // Simple ASCII character range check
      if (charCode >= 32 && charCode <= 126) {
        pdfText += String.fromCharCode(charCode);
      } else if (charCode === 10 || charCode === 13) {
        pdfText += '\n'; // Handle new lines
      }
    }

    text = cleanPDFText(pdfText);

    return text;
  };

  const parsePDF = pdfData => {
    const textContents = extractTextFromPDF(pdfData);

    return textContents;
  };

  useEffect(() => {
    if (pdfFile) {
      parsePDF(pdfFile);
    }
  }, [pdfFile]);

  const handleDownload = () => {
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.open();

    printWindow.document.write(`
      <html>
        <body>
          <pre>${text}</pre>
          <script>
            window.onload = function() {
              window.print(); // Open the print dialog
              window.onafterprint = () => window.close(); // Close the window after printing
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleAddText = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.font = '20px Arial';
    context.fillStyle = 'blue';
    context.fillText(text, 50, 150);
  };

  return (
    <div>
      <input type='file' accept='application/pdf' onChange={handleFileUpload} />
      <div>
        <canvas ref={canvasRef} width={600} height={800}></canvas>
        <input type='text' value={text} onChange={e => setText(e.target.value)} placeholder='Enter text to add' />
        <button onClick={handleAddText}>Add Text</button>
        <button onClick={handleDownload}>Download Edited PDF</button>
      </div>
    </div>
  );
};

export default PdfEditor;
