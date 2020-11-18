import { API_URL } from '../../secrets';

export const get = async (destination) => {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
  
    const result = await fetch(`${API_URL}${destination}`, {
      method: 'GET',
      headers,
    });
    if (result.ok) {
      return await result.json();
    }
  
    throw { error: result.status };
};

export const post = async (destination, body) => {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
  
    const result = await fetch(`${API_URL}${destination}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  
    if (result.ok) {
      return await result.json();
    }
    throw { error: result.status };
};