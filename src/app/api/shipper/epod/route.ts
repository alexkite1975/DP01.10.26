export const dynamic = 'force-dynamic';
export async function POST(r:Request){const b=await r.json();return Response.json({status:'DELIVERED',epodSigned:true,signer:b.name||'Warehouse Manager'})}
