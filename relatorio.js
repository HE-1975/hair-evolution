/* ================= SUPABASE ================= */
const supabaseClient = supabase.createClient(
  "https://fbhcmomiwezntpwmckgw.supabase.co",
  "sb_publishable_kJNOi5iHNDuyireXGr6nnw_LgPo3BFC"
);

/* ================= PROTEÇÃO ================= */
if (localStorage.getItem("logado") !== "Chefe") {
  location.replace("index.html");
}

/* ================= PREÇOS ================= */
const precos = [
  { prefixo: "UNHA", valor: 30 },
  { prefixo: "HIDA", valor: 70 },
  { prefixo: "LUZE", valor: 150 },
  { prefixo: "DEPI", valor: 25 },
  { prefixo: "SELA", valor: 80 },
  { prefixo: "PENT", valor: 60 },
  { prefixo: "CABE", valor: 100 },
  { prefixo: "ESTE", valor: 120 },
  { prefixo: "ALON", valor: 150 }
];

function obterPreco(mod) {
  const p = precos.find(p => mod.startsWith(p.prefixo));
  return p ? p.valor : 0;
}

/* ================= ELEMENTOS ================= */
const selectMes = document.getElementById("selectMes");
const selectAno = document.getElementById("selectAno");
const selectFuncionaria = document.getElementById("selectFuncionaria");
const tabela = document.getElementById("tabelaRelatorio");
const totalMes = document.getElementById("totalMes");

let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

/* ================= INIT ================= */
selectMes.value = mesAtual;

/* ANOS */
(async () => {
  const { data } = await supabaseClient
    .from("sessoes")
    .select("data");

  const anos = [...new Set(data.map(s => new Date(s.data).getFullYear()))];
  anos.sort().forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    selectAno.appendChild(opt);
  });

  selectAno.value = anoAtual;
})();

/* FUNCIONÁRIAS */
(async () => {
  const { data } = await supabaseClient
    .from("funcionarias")
    .select("nome");

  data.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.nome;
    opt.textContent = f.nome;
    selectFuncionaria.appendChild(opt);
  });
})();

/* ================= EVENTOS ================= */
selectMes.onchange = () => carregar();
selectAno.onchange = () => carregar();
selectFuncionaria.onchange = () => carregar();

document.getElementById("mesAnterior").onclick = () => {
  mesAtual = (mesAtual + 11) % 12;
  selectMes.value = mesAtual;
  carregar();
};

document.getElementById("mesProximo").onclick = () => {
  mesAtual = (mesAtual + 1) % 12;
  selectMes.value = mesAtual;
  carregar();
};

/* ================= CARREGAR ================= */
async function carregar() {
  tabela.innerHTML = "";
  let total = 0;

  const { data } = await supabaseClient
    .from("sessoes")
    .select(`
      modalidade,
      data,
      hora,
      concluida,
      funcionarias ( nome ),
      clientes ( nome )
    `);

  data.forEach(s => {
    const d = new Date(s.data);

    if (d.getMonth() !== mesAtual) return;
    if (d.getFullYear() !== Number(selectAno.value)) return;
    if (selectFuncionaria.value !== "todas" &&
        s.funcionarias.nome !== selectFuncionaria.value) return;

    const valor = obterPreco(s.modalidade);
    total += valor;

    tabela.innerHTML += `
      <tr>
        <td>${s.funcionarias.nome}</td>
        <td>${s.clientes.nome}</td>
        <td>${s.modalidade}</td>
        <td>${d.toLocaleDateString()}</td>
        <td>${s.hora}</td>
        <td>${s.concluida ? "✅" : "⏳"}</td>
        <td>R$ ${valor.toFixed(2)}</td>
      </tr>
    `;
  });

  totalMes.textContent = `R$ ${total.toFixed(2)}`;
}

carregar();
