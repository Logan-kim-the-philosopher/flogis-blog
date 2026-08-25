import type { APIRoute } from 'astro';
import { getSearchPayload } from '../../lib/services/search-service';

export const GET: APIRoute = async () => {
  const payload = await getSearchPayload();

  return Response.json(payload, {
    headers: {
      'Cache-Control': 'no-store'
    }
  });
};
