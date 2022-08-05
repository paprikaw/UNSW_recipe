import { useEffect, useState } from 'react';

/**
 * Fetching data and return states with loading states
 *
 * @CustomHook
 * @url  requestUrl
 * @dataProcess  callback for returned data
 * @requestBody request body when fetching
 * @initData Initial data for state
 */
export const useFetch = (url, dataProcess, requestBody, initData) => {
  const [relData, setRelData] = useState(initData);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch(url, requestBody)
      .then((v) => {
        return v.json();
      })
      .then((data) => {
        setRelData(dataProcess && data ? dataProcess(data) : data);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  }, []);

  return [relData, isLoading, setRelData];
};
