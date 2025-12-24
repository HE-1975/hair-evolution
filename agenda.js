<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Agenda - Hair Evolution</title>

  <link rel="icon" href="logo.png" type="image/png">
  <link rel="stylesheet" href="style.css">

  <style>
    .container {
      position: relative;
      padding-bottom: 90px;
    }
    .btn-sair {
      position: absolute;
      bottom: 25px;
      right: 25px;
    }
  </style>
</head>
<body>

<script>
/* ===== PROTEÇÃO FUNCIONÁRIA ===== */
if (localStorage.getItem("logado") !== "Funcionaria") {
  window.location.replace("index.html");
}
</script>

<div class="container">

  <h2>Olá, <span id="nomeFunc"></span></h2>

  <!-- NOVA SESSÃO -->
  <section class="card">
    <h3>Nova sessão</h3>

    <form id="formSessao">
      <label>Cliente</label>
      <select id="cliente" required></select>

      <label>Modalidade</label>
      <input type="text" id="modalidade" required>

      <label>Data</label>
      <input type="date" id="data" required>

      <label>Hora</label>
      <input type="time" id="hora" required>

      <button type="submit">Salvar sessão</button>
    </form>
  </section>

  <!-- AGENDA -->
  <section class="card">
    <h3>Agenda</h3>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Modalidade</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="tabela"></tbody>
      </table>
    </div>
  </section>

  <button class="btn-sair" onclick="sair()">Sair</button>

</div>

<!-- SUPABASE -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
/* ===== SUPABASE ===== */
const supabaseClient = supabase.createClient(
  "https://fbhcmomiwezntpwmckgw.supabase.co",
  "sb_publishable_kJNOi5iHNDuyireXGr6nnw_LgPo3BFC"
);

/* ===== DADOS DA SESSÃO ===== */
const funcId   = localStorage.getItem("funcId");
const nomeFunc = localStorage.getItem("nomeFunc");

document.getElementById("nomeFunc").textContent = nomeFunc || "";

/* ===== CLIENTES ===== */
async function carregarClientes() {
  const { data } = await supabaseClient
    .from("clientes")
    .select("*")
    .order("nome");

  const select = document.getElementById("cliente");
  select.innerHTML = "";

  data.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.nome} - ${c.telefone}`;
    select.appendChild(opt);
  });
}

/* ===== SESSÕES ===== */
async function carregarSessoes() {
  const { data } = await supabaseClient
    .from("sessoes")
    .select(`
      id,
      modalidade,
      data,
      hora,
      concluida,
      clientes ( nome )
    `)
    .eq("funcionaria_id", funcId)
    .order("data");

  const tbody = document.getElementById("tabela");
  tbody.innerHTML = "";

  data.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.clientes.nome}</td>
      <td>${s.modalidade}</td>
      <td>${new Date(s.data).toLocaleDateString()}</td>
      <td>${s.hora}</td>
      <td>${s.concluida ? "✅" : "⏳"}</td>
      <td>
        ${
          !s.concluida
            ? `<button onclick="concluir('${s.id}')">Concluir</button>`
            : ""
        }
        <button onclick="apagar('${s.id}')">✖</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ===== NOVA SESSÃO ===== */
document.getElementById("formSessao").addEventListener("submit", async e => {
  e.preventDefault();

  await supabaseClient.from("sessoes").insert({
    funcionaria_id: funcId,
    cliente_id: cliente.value,
    modalidade: modalidade.value,
    data: data.value,
    hora: hora.value,
    concluida: false
  });

  e.target.reset();
  carregarSessoes();
});

/* ===== AÇÕES ===== */
async function concluir(id) {
  await supabaseClient
    .from("sessoes")
    .update({ concluida: true })
    .eq("id", id);

  carregarSessoes();
}

async function apagar(id) {
  await supabaseClient
    .from("sessoes")
    .delete()
    .eq("id", id);

  carregarSessoes();
}

/* ===== LOGOUT ===== */
function sair() {
  localStorage.clear();
  window.location.replace("index.html");
}

/* INIT */
carregarClientes();
carregarSessoes();
</script>

</body>
</html>
