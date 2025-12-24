/* ================= SUPABASE ================= */
const supabaseClient = supabase.createClient(
  "https://fbhcmomiwezntpwmckgw.supabase.co",
  "sb_publishable_kJNOi5iHNDuyireXGr6nnw_LgPo3BFC"
);

/* ================= SESSÃO ================= */
const funcId = localStorage.getItem("funcId");
const nomeFunc = localStorage.getItem("nomeFunc");

if (!funcId) {
  window.location.replace("index.html");
}

document.getElementById("olaFunc").textContent = `Olá, ${nomeFunc}`;

/* ================= ELEMENTOS ================= */
const clienteSelect = document.getElementById("cliente");
const tabela = document.getElementById("tabela");
const formSessao = document.getElementById("formSessao");

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

  clienteSelect.innerHTML = "";

  data.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nome;
    clienteSelect.appendChild(opt);
  });
}

/* ================= AGENDA ================= */
async function carregarAgenda() {
  const { data, error } = await supabaseClient
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

  if (error) {
    alert("Erro ao carregar agenda");
    console.error(error);
    return;
  }

  tabela.innerHTML = "";

  data.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.clientes.nome}</td>
      <td>${s.modalidade}</td>
      <td>${new Date(s.data).toLocaleDateString()}</td>
      <td>${s.hora}</td>
      <td>${s.concluida ? "✅" : "⏳"}</td>
      <td>
        ${!s.concluida ? `<button onclick="concluir('${s.id}')">Concluir</button>` : ""}
      </td>
    `;
    tabela.appendChild(tr);
  });
}

/* ================= NOVA SESSÃO ================= */
formSessao.addEventListener("submit", async e => {
  e.preventDefault();

  const { error } = await supabaseClient
    .from("sessoes")
    .insert({
      funcionaria_id: funcId,
      cliente_id: clienteSelect.value,
      modalidade: modalidade.value,
      data: data.value,
      hora: hora.value,
      concluida: false
    });

  if (error) {
    alert("Erro ao salvar sessão");
    console.error(error);
    return;
  }

  formSessao.reset();
  carregarAgenda();
});

/* ================= CONCLUIR ================= */
async function concluir(id) {
  await supabaseClient
    .from("sessoes")
    .update({ concluida: true })
    .eq("id", id);

  carregarAgenda();
}

/* ================= LOGOUT ================= */
function sair() {
  localStorage.clear();
  window.location.replace("index.html");
}

/* ================= INIT ================= */
carregarClientes();
carregarAgenda();
