// ============ Date Helpers ============

// Helper para obter data no timezone Brasil (UTC-3)
function getBrazilDate() {
  const agora = new Date();
  const offset = -3; // UTC-3 (Horário de Brasília)
  const dataBrasil = new Date(agora.getTime() + (offset * 60 * 60 * 1000));
  return dataBrasil;
}

// ============ Validation Helpers ============

// Validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar senha (mínimo 4 caracteres)
function isValidPassword(password) {
  return password && password.length >= 4;
}

// Validar campos obrigatórios
function validateRequiredFields(data, requiredFields) {
  const missing = requiredFields.filter(field => !data[field]);
  if (missing.length > 0) {
    return {
      valid: false,
      error: `Campos obrigatórios faltando: ${missing.join(", ")}`,
    };
  }
  return { valid: true };
}

// ============ Response Helpers ============

// Resposta de sucesso
function successResponse(message, data = null) {
  const response = { message };
  if (data) response.data = data;
  return response;
}

// Resposta de erro
function errorResponse(error) {
  return { error };
}

module.exports = {
  getBrazilDate,
  isValidEmail,
  isValidPassword,
  validateRequiredFields,
  successResponse,
  errorResponse,
};
