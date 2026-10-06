import { NextResponse } from "next/server";
import { Pool } from "pg";

// Initialize Postgres Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { vehicleId, driverId, items, signatureHash } = body;

    // 1. Basic validation
    if (!vehicleId || !driverId || !items || !signatureHash) {
      return NextResponse.json(
        { error: "Missing mandatory fields (vehicleId, driverId, items, signatureHash)." },
        { status: 400 }
      );
    }

    // 2. Determine if the overall inspection passed
    // If any item failed (is_passed === false), the inspection fails, and the vehicle is VOR.
    const anyFailures = items.some((item: any) => item.isPassed === false);
    const inspectionStatus = anyFailures ? "FAILED" : "PASSED";

    // Start database transaction
    await client.query("BEGIN");

    // 3. Insert into inspections master table
    const inspectionQuery = `
      INSERT INTO inspections (vehicle_id, driver_id, status, digital_signature_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const inspectionResult = await client.query(inspectionQuery, [
      vehicleId,
      driverId,
      inspectionStatus,
      signatureHash,
    ]);
    const inspectionId = inspectionResult.rows[0].id;

    // 4. Insert each individual line item
    const itemQuery = `
      INSERT INTO inspection_items (inspection_id, item_name, is_passed, defect_description, defect_image_url, ai_confidence_score)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;

    for (const item of items) {
      await client.query(itemQuery, [
        inspectionId,
        item.itemName,
        item.isPassed,
        item.defectDescription || null,
        item.defectImageUrl || null,
        item.aiConfidenceScore || null,
      ]);
    }

    // 5. Update vehicle status if failed (Ground the vehicle - Vehicle Off Road)
    if (inspectionStatus === "FAILED") {
      await client.query(
        "UPDATE vehicles SET status = 'VOR' WHERE id = $1;",
        [vehicleId]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      inspectionId,
      status: inspectionStatus,
      grounded: inspectionStatus === "FAILED"
    }, { status: 201 });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Database transaction error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error during transaction.", detail: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
