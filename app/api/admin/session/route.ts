import {ApiError,adminConfigured,failure,json,rateLimit,readBody,requireOrigin,safeEqual,sessionCookie,signSession} from '../../../../lib/server';
export const runtime='nodejs';
export async function POST(req:Request){try{
 requireOrigin(req);
 if(!adminConfigured())throw new ApiError('Chưa cấu hình tài khoản quản trị LTPC.',503);
 const v=await readBody(req,2000) as {password?:unknown};
 if(!v||typeof v.password!=='string')throw new ApiError('Mật khẩu không hợp lệ.');
 await rateLimit(req,'login',5,900000);
 if(!safeEqual(v.password,process.env.ADMIN_PASSWORD!))throw new ApiError('Mật khẩu không đúng.',401);
 const response=json({ok:true});response.headers.set('Set-Cookie',sessionCookie(signSession(Date.now()+3600000),3600));return response;
}catch(e){return failure(e)}}
export async function DELETE(req:Request){try{requireOrigin(req);const response=json({ok:true});response.headers.set('Set-Cookie',sessionCookie('',0));return response}catch(e){return failure(e)}}
