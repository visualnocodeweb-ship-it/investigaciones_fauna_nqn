-- CreateTable
CREATE TABLE "AnimalSuelto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano" INTEGER NOT NULL,
    "tipoDeAnimal" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "latitud" REAL NOT NULL,
    "longitud" REAL NOT NULL,
    "tipoDeIntervencion" TEXT NOT NULL
);
