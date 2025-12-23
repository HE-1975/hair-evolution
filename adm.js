<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Administração - Hair Evolution</title>

  <link rel="icon" href="logo.png" type="image/png">
  <link rel="stylesheet" href="style.css">

  <style>
    .acoes-finais {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>

<script>
/* ===== PROTEÇÃO ADM (SEM LOOP) ===== */
if (localStorage.getItem("logado") !== "Chefe") {
  window.location.replace("index.html");
}
</script>

<div class="container">

  <h1>Área Administrativa</h1>
  <p><strong>Bem-vinda,</strong> <span id="nomeChefe"></span></p>

  <!-- FUNCIONÁRIAS -->
  <h2>Funcionárias</h2>

  <form id="formFunc">
    <input type="text" id="nomeFunc" placeholder="Nome">
    <input type="text" id="userFunc" placeholder="Usuário">
    <input type="password" id="senhaFunc" placeholder="Senha">
    <button type="button" id="btnSalvarFunc">Salvar</button>
  </form>

  <ul id="listaFunc"></ul>

  <!-- AGENDA -->
  <h3>Agenda da Funcionária</h3>
  <p id="progresso"></p>

  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Modalidade</th>
          <th>Data</th>
          <th>Status</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody id="agendaFunc"></tbody>
    </table>
  </div>

  <!-- CLIENTES -->
  <h2>Clientes</h2>

  <form id="formCliente">
    <input type="text" id="nomeCliente" placeholder="Nome">
    <input type="tel" id="foneCliente" placeholder="Telefone">
    <button type="button" id="btnSalvarCliente">Salvar</button>
  </form>

  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody id="listaClientes"></tbody>
    </table>
  </div>

  <div class="acoes-finais">
    <button onclick="location.href='relatorio.html'">Relatórios</button>
    <button class="apagar" onclick="sair()">Sair</button>
  </div>

</div>

<script>
/* ===== DADOS BÁSICOS ===== */
document.getElementById("nomeChefe").textContent =
  localStorage.getItem("nomeFunc") || "Chefe";

/* ===== FUNCIONÁRIAS ===== */
const listaFunc = document.getElementById("listaFunc");
const agendaFunc = document.getElementById("agendaFunc");
const progresso = document.getElementById("progresso");

function carregarFuncionarias() {
  listaFunc.innerHTML = "";
  const funcs = JSON.parse(localStorage.getItem("funcionarias")) || [];

  funcs.forEach((f, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${f.nome}</strong> (${f.usuario})
      <button onclick="verAgenda(${i})">Ver Agenda</button>
      <button class="apagar" onclick="removerFunc(${i})">✖</button>
    `;
    listaFunc.appendChild(li);
  });
}

document.getElementById("btnSalvarFunc").onclick = () => {
  const nome = nomeFunc.value;
  const usuario = userFunc.value;
  const senha = senhaFunc.value;

  if (!nome || !usuario || !senha) {
    alert("Preencha todos os campos");
    return;
  }

  const funcs = JSON.parse(localStorage.getItem("funcionarias")) || [];
  funcs.push({ nome, usuario, senha, sessoes: [] });
  localStorage.setItem("funcionarias", JSON.stringify(funcs));

  nomeFunc.value = userFunc.value = senhaFunc.value = "";
  carregarFuncionarias();
};

window.removerFunc = function(i) {
  const funcs = JSON.parse(localStorage.getItem("funcionarias")) || [];
  funcs.splice(i, 1);
  localStorage.setItem("funcionarias", JSON.stringify(funcs));
  agendaFunc.innerHTML = "";
  progresso.textContent = "";
  carregarFuncionarias();
};

window.verAgenda = function(i) {
  agendaFunc.innerHTML = "";
  const funcs = JSON.parse(localStorage.getItem("funcionarias")) || [];
  const f = funcs[i];

  const total = f.sessoes.length;
  const concluidas = f.sessoes.filter(s => s.concluida).length;
  progresso.textContent = `Sessões concluídas: ${concluidas}/${total}`;

  f.sessoes.forEach((s, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.cliente}</td>
      <td>${s.modalidade}</td>
      <td>${s.data}</td>
      <td>${s.concluida ? "✅" : "⏳"}</td>
      <td>
        <button class="apagar" onclick="apagarSessao(${i}, ${idx})">✖</button>
      </td>
    `;
    agendaFunc.appendChild(tr);
  });
};

window.apagarSessao = function(fi, si) {
  const funcs = JSON.parse(localStorage.getItem("funcionarias")) || [];
  funcs[fi].sessoes.splice(si, 1);
  localStorage.setItem("funcionarias", JSON.stringify(funcs));
  verAgenda(fi);
};

/* ===== CLIENTES ===== */
const listaClientes = document.getElementById("listaClientes");

function carregarClientes() {
  listaClientes.innerHTML = "";
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

  clientes.forEach((c, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.nome}</td>
      <td>${c.telefone}</td>
      <td><button class="apagar" onclick="apagarCliente(${i})">✖</button></td>
    `;
    listaClientes.appendChild(tr);
  });
}

document.getElementById("btnSalvarCliente").onclick = () => {
  const nome = nomeCliente.value;
  const telefone = foneCliente.value;

  if (!nome || !telefone) {
    alert("Preencha nome e telefone");
    return;
  }

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  clientes.push({ nome, telefone });
  localStorage.setItem("clientes", JSON.stringify(clientes));

  nomeCliente.value = foneCliente.value = "";
  carregarClientes();
};

window.apagarCliente = function(i) {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  clientes.splice(i, 1);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  carregarClientes();
};

/* ===== LOGOUT ===== */
function sair() {
  localStorage.clear();
  window.location.replace("index.html");
}

/* INIT */
carregarFuncionarias();
carregarClientes();
</script>

</body>
</html>
