import type { VercelRequest, VercelResponse } from '@vercel/node';
 
export default function handler(
  request,
  response,
) {
  response.status(200).json({
    test: 123
  });
}