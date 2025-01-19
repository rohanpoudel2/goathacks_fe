import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Request } from './types';

type Response = Request[];
type Variables = void;

export const useRequests = createQuery<Response, Variables, AxiosError>({
  queryKey: ['requests'],
  fetcher: () => {
    return client.get(`rides/requests`).then((response) => response.data);
  },
});
