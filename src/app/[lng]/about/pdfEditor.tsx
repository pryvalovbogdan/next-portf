'use client';

import { useRef, useState } from 'react';

const PdfEditor = () => {
  const [pdfFile, setPdfFile] = useState<any>(null);
  const canvasRef = useRef(null);
  const [text, setText] = useState('');

  const handleFileUpload = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = e => {
      const pdfArrayBuffer = e.target.result;

      const dec = new TextDecoder().decode(new Uint8Array(e.target.result));

      setPdfFile(pdfArrayBuffer);
      setText(extractTextFromPDF(pdfArrayBuffer));
    };

    reader.readAsArrayBuffer(file);
  };

  async function binaryStringToByteArray(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  }

  async function inflateByteArray(byteArray) {
    // Create a blob from the byte array
    const blob = new Blob([byteArray]);

    // Create a stream from the blob
    const readableStream = blob.stream();

    // Create a decompression stream
    const decompressionStream = new DecompressionStream('deflate-raw');

    // Pipe the readable stream through the decompression stream
    const decompressedStream = readableStream.pipeThrough(decompressionStream);

    // Create a new Response object to get the decompressed content
    const response = new Response(decompressedStream);

    let decompressedText = '';

    try {
      // Extract the text content
      decompressedText = await response.text();
    } catch (e) {
      console.log('error', e);
    }

    return decompressedText;
  }

  // Function to clean up the extracted PDF text
  const cleanPDFText = pdfText => {
    // Decode streams
    const streams = pdfText.match(/(stream[\s\S]*?endstream)/g);

    if (streams) {
      streams.forEach(async stream => {
        const byteArray = await binaryStringToByteArray(stream);
        const decompressedText = await inflateByteArray(byteArray);

        console.log('decompressedText', decompressedText, byteArray);

        return decompressedText;
      });
    }

    console.log('pdfText', pdfText, pdfText.match(/(Title \([\s\S]*?\/)/g));
    const titlePdf = pdfText.match(/(Title \([\s\S]*?\/)/g);

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

      // Simple ASCII character range check https://www.ascii-code.com/characters/A-Z
      if (charCode >= 32 && charCode <= 126) {
        pdfText += String.fromCharCode(charCode);
      } else if (charCode === 10 || charCode === 13) {
        pdfText += '\n'; // Handle new lines
      }
    }

    text = cleanPDFText(pdfText);

    return text;
  };

  const handleDownload = () => {
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.open();

    printWindow.document.write(`
      <html>
        <body>
          <head>
              <title>${text}</title>
          </head>
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
