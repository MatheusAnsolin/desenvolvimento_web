// =======================
// TEMA
// =======================
function toggleTheme() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    atualizarBotaoTema();
}

function loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
    atualizarBotaoTema();
}

function atualizarBotaoTema() {
    const btn = document.getElementById("themeBtn");
    if (!btn) return;

    btn.innerText = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

// =======================
// NAVBAR
// =======================
function atualizarNavbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const area = document.getElementById("navUserArea");

    if (!area) return;

    if (user) {
        area.innerHTML = `
            <span class="text-white me-2">${user.nome}</span>
            <a href="perfil.html" class="btn btn-outline-light btn-sm me-1">Perfil</a>
            <a href="config.html" class="btn btn-outline-light btn-sm me-1">Config</a>
            <button onclick="logout()" class="btn btn-danger btn-sm">Logout</button>
        `;
    } else {
        area.innerHTML = `
            <a href="login.html" class="btn btn-light btn-sm me-1">Login</a>
            <a href="cadastro.html" class="btn btn-outline-light btn-sm">Cadastro</a>
        `;
    }
}

// =======================
// CADASTRO
// =======================
async function cadastrar() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const resposta = await fetch('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    });

    const data = await resposta.json();

    if (resposta.ok) {
        alert("Usuário cadastrado!");
        window.location.href = "login.html";
    } else {
        alert(data.erro);
    }
}

// =======================
// LOGIN
// =======================
async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const res = await fetch('/usuarios');
    const usuarios = await res.json();

    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "feed.html";
    } else {
        alert("Login inválido");
    }
}

// =======================
// LOGOUT
// =======================
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}function carregarPerfil() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        console.log("Usuário não encontrado no localStorage");
        return;
    }

    const nome = document.getElementById("nomePerfil");
    const bio = document.getElementById("bioPerfil");
    const interesses = document.getElementById("interessesPerfil");
    const foto = document.getElementById("fotoPerfil");

    if (nome) nome.innerText = user.nome || "";
    if (bio) bio.innerText = user.bio || "Sem bio";
    if (interesses) interesses.innerText = user.interesses || "Sem interesses";
    if (foto) foto.src = user.foto || "https://via.placeholder.com/150";
}
function carregarConfig() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    document.getElementById("nome").value = user.nome || "";
    document.getElementById("foto").value = user.foto || "";
    document.getElementById("bio").value = user.bio || "";
    document.getElementById("interesses").value = user.interesses || "";
}
function salvarConfig() {
    let user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    user.nome = document.getElementById("nome").value || "";
    user.foto = document.getElementById("foto").value || "https://via.placeholder.com/150";
    user.bio = document.getElementById("bio").value || "";
    user.interesses = document.getElementById("interesses").value || "";

    localStorage.setItem("user", JSON.stringify(user));

    alert("Perfil atualizado!");
}
// =======================
// COMENTÁRIOS
// =======================
async function postar() {
    const texto = document.getElementById("comentario").value;
    const user = JSON.parse(localStorage.getItem("user"));

    if (!texto) return;

    await fetch('/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            texto,
            autor: user.nome
        })
    });

    document.getElementById("comentario").value = "";
    carregarComentarios();
}

async function carregarComentarios() {
    const lista = document.getElementById("listaComentarios");
    if (!lista) return;

    lista.innerHTML = "";

    const res = await fetch('/comentarios');
    const comentarios = await res.json();

    comentarios.forEach(c => {
        lista.innerHTML += `
        <div class="card mb-2 p-2">
            <strong>${c.autor}</strong>
            <p>${c.texto}</p>
        </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    atualizarNavbar();
});

