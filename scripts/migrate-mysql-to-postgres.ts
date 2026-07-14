import "dotenv/config";
import mysql from "mysql2/promise";
import { PrismaClient } from "../lib/generated/prisma";

// Kaynak MySQL baglantisi. Prod icin calistirirken MYSQL_SOURCE_URL env'ini
// production mysql connection string'i ile override edin.
const MYSQL_SOURCE_URL =
  process.env.MYSQL_SOURCE_URL ||
  "mysql://root:Ceycey.123@localhost:3306/modaperde";

const prisma = new PrismaClient();

// FK bagimliliklarina gore sirali: once bagimsiz tablolar, sonra bagimlilar
const TABLES: { mysqlTable: string; model: keyof PrismaClient; pgTable: string }[] = [
  { mysqlTable: "user", model: "user", pgTable: "user" },
  { mysqlTable: "category", model: "category", pgTable: "category" },
  { mysqlTable: "sub_category", model: "subCategory", pgTable: "sub_category" },
  { mysqlTable: "room", model: "room", pgTable: "Room" },
  { mysqlTable: "product", model: "product", pgTable: "product" },
  { mysqlTable: "review", model: "review", pgTable: "review" },
  { mysqlTable: "favorite", model: "favorite", pgTable: "favorite" },
  { mysqlTable: "cartitem", model: "cartItem", pgTable: "cartitem" },
  { mysqlTable: "address", model: "address", pgTable: "address" },
  { mysqlTable: "order", model: "order", pgTable: "order" },
  { mysqlTable: "orderitem", model: "orderItem", pgTable: "orderitem" },
  { mysqlTable: "orderaddress", model: "orderAddress", pgTable: "orderaddress" },
  { mysqlTable: "blog", model: "blog", pgTable: "blog" },
  { mysqlTable: "subscribe", model: "subscribe", pgTable: "subscribe" },
  { mysqlTable: "banner", model: "banner", pgTable: "Banner" },
];

async function resetSequence(pgTable: string) {
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"${pgTable}"', 'id'), COALESCE((SELECT MAX(id) FROM "${pgTable}"), 1), (SELECT MAX(id) IS NOT NULL FROM "${pgTable}"))`
  );
}

async function main() {
  const conn = await mysql.createConnection(MYSQL_SOURCE_URL);

  const report: { table: string; source: number; migrated: number }[] = [];

  for (const { mysqlTable, model, pgTable } of TABLES) {
    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT * FROM \`${mysqlTable}\``
    );

    if (rows.length > 0) {
      // @ts-expect-error - dinamik model erisimi
      await prisma[model].createMany({ data: rows });
      await resetSequence(pgTable);
    }

    // @ts-expect-error - dinamik model erisimi
    const migratedCount = await prisma[model].count();
    report.push({ table: mysqlTable, source: rows.length, migrated: migratedCount });
  }

  await conn.end();
  await prisma.$disconnect();

  console.log("\nTablo".padEnd(16), "MySQL".padStart(8), "Postgres".padStart(10));
  let allOk = true;
  for (const r of report) {
    const ok = r.source === r.migrated;
    if (!ok) allOk = false;
    console.log(
      r.table.padEnd(16),
      String(r.source).padStart(8),
      String(r.migrated).padStart(10),
      ok ? "OK" : "!! MISMATCH"
    );
  }

  if (!allOk) {
    console.error("\nSatir sayilari eslesmiyor, migration'i incele.");
    process.exit(1);
  }
  console.log("\nTum tablolar eslesti, veri gocu basarili.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
