console.log("SCRIPT GERAL OK");

// ================= CHEFE FIXA =================
if (!localStorage.getItem("chefe")) {
    localStorage.setItem("chefe", JSON.stringify({
        usuario: "elaine",
        senha: "Hair1975"
    }));
}

// ================= LOGIN =================
const formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();

        const usuario = document.getElementById("usuario").value;
        const senha = document.getElementById("senha").value;
        const tipo = document.getElementById("tipo").value;

        if (tipo === "Chefe") {
            const chefe = JSON.parse(localStorage.getItem("chefe"));
            if (usuario === chefe.usuario && senha === chefe.senha) {
                localStorage.setItem("logado", "Chefe");
                window.location.href = "adm.html";
            } else {
                alert("Login inválido");
            }
            return;
        }

        const funcs = JSON.parse(localStorage.getItem("funcionarias")) || [];
        const f = funcs.find(x => x.usuario === usuario && x.senha === senha);

        if (f) {
            localStorage.setItem("logado", "Funcionaria");
            localStorage.setItem("funcAtual", usuario);
            window.location.href = "agenda.html";
        } else {
            alert("Funcionária não encontrada");
        }
    });
}

// ================= ADM =================
const listaFunc = document.getElementById("listaFunc");
const agendaFunc = document.getElementById("agendaFunc");
const progresso = document.getElementById("progresso");

function carregarFuncionarias() {
    if (!listaFunc) return;

    listaFunc.innerHTML = "";
    const funcs = JSON.parse(localStorage.getItem("funcionarias")) || [];

    funcs.forEach((f, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${f.nome}</strong> (${f.usuario})
            <button onclick="verAgenda(${i})">Ver Agenda</button>
            <button class="apagar" onclick="removerFunc(${i})">✖️</button>
        `;
        listaFunc.appendChild(li);
    });
}

window.removerFunc = function (i) {
    const funcs = JSON.parse(localStorage.getItem("funcionarias")) || [];
    funcs.splice(i, 1);
    localStorage.setItem("funcionarias", JSON.stringify(funcs));
    carregarFuncionarias();
    agendaFunc.innerHTML = "";
    progresso.innerHTML = "";
};

window.verAgenda = function (i) {
    agendaFunc.innerHTML = "";
    const funcs = JSON.parse(localStorage.getItem("funcionarias")) || [];
    const f = funcs[i];

    const total = f.sessoes.length;
    const concluidas = f.sessoes.filter(s => s.concluida).length;

    progresso.innerHTML = `Sessões concluídas: ${concluidas}/${total}`;

    f.sessoes.forEach((s, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${s.cliente}</td>
            <td>${s.modalidade}</td>
            <td>${s.data}</td>
            <td class="${s.concluida ? 'concluido' : 'pendente'}">
                ${s.concluida ? '✅' : 'Pendente'}
            </td>
            <td>
                <button class="apagar" onclick="apagarSessao(${i}, ${idx})">✖️</button>
            </td>
        `;
        agendaFunc.appendChild(tr);
    });
};

window.apagarSessao = function (funcIndex, sessaoIndex) {
    const funcs = JSON.parse(localStorage.getItem("funcionarias")) || [];
    funcs[funcIndex].sessoes.splice(sessaoIndex, 1);
    localStorage.setItem("funcionarias", JSON.stringify(funcs));
    verAgenda(funcIndex);
};

// ================= CADASTRO FUNCIONÁRIA =================
const btnSalvarFunc = document.getElementById("btnSalvarFunc");

if (btnSalvarFunc) {
    btnSalvarFunc.onclick = function () {
        const nome = document.getElementById("nomeFunc").value;
        const usuario = document.getElementById("userFunc").value;
        const senha = document.getElementById("senhaFunc").value;

        if (!nome || !usuario || !senha) {
            alert("Preencha todos os campos");
            return;
        }

        const funcs = JSON.parse(localStorage.getItem("funcionarias")) || [];
        funcs.push({ nome, usuario, senha, sessoes: [] });
        localStorage.setItem("funcionarias", JSON.stringify(funcs));

        document.getElementById("nomeFunc").value = "";
        document.getElementById("userFunc").value = "";
        document.getElementById("senhaFunc").value = "";

        carregarFuncionarias();
    };
}

// ================= CLIENTES =================
const btnSalvarCliente = document.getElementById("btnSalvarCliente");
const listaClientes = document.getElementById("listaClientes");

function carregarClientes() {
    if (!listaClientes) return;

    listaClientes.innerHTML = "";
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    clientes.forEach((c, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.nome}</td>
            <td>${c.telefone}</td>
            <td><button class="apagar" onclick="apagarCliente(${i})">✖️</button></td>
        `;
        listaClientes.appendChild(tr);
    });
}

if (btnSalvarCliente) {
    btnSalvarCliente.onclick = function () {
        const nome = document.getElementById("nomeCliente").value;
        const telefone = document.getElementById("foneCliente").value;

        if (!nome || !telefone) {
            alert("Preencha nome e telefone");
            return;
        }

        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        clientes.push({ nome, telefone });
        localStorage.setItem("clientes", JSON.stringify(clientes));

        document.getElementById("nomeCliente").value = "";
        document.getElementById("foneCliente").value = "";

        carregarClientes();
    };
}

window.apagarCliente = function (i) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    clientes.splice(i, 1);
    localStorage.setItem("clientes", JSON.stringify(clientes));
    carregarClientes();
};

// ================= LOGOUT =================
window.sair = function () {
    localStorage.removeItem("logado");
    localStorage.removeItem("funcAtual");
    window.location.href = "index.html";
};

// ================= INIT =================
carregarFuncionarias();
carregarClientes();

