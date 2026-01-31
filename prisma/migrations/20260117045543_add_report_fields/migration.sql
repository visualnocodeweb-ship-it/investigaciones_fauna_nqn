/*
  Warnings:

  - Added the required column `animalType` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interventionType` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "animalType" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "interventionType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Report" ("createdAt", "description", "id", "latitude", "locationName", "longitude", "title") SELECT "createdAt", "description", "id", "latitude", "locationName", "longitude", "title" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
