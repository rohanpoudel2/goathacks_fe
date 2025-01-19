import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { getToken } from '@/lib/auth/utils';

import { client } from '../common';
import type { Request } from './types';

type Response = Request;

export const useAddRequest = createMutation<Response, Response, AxiosError>({
  mutationFn: async (variables) => {
    try {
      console.log({
        url: 'ride-requests/',
        method: 'POST',
        data: variables,
        headers: {
          Authorization: `Token ${getToken().access}`,
        },
      });
      const response = await client({
        url: 'ride-requests/',
        method: 'POST',
        data: variables,
        headers: {
          Authorization: `Token ${getToken().access}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        // Handle AxiosError
        console.error('Axios error:', error);
      } else {
        // Handle other errors
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  },
});
