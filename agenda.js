<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Agenda - Hair Evolution</title>

  <link rel="icon" href="logo.png" type="image/png">
  <link rel="stylesheet" href="style.css">
</head>
<body>

<script>
if (localStorage.getItem("logado") !== "Funcionaria") {
  window.location.replace("index.html");
}
</script>

<div class="container">
  <h1>Agenda</h1>
  <p>Funcionária: <strong id="nome"></strong></p>

  <button onclick="sair()">Sair</button>
</div>

<script>
document.getElementById("nome").textContent =
  localStorage.getItem("nomeFunc") || "";

function sair() {
  localStorage.clear();
  window.location.replace("index.html");
}
</script>

</body>
</html>
