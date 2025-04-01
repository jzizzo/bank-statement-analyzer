import { NextResponse } from 'next/server';
import { processPDFText } from '@/lib/utils/pdf-utils';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert the file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process the PDF
    const result = await processPDFText(buffer);
    
    // Check if there was an API quota error
    if (result.metadata.error === 'API quota exceeded') {
      return NextResponse.json(
        { 
          error: 'API quota exceeded. Please try again later or contact support.',
          result 
        },
        { status: 429 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}
