const apiBaseUrl = import.meta.env.VITE_API_URL || "";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers });
  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    throw new ApiError("A API retornou uma resposta que não pôde ser lida.", response.status);
  }

  if (response.status === 401 && token) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-expired"));
  }
  if (!response.ok) {
    throw new ApiError(data.mensagem || "Não foi possível concluir a operação.", response.status);
  }
  return data;
}

export function mensagemErro(error) {
  if (error instanceof ApiError) {
    if (error.status === 400) return error.message;
    if (error.status === 401) return "Sessão expirada ou credenciais inválidas. Faça login novamente.";
    if (error.status === 404) return error.message;
    if (error.status === 409) return "Este e-mail já está cadastrado.";
    if (error.status >= 500) return error.message;
    return error.message;
  }
  return "Não foi possível conectar à API. Verifique se o servidor está em execução.";
}
