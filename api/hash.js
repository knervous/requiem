import type { VercelRequest, VercelResponse } from '@vercel/node';
 
console.log('In module');
export default function handler(
  request,
  response,
) {
  console.log('in handler', request);
  response.status(200).json({
    test: 123
  });
}