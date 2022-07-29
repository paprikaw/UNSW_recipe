import { useEffect, useState } from 'react';

export const useFetch = (url, requestBody = { method: 'get' }) => {
  const [relData, setRelData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(url, requestBody)
      .then((v) => {
        return v.json();
      })
      .then((data) => {
        console.log(data);
        setRelData(data);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  }, []);

  return [relData, isLoading];
};
