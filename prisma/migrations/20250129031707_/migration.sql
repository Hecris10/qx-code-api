/*
  Warnings:

  - You are about to drop the column `qrCodeBorderRadius` on the `QRCode` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QRCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "text" TEXT,
    "ssid" TEXT,
    "password" TEXT,
    "link" TEXT,
    "logoId" INTEGER,
    "userId" INTEGER NOT NULL,
    "backgroundColor" TEXT DEFAULT '#ffffff',
    "padding" REAL,
    "logoBackgroundColor" TEXT DEFAULT '#00000000',
    "logoPadding" REAL,
    "logoBorderRadius" REAL,
    "cornerType" TEXT DEFAULT 'square',
    "dotsType" TEXT DEFAULT 'square',
    "cornersColor" TEXT DEFAULT '#000000',
    "nodesColor" TEXT DEFAULT '#000000',
    CONSTRAINT "QRCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QRCode_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "LogoImage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_QRCode" ("backgroundColor", "content", "createdAt", "id", "link", "logoBackgroundColor", "logoBorderRadius", "logoId", "logoPadding", "name", "padding", "password", "ssid", "text", "type", "updatedAt", "userId") SELECT "backgroundColor", "content", "createdAt", "id", "link", "logoBackgroundColor", "logoBorderRadius", "logoId", "logoPadding", "name", "padding", "password", "ssid", "text", "type", "updatedAt", "userId" FROM "QRCode";
DROP TABLE "QRCode";
ALTER TABLE "new_QRCode" RENAME TO "QRCode";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
