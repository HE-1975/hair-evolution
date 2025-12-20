import { supabase } from "./supabase.js";

/* BLOQUEIO DE ACESSO */
if (localStorage.getItem("logado") !== "Chefe") {
  location.href = "index.html";
}

/* PREÇOS */
const precos = [
  { prefixo: "UNHA", valor: 30 },
  { prefixo: "HIDA", valor: 70 },
  { prefixo: "LUZE", valor: 120 },
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

/* ELEMENTOS */
const selectMes = document.getElementById("selectMes");
const selectAno = document.getElementById("selectAno");
const selectFuncionaria = document.getElementById("selectFuncionaria");
const tabela = document.getElementById("tabelaRelatorio");
const totalMes = document.getElementById("totalMes");

/* MESES */
const meses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

meses.forEach((m, i) => {
  const o = document.createElement("option");
  o.value = i;
  o.textContent = m;
  selectMes.appendChild(o);
});

/* ANOS */
const anoAtual = new Date().getFullYear();
for (let a = anoAtual - 3; a <= anoAtual + 1; a++) {
  const o = document.createElement("option");
  o.value = a;
  o.textContent = a;
  selectAno.appendChild(o);
}

selectMes.value = new Date().getMonth();
selectAno.value = anoAtual;

/* FUNCIONÁRIAS */
async function carregarFuncionarias() {
  const { data } = await supabase
    .from("funcionarias")
    .select("id, nome");

  data.forEach(f => {
    const o = document.createElement("option");
    o.value = f.id;
    o.textContent = f.nome;
    selectFuncionaria.appendChild(o);
  });
}

/* RELATÓRIO */
async function carregarRelatorio() {
  tabela.innerHTML = "";
  let total = 0;

  const mes = selectMes.value;
  const ano = selectAno.value;
  const funcId = selectFuncionaria.value;

  let query = supabase
    .from("sessoes")
    .select(`
      cliente,
      modalidade,
      data,
      hora,
      concluida,
      funcionarias ( nome )
    `);

  if (funcId !== "todas") {
    query = query.eq("funcionaria_id", funcId);
  }

  const { data } = await query;

  data.forEach(s => {
    const d = new Date(s.data);
    if (d.getMonth() != mes || d.getFullYear() != ano) return;

    const valor = obterPreco(s.modalidade);
    total += valor;

    tabela.innerHTML += `
      <tr>
        <td>${s.funcionarias.nome}</td>
        <td>${s.cliente}</td>
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

/* EVENTOS */
selectMes.onchange = carregarRelatorio;
selectAno.onchange = carregarRelatorio;
selectFuncionaria.onchange = carregarRelatorio;

/* INIT */
await carregarFuncionarias();
carregarRelatorio();
