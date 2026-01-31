import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seeding...');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, 'animales_sueltos.csv');
  console.log(`Leyendo archivo desde: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error('Error: El archivo CSV no se encuentra en la ruta especificada.');
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Usamos una Promise para poder esperar a que PapaParse termine en un script asíncrono
  const parsingComplete = new Promise<void>((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          console.log(`Se encontraron ${results.data.length} registros en el CSV.`);
        
          await prisma.animalSuelto.deleteMany({});
          console.log('Tabla de animales sueltos limpiada.');

          let count = 0;
          for (const row of results.data as any[]) {
            const lat = parseFloat(String(row.Latitud).replace(',', '.'));
            const lng = parseFloat(String(row.Longitud).replace(',', '.'));
            const ano = parseInt(row.Año, 10);

            if (!isNaN(lat) && !isNaN(lng) && !isNaN(ano)) {
              try {
                await prisma.animalSuelto.create({
                  data: {
                    ano: ano,
                    tipoDeAnimal: row['Tipo de animal'] || '',
                    region: row.REGION || '',
                    latitud: lat,
                    longitud: lng,
                    tipoDeIntervencion: row['TIPO DE INTERVENCION'] || '',
                  },
                });
                count++;
              } catch (e) {
                console.error(`Error insertando la fila: ${JSON.stringify(row)}`, e);
              }
            } else {
              console.warn(`Fila omitida por datos inválidos: ${JSON.stringify(row)}`);
            }
          }
          console.log(`Seeding finalizado. Se insertaron ${count} registros.`);
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      error: (error: any) => {
        console.error('Error al parsear el archivo CSV:', error);
        reject(error);
      }
    });
  });

  await parsingComplete;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
