// 1. Configurações de Ciclo de Vida (Sprint 2)
const infoCulturas = {
  Alface: { ciclo: 45, sementesM2: 50 },
  Tomate: { ciclo: 90, sementesM2: 10 },
  Cenoura: { ciclo: 70, sementesM2: 100 },
};

// 2. Função de Cadastro
function cadastrarPlantio(event) {
  event.preventDefault();

  // Captura de Inputs
  const cultura = document.getElementById("cultura").value;
  const dataPlantioStr = document.getElementById("data").value;
  const areaM2 = parseFloat(document.getElementById("area").value);
  const endereco = document.getElementById("endereco").value;

  // Lógica de Ciclo de Vida
  let dataColheita = new Date(dataPlantioStr);
  dataColheita.setDate(dataColheita.getDate() + infoCulturas[cultura].ciclo);

  // Cálculos com Math
  const totalSementes = Math.ceil(areaM2 * infoCulturas[cultura].sementesM2);

  const novoCanteiro = {
    id: Date.now(),
    cultura: cultura,
    dataColheita: dataColheita.toLocaleDateString("pt-BR"),
    timestampColheita: dataColheita.getTime(),
    local: endereco,
    sementes: totalSementes,
  };

  // Persistência com LocalStorage
  let lista = JSON.parse(localStorage.getItem("hortas")) || [];
  lista.push(novoCanteiro);
  localStorage.setItem("hortas", JSON.stringify(lista));

  alert("✅ Canteiro cadastrado! Calculamos " + totalSementes + " sementes.");
  window.location.href = "painel-de-controle.html";
}

// 3. Renderização Dinâmica
function carregarPainel() {
  const listaCanteiros = document.getElementById("lista-canteiros");
  if (!listaCanteiros) return;

  const dados = JSON.parse(localStorage.getItem("hortas")) || [];

  // Limpa os cards se houver dados salvos
  if (dados.length >= 0) listaCanteiros.innerHTML = "";

  dados.forEach((item) => {
    const hoje = new Date().getTime();
    const estaPronto = hoje >= item.timestampColheita;

    const card = document.createElement("article");
    card.className = `card-minimalista ${estaPronto ? "alerta" : ""}`;

    card.innerHTML = `
            <div class="card-header">
                <h3>${item.cultura}</h3>
                <span class="tag-status ${estaPronto ? "" : "ok"}">
                    ${estaPronto ? "⚠️ COLHEITA!" : "🌱 CRESCENDO"}
                </span>
            </div>
            <div class="card-body">
                <p><strong>📍 Local:</strong> ${item.local}</p>
                <p><strong>📦 Insumos:</strong> ${item.sementes} sementes</p>
                <p><strong>📅 Colheita:</strong> ${item.dataColheita}</p>
            </div>
            <button class="btn-check" onclick="removerCanteiro(${item.id})">Finalizar</button>
        `;
    listaCanteiros.appendChild(card);
  });
}

function removerCanteiro(id) {
  let lista = JSON.parse(localStorage.getItem("hortas"));
  lista = lista.filter((c) => c.id !== id);
  localStorage.setItem("hortas", JSON.stringify(lista));
  carregarPainel();
}

// Inicialização por página
window.onload = () => {
  const form = document.getElementById("form-plantio");
  if (form) form.addEventListener("submit", cadastrarPlantio);
  carregarPainel();
};

// Navegação Simples para as páginas 
function irPara(pagina) {
  switch (pagina) {
    case "painel":
      window.location.href = "/pages/painel-de-controle.html";
      break;
    case "plantio":
      window.location.href = "/pages/novo-plantio.html";
      break;
    case "mapa":
      window.location.href = "/pages/mapa-plantio.html";
      break;
    case "sair":
      localStorage.clear(); 
      window.location.href = "/login.html";
      break;
    default:
      console.error("Página desconhecida:", pagina);
  }
}
