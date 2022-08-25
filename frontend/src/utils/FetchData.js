export const fetchData = async (url, method, data = null, headers = {}) => {
    let response_data;
    if (!data) {
      response_data = await fetch(url, {
         method: method,  
         headers: { "Content-type": "application/json", ...headers },
        });
    } else {
      response_data = await fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json", ...headers },

      });
    }
    
    const response = await response_data.json();
    const status = response_data.status
    return {response, status};
  };
  