-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ErrorLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "statusCode" INTEGER,
    "message" TEXT,
    "userId" INTEGER,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" TEXT,
    "method" TEXT
);
INSERT INTO "new_ErrorLog" ("id", "message", "method", "path", "statusCode", "timestamp", "userId") SELECT "id", "message", "method", "path", "statusCode", "timestamp", "userId" FROM "ErrorLog";
DROP TABLE "ErrorLog";
ALTER TABLE "new_ErrorLog" RENAME TO "ErrorLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
