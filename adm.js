/* ================= SUPABASE ================= */
const supabaseClient = supabase.createClient(
  "https://fbhcmomiwezntpwmckgw.supabase.co",
  "sb_publishable_kJNOi5iHNDuyireXGr6nnw_LgPo3BFC"
);

/* ================= PROTEÇÃO ADM ================= */
if (localStorage.getItem("logado") !== "Chefe") {
  window.location.replace("index.html");
}

/* ================= LOGOUT ================= */
function sair() {
  localStorage.clear();
  window.location.replace("index.html");
}

/* ================= ELEMENTOS ================= */
const listaFunc = document.getElementById("listaFunc");
const agendaFunc = document.getElementById("agendaFunc");
const progresso = document.getElementById("progresso");

const btnSalvarFunc = document.getElementById("btnSalvarFunc");
const btnSalvarCliente = document.getElementById("btnSalvarCliente");

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
    `;
    listaFunc.appendChild(li);
  });
}

/* ================= SALVAR FUNCIONÁRIA ================= */
btnSalvarFunc.onclick = async () => {
  const nome = nomeFunc.value.trim();
  const usuario = userFunc.value.trim();
  const senha = senhaFunc.value.trim();

  if (!nome || !usuario || !senha) {
    alert("Preencha todos os campos");
    return;
  }

  const { error } = await supabaseClient
    .from("funcionarias")
    .insert([
      {
        nome,
        usuario,
        senha,
        tipo: "Funcionaria"
      }
    ]);

  if (error) {
    alert("Erro ao salvar funcionária");
    console.error(error);
    return;
  }

  nomeFunc.value = "";
  userFunc.value = "";
  senhaFunc.value = "";

  carregarFuncionarias();
};

/* ================= AGENDA FUNCIONÁRIA ================= */
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

  const total = data.length;
  const concluidas = data.filter(s => s.concluida).length;
  progresso.textContent = `Sessões concluídas: ${concluidas}/${total}`;

  data.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.clientes.nome}</td>
      <td>${s.modalidade}</td>
      <td>${new Date(s.data).toLocaleDateString()}</td>
      <td>${s.concluida ? "✅" : "⏳"}</td>
      <td>
        <button class="apagar" onclick="apagarSessao('${s.id}', '${funcId}')">❌</button>
      </td>
    `;
    agendaFunc.appendChild(tr);
  });
}

/* ================= APAGAR SESSÃO ================= */
async function apagarSessao(sessaoId, funcId) {
  const { error } = await supabaseClient
    .from("sessoes")
    .delete()
    .eq("id", sessaoId);

  if (error) {
    alert("Erro ao apagar sessão");
    console.error(error);
    return;
  }

  verAgenda(funcId);
}

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
        <button class="apagar" onclick="apagarCliente('${c.id}')">❌</button>
      </td>
    `;
    listaClientes.appendChild(tr);
  });
}

/* ================= SALVAR CLIENTE ================= */
btnSalvarCliente.onclick = async () => {
  const nome = nomeCliente.value.trim();
  const telefone = foneCliente.value.trim();

  if (!nome || !telefone) {
    alert("Preencha nome e telefone");
    return;
  }

  const { error } = await supabaseClient
    .from("clientes")
    .insert([
      { nome, telefone }
    ]);

  if (error) {
    alert("Erro ao salvar cliente");
    console.error(error);
    return;
  }

  nomeCliente.value = "";
  foneCliente.value = "";

  carregarClientes();
};

/* ================= APAGAR CLIENTE ================= */
async function apagarCliente(id) {
  const { error } = await supabaseClient
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Erro ao apagar cliente");
    console.error(error);
    return;
  }

  carregarClientes();
}

/* ================= INIT ================= */
carregarFuncionarias();
carregarClientes();
