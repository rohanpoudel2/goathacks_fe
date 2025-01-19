import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Request } from './types';

type Variables = { id: string };
type Response = Request;

export const useRequest = createQuery<Response, Variables, AxiosError>({
  queryKey: ['requests'],
  fetcher: (variables) => {
    return client
      .get(`rides/requests/${variables.id}`)
      .then((response) => response.data);
  },
});
