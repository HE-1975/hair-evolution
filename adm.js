import { supabase } from "./supabase.js";

if (localStorage.getItem("logado") !== "Chefe") {
  location.href = "index.html";
}

window.salvarFunc = async () => {
  const nome = nomeFunc.value;
  const usuario = userFunc.value;
  const senha = senhaFunc.value;

  if (!nome || !usuario || !senha) {
    alert("Preencha tudo");
    return;
  }

  const { error } = await supabase
    .from("funcionarias")
    .insert([{ nome, usuario, senha }]);

  if (error) {
    alert("Erro ao salvar");
    return;
  }

  alert("Funcionária cadastrada");
};

window.salvarCliente = async () => {
  const nome = nomeCliente.value;
  const telefone = foneCliente.value;

  if (!nome || !telefone) {
    alert("Preencha tudo");
    return;
  }

  await supabase.from("clientes").insert([{ nome, telefone }]);
  alert("Cliente salvo");
};

window.sair = () => {
  localStorage.clear();
  location.href = "index.html";
};
