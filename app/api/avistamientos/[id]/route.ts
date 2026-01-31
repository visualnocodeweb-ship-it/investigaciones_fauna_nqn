import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = parseInt(params.id, 10);
    if (isNaN(reportId)) {
      return NextResponse.json({ error: 'ID de reporte inválido' }, { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        images: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error al obtener el reporte:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
