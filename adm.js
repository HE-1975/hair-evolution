/* ================= SUPABASE ================= */
const supabaseClient = supabase.createClient(
  "https://fbhcmomiwezntpwmckgw.supabase.co",
  "sb_publishable_kJNOi5iHNDuyireXGr6nnw_LgPo3BFC"
);

/* ================= PROTEÇÃO ================= */
if (localStorage.getItem("logado") !== "Chefe") {
  window.location.replace("index.html");
}

/* ================= ELEMENTOS ================= */
const listaFunc = document.getElementById("listaFunc");
const agendaFunc = document.getElementById("agendaFunc");
const progresso = document.getElementById("progresso");

const formFunc = document.getElementById("formFunc");
const formCliente = document.getElementById("formCliente");

const nomeFunc = document.getElementById("nomeFunc");
const userFunc = document.getElementById("userFunc");
const senhaFunc = document.getElementById("senhaFunc");

const nomeCliente = document.getElementById("nomeCliente");
const foneCliente = document.getElementById("foneCliente");
const listaClientes = document.getElementById("listaClientes");

/* ================= FUNCIONÁRIAS ================= */
async function carregarFuncionarias() {
  const { data, error } = await supabaseClient
    .from("funcionarias")
    .select("*")
    .order("nome");

  if (error) {
    alert("Erro ao carregar funcionárias");
    console.error(error);
    return;
  }

  listaFunc.innerHTML = "";

  data.forEach(f => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${f.nome}</strong> (${f.usuario})
      <button onclick="verAgenda('${f.id}')">Ver agenda</button>
      <button class="apagar" onclick="removerFunc('${f.id}')">✖️</button>
    `;
    listaFunc.appendChild(li);
  });
}

async function removerFunc(id) {
  if (!confirm("Remover funcionária?")) return;

  await supabaseClient
    .from("funcionarias")
    .delete()
    .eq("id", id);

  agendaFunc.innerHTML = "";
  progresso.textContent = "";

  carregarFuncionarias();
}

/* ================= AGENDA ================= */
async function verAgenda(funcId) {
  const { data, error } = await supabaseClient
    .from("sessoes")
    .select(`
      id,
      modalidade,
      data,
      concluida,
      clientes ( nome )
    `)
    .eq("funcionaria_id", funcId)
    .order("data");

  if (error) {
    alert("Erro ao carregar agenda");
    console.error(error);
    return;
  }

  agendaFunc.innerHTML = "";

  let concluidas = 0;

  data.forEach(s => {
    if (s.concluida) concluidas++;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.clientes.nome}</td>
      <td>${s.modalidade}</td>
      <td>${new Date(s.data).toLocaleDateString()}</td>
      <td>${s.concluida ? "✅" : "⏳"}</td>
      <td>
        <button class="apagar" onclick="apagarSessao('${s.id}', '${funcId}')">✖️</button>
      </td>
    `;
    agendaFunc.appendChild(tr);
  });

  progresso.textContent = `Sessões concluídas: ${concluidas}/${data.length}`;
}

async function apagarSessao(sessaoId, funcId) {
  await supabaseClient
    .from("sessoes")
    .delete()
    .eq("id", sessaoId);

  verAgenda(funcId);
}

/* ================= CADASTRO ================= */
formFunc.addEventListener("submit", async e => {
  e.preventDefault();

  if (!nomeFunc.value || !userFunc.value || !senhaFunc.value) {
    alert("Preencha todos os campos");
    return;
  }

  const { error } = await supabaseClient
    .from("funcionarias")
    .insert({
      nome: nomeFunc.value,
      usuario: userFunc.value,
      senha: senhaFunc.value,
      tipo: "Funcionaria"
    });

  if (error) {
    alert("Erro ao salvar funcionária");
    console.error(error);
    return;
  }

  formFunc.reset();
  carregarFuncionarias();
});

formCliente.addEventListener("submit", async e => {
  e.preventDefault();

  if (!nomeCliente.value || !foneCliente.value) {
    alert("Preencha todos os campos");
    return;
  }

  const { error } = await supabaseClient
    .from("clientes")
    .insert({
      nome: nomeCliente.value,
      telefone: foneCliente.value
    });

  if (error) {
    alert("Erro ao salvar cliente");
    console.error(error);
    return;
  }

  formCliente.reset();
  carregarClientes();
});

/* ================= CLIENTES ================= */
async function carregarClientes() {
  const { data, error } = await supabaseClient
    .from("clientes")
    .select("*")
    .order("nome");

  if (error) {
    alert("Erro ao carregar clientes");
    console.error(error);
    return;
  }

  listaClientes.innerHTML = "";

  data.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.nome}</td>
      <td>${c.telefone}</td>
      <td>
        <button class="apagar" onclick="apagarCliente('${c.id}')">✖️</button>
      </td>
    `;
    listaClientes.appendChild(tr);
  });
}

async function apagarCliente(id) {
  if (!confirm("Remover cliente?")) return;

  await supabaseClient
    .from("clientes")
    .delete()
    .eq("id", id);

  carregarClientes();
}

/* ================= LOGOUT ================= */
function sair() {
  localStorage.clear();
  window.location.replace("index.html");
}

/* ================= INIT ================= */
carregarFuncionarias();
carregarClientes();
