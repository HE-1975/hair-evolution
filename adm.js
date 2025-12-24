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
  // LIMPA TODA A SESSÃO
  localStorage.removeItem("logado");
  localStorage.removeItem("funcId");
  localStorage.removeItem("nomeFunc");

  // REDIRECIONA SEM HISTÓRICO
  window.location.replace("index.html");
}

/* ================= ELEMENTOS ================= */
const listaFunc = document.getElementById("listaFunc");
const agendaFunc = document.getElementById("agendaFunc");
const progresso = document.getElementById("progresso");

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
      <strong>${f.nome}</strong>
      <button onclick="verAgenda('${f.id}')">Ver agenda</button>
    `;
    listaFunc.appendChild(li);
  });
}

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
        <button onclick="apagarSessao('${s.id}', '${funcId}')">❌</button>
      </td>
    `;
    agendaFunc.appendChild(tr);
  });
}

/* ================= APAGAR SESSÃO ================= */
async function apagarSessao(sessaoId, funcId) {
  await supabaseClient
    .from("sessoes")
    .delete()
    .eq("id", sessaoId);

  verAgenda(funcId);
}

/* ================= INIT ================= */
carregarFuncionarias();
