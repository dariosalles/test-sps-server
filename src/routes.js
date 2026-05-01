const { Router } = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");
const { 
  getBrazilDate,
  isValidEmail,
  isValidPassword,
  validateRequiredFields,
  errorResponse
} = require("./helpers");

const routes = Router();

// Mock inicial do usuário administrador
let users = [
  {
    id: 1,
    email: "admin@spsgroup.com.br",
    nome: "Administrador",
    type: "admin",
    password: "1234",
    dataCriacao: getBrazilDate()
  }
];

routes.get("/", (req, res) => {
  res.send("Servidor API em funcionamento!");
});

// Rota de login - gera o token JWT
routes.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Procurar usuário no array
  let usuario = users.find(u => u.email === email);

  // Validar credenciais
  if (usuario && usuario.password === password) {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.json({ token, user: usuario });
  }

  return res.status(401).json({ error: "Credenciais inválidas" });
});

// GET - Listar todos os usuários
routes.get("/users", authMiddleware, (req, res) => {
  try {
    res.json(users);
  } catch (error) {
    res.status(500).json(errorResponse("Erro interno do servidor"));
  }
});

// POST - Criar novo usuário
routes.post("/users", authMiddleware, (req, res) => {

  try {
    const { email, nome, type, password } = req.body;

    // Validar campos obrigatórios
    const validation = validateRequiredFields(
      { email, nome, type, password },
      ["email", "nome", "type", "password"]
    );
    
    if (!validation.valid) {
      return res.status(400).json(errorResponse(validation.error));
    }

    // Validar email
    if (!isValidEmail(email)) {
      return res.status(400).json(errorResponse("Email inválido"));
    }

    // Validar senha
    if (!isValidPassword(password)) {
      return res.status(400).json(errorResponse("Senha deve ter no mínimo 4 caracteres"));
    }

    // Validar email duplicado
    if (users.some(u => u.email === email)) {
      return res.status(400).json(errorResponse("Email já cadastrado"));
    }

    const novoUsuario = {
      id: Date.now(),
      email,
      nome,
      type,
      password, // senha sem hash
      dataCriacao: getBrazilDate()
    };

    users.push(novoUsuario);
    return res.status(201).json({ message: "Usuário criado com sucesso", usuario: novoUsuario });
  } catch (error) {
    return res.status(500).json(errorResponse("Erro interno do servidor"));
  }
});

// GET - Obter um usuário específico
routes.get("/users/:id", authMiddleware, (req, res) => {
  try {
    const usuario = users.find(u => u.id == req.params.id);

    if (!usuario) {
      return res.status(404).json(errorResponse("Usuário não encontrado"));
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json(errorResponse("Erro interno do servidor"));
  }
});

// PUT - Atualizar usuário
routes.put("/users/:id", authMiddleware, (req, res) => {
  try {
    const { email, nome, type, password } = req.body;
    const usuarioIndex = users.findIndex(u => u.id == req.params.id);

    if (usuarioIndex === -1) {
      return res.status(404).json(errorResponse("Usuário não encontrado"));
    }

    // Validar email se estiver sendo alterado
    if (email && email !== users[usuarioIndex].email) {
      if (!isValidEmail(email)) {
        return res.status(400).json(errorResponse("Email inválido"));
      }
      if (users.some(u => u.email === email)) {
        return res.status(400).json(errorResponse("Email já cadastrado"));
      }
    }

    // Validar senha se estiver sendo alterada
    if (password && !isValidPassword(password)) {
      return res.status(400).json(errorResponse("Senha deve ter no mínimo 4 caracteres"));
    }

    // Atualizar apenas os campos fornecidos
    if (email) users[usuarioIndex].email = email;
    if (nome) users[usuarioIndex].nome = nome;
    if (type) users[usuarioIndex].type = type;
    if (password) users[usuarioIndex].password = password;

    return res.json({ message: "Usuário atualizado com sucesso", usuario: users[usuarioIndex] });
  } catch (error) {
    return res.status(500).json(errorResponse("Erro interno do servidor"));
  }
});

// DELETE - Deletar usuário
routes.delete("/users/:id", authMiddleware, (req, res) => {
  try {
    const usuarioIndex = users.findIndex(u => u.id == req.params.id);

    if (usuarioIndex === -1) {
      return res.status(404).json(errorResponse("Usuário não encontrado"));
    }

    const usuarioDeletado = users.splice(usuarioIndex, 1);
    return res.json({ message: "Usuário deletado com sucesso", usuario: usuarioDeletado[0] });
  } catch (error) {
    return res.status(500).json(errorResponse("Erro interno do servidor"));
  }
});

// Rota protegida - exemplo
routes.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Acesso concedido!", user: req.user });
});

module.exports = routes;
