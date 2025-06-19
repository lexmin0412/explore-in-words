export async function GET() {
  const data = await import('@/data/word.json');
  return Response.json(data.default);
}