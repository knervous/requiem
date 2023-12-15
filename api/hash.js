export const fetchCache = 'force-no-store';
export const revalidate = 0; // seconds
export const dynamic = 'force-dynamic';

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