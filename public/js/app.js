// =======================
// TEMA
// =======================
function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme",
        document.body.classList.contains("dark") ? "dark" : "light");
}

function loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
}

// =======================
// CADASTRO (API)
// =======================
async function cadastrar() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const idade = document.getElementById("idade").value;

    const resposta = await fetch('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, idade })
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
// LOGIN (SIMPLES)
// =======================
async function login() {
    const email = document.getElementById("email").value;

    const res = await fetch('/usuarios');
    const usuarios = await res.json();

    const user = usuarios.find(u => u.email === email);

    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "feed.html";
    } else {
        alert("Usuário não encontrado");
    }
}

// =======================
// LOGOUT
// =======================
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// =======================
// PERFIL
// =======================
function carregarPerfil() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    document.getElementById("nomePerfil").innerText = user.nome;
    document.getElementById("emailPerfil").innerText = user.email;
}

// =======================
// COMENTÁRIOS (API)
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

// =======================
// LISTAR COMENTÁRIOS
// =======================
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

// =======================
// INIT
// =======================
window.onload = () => {
    loadTheme();
};