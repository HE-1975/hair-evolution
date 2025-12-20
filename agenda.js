import { supabase } from "./supabase.js";

const funcId = localStorage.getItem("funcAtual");
const nomeFunc = localStorage.getItem("nomeFunc");

if (!funcId) {
  location.href = "index.html";
}

document.getElementById("olaFunc").textContent = `Olá, ${nomeFunc}`;

const tabela = document.getElementById("tabela");
const form = document.getElementById("formSessao");

async function carregar() {
  const { data } = await supabase
    .from("sessoes")
    .select("*")
    .eq("funcionaria_id", funcId)
    .order("data", { ascending: true });

  tabela.innerHTML = "";

  data.forEach(s => {
    tabela.innerHTML += `
      <tr>
        <td>${s.cliente}</td>
        <td>${s.modalidade}</td>
        <td>${new Date(s.data).toLocaleDateString()}</td>
        <td>${s.hora}</td>
        <td>${s.concluida ? "✅" : "⏳"}</td>
        <td>
          ${
            !s.concluida
              ? `<button onclick="concluir('${s.id}')">Concluir</button>
                 <button onclick="apagar('${s.id}')">❌</button>`
              : ""
          }
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  const cliente = clienteInput.value;
  const modalidade = modalidadeSelect.value;
  const data = dataInput.value;
  const hora = horaInput.value;

  await supabase.from("sessoes").insert([{
    funcionaria_id: funcId,
    cliente,
    modalidade,
    data,
    hora,
    concluida: false
  }]);

  form.reset();
  carregar();
});

window.concluir = async id => {
  await supabase
    .from("sessoes")
    .update({ concluida: true })
    .eq("id", id);

  carregar();
};

window.apagar = async id => {
  await supabase
    .from("sessoes")
    .delete()
    .eq("id", id);

  carregar();
};

window.sair = () => {
  localStorage.clear();
  location.href = "index.html";
};

const clienteInput = document.getElementById("cliente");
const modalidadeSelect = document.getElementById("modalidade");
const dataInput = document.getElementById("data");
const horaInput = document.getElementById("hora");

carregar();
