import {ApiError,database,failure,isUuid,json,pageOffset,readBody,requireAdmin,requireOrigin} from '../../../lib/server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{
 requireAdmin(req);const sql=database();
 const rows=await sql.query(`SELECT id,recipient,message,sender,status,created_at FROM cards
 WHERE public_opt_in AND status IN ('pending','approved')
 ORDER BY created_at DESC,id DESC LIMIT 26 OFFSET $1`,[pageOffset(req)]);
 return json({cards:rows.slice(0,25),hasMore:rows.length>25});
}catch(e){return failure(e)}}
export async function POST(req:Request){try{
 requireOrigin(req);requireAdmin(req);const v=await readBody(req,1000) as {id?:unknown;status?:unknown};
 if(!v||!isUuid(v.id)||!['approved','rejected'].includes(v.status as string))throw new ApiError('Yêu cầu không hợp lệ.');
 const sql=database(),rows=await sql.query(`UPDATE cards SET status=$1 WHERE id=$2 AND public_opt_in
 AND status IN ('pending','approved') RETURNING id`,[v.status,v.id]);
 if(!rows.length)throw new ApiError('Không tìm thấy lời chúc cần duyệt.',404);
 return json({ok:true});
}catch(e){return failure(e)}}
