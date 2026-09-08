
const API_URL =
  process.env.NEXT_PUBLIC_API_URL 

type ApiOptions =Omit <RequestInit,"body"> & {
  body?: unknown;
};

export const api = async <T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      // Important for HttpOnly cookies
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },

      body:
        options.body !== undefined &&
        typeof options.body !== "string"
          ? JSON.stringify(options.body)
          : options.body,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Something went wrong"
    );
  }

  return data;
};

