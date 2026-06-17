export function useApiClient() {
  return {
    get: <T>(url: string) => $fetch<T>(url),
    post: <T>(url: string, body: Record<string, unknown>) => $fetch<T>(url, {
      method: "POST",
      body,
    }),
    patch: <T>(url: string, body: Record<string, unknown>) => $fetch<T>(url, {
      method: "PATCH",
      body,
    }),
    delete: <T>(url: string) => $fetch<T>(url, { method: "DELETE" }),
  }
}
