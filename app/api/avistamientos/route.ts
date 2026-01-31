import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';


export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error al obtener los reportes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const locationName = data.get('locationName') as string;
    const latitude = parseFloat(data.get('latitude') as string);
    const longitude = parseFloat(data.get('longitude') as string);
    const images = data.getAll('images') as File[];

    if (!title || !locationName || !latitude || !longitude || images.length === 0) {
      return NextResponse.json({ error: 'Faltan datos en el formulario' }, { status: 400 });
    }

    const imageDatas: { data: string }[] = [];

    for (const image of images) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${image.type};base64,${base64Data}`;
      imageDatas.push({ data: dataUri });
    }

    const newReport = await prisma.report.create({
      data: {
        title,
        description,
        locationName,
        latitude,
        longitude,
        images: {
          create: imageDatas,
        },
      },
      include: {
        images: true, // Include the created images in the response
      }
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error('Error al crear el reporte:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: 'Error interno del servidor', details: errorMessage }, { status: 500 });
  }
}