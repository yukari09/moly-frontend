export const getClientRealIp = (request) => {
    return request.headers.get('cf-connecting-ip') || 
           request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
           request.headers.get('x-real-ip') ||
           request.ip || 
           '127.0.0.1';
}