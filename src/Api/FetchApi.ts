

const BASE_URL = 'https://hashtag-api.impaact.io/api/v1/en'; // Replace with your actual base URL



export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface FetchOptions {
  method?: HTTPMethod;
  body?: any;
  options?: RequestInit;
}

const fetchData = async <T = any>(
  endpoint: string,
  method: HTTPMethod = 'GET',
  body?: any,
  options: RequestInit = {}
): Promise<T> => {
  try {
    let TOKEN  : string | any ;
if (typeof window !== 'undefined') {
  TOKEN = localStorage.getItem('token'); ;
}

    const url = `${BASE_URL}/${endpoint}`;
    console.log('Fetching URL:', url);
    let headers: Record<string, string> = {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json',
    };
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const isUploadEndpoint = endpoint === 'user/group/upload' || endpoint === 'support-requests/upload-file';
    if (!isFormData && !isUploadEndpoint) {
      headers = {
        ...headers,
        'Content-Type': 'application/json',
      };
    }
    const response = await fetch(url, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('API Error:', error);
      if (
        response.status === 401 ||
        (error.error && error.error.toLowerCase().includes('token'))
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }

      console.error('API Error:', error);
      showErrorToast(`Error: ${error.error || error.message || 'An error occurred'}`);
      throw new Error(error.error || error.message || 'An error occurred');
    }
    if (["POST", "PATCH", "DELETE"].includes(method)) {
      showSuccessToast('Success: Request was successful');
    }

    return await response.json() as T;
  } catch (error) {
    throw error;
  }
};

const showErrorToast = (message: string) => {
  alert(message);
};

const showSuccessToast = (message: string) => {
  alert(message);
};





export default fetchData;