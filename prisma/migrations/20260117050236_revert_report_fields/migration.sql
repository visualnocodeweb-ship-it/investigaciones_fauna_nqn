/*
  Warnings:

  - You are about to drop the column `animalType` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `interventionType` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Report` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "locationName" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Report" ("createdAt", "description", "id", "latitude", "locationName", "longitude", "title") SELECT "createdAt", "description", "id", "latitude", "locationName", "longitude", "title" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
