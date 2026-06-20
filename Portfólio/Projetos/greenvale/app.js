/* ============================================
   NUTRIVIDA — app.js
   Toda a lógica do site está aqui:
   receitas, filtros, busca, favoritos,
   modal, minijogo e painel do dono
   ============================================ */

/* =====================
   RECEITAS PADRÃO DO SITE
   ===================== */
let receitas = [];
/* =====================
   ESTADO DO SITE
   Guarda o que o usuário está fazendo agora
   ===================== */
let categoriaAtiva = "todos"; // filtro de categoria ativo
let buscaAtual = "";          // texto digitado na busca
let favoritos = JSON.parse(localStorage.getItem("nutrivida_favs") || "[]"); // favoritos salvos

/* Carrega receitas personalizadas salvas pelo dono */
function carregarReceitasCustom() {
  return JSON.parse(localStorage.getItem("nutrivida_custom") || "[]");
}

/* Junta receitas padrão + personalizadas */
function todasReceitas() {
  return [...receitasPadrao, ...carregarReceitasCustom()];
}

/* =====================
   FUNÇÕES AUXILIARES
   ===================== */

/* Salva favoritos no localStorage do navegador */
function salvarFavoritos() {
  localStorage.setItem("nutrivida_favs", JSON.stringify(favoritos));
}

/* Adiciona ou remove um favorito ao clicar no coração */
function toggleFavorito(id, e) {
  e.stopPropagation(); // evita abrir o modal ao clicar no coração
  const idx = favoritos.indexOf(id);
  if (idx === -1) favoritos.push(id);
  else favoritos.splice(idx, 1);
  salvarFavoritos();
  renderCards();
}

/* Retorna o texto de dificuldade em português */
function textoDificuldade(d) {
  return { easy: "Fácil", medium: "Médio", hard: "Difícil" }[d] || d;
}

/* Retorna o texto da categoria em português */
function textoCategoria(c) {
  return { cafe: "Café da Manhã", almoco: "Almoço", jantar: "Jantar", lanche: "Lanche" }[c] || c;
}

/* Retorna a classe CSS do badge da categoria */
function classeBadge(c) {
  return { cafe: "badge-cafe", almoco: "badge-almoco", jantar: "badge-jantar", lanche: "badge-lanche" }[c] || "";
}

/* =====================
   FILTRAGEM E RENDERIZAÇÃO
   ===================== */

/* Filtra as receitas de acordo com categoria e busca */
function receitasFiltradas() {
  const todas = todasReceitas();
  return todas.filter(r => {
    const catOk = categoriaAtiva === "todos" || r.categoria === categoriaAtiva;
    const q = buscaAtual.toLowerCase();
    // verifica se o nome, descrição ou algum ingrediente bate com a busca
    const buscaOk = !q
      || r.nome.toLowerCase().includes(q)
      || r.desc.toLowerCase().includes(q)
      || r.ingredientes.some(i => i.toLowerCase().includes(q));
    return catOk && buscaOk;
  });
}

/* Atualiza os números nos botões de filtro */
function atualizarContadores() {
  const todas = todasReceitas();
  const q = buscaAtual.toLowerCase();
  const cats = ["cafe", "almoco", "jantar", "lanche"];

  // conta total geral
  document.getElementById("count-todos").textContent = todas.filter(r =>
    !q || r.nome.toLowerCase().includes(q) || r.ingredientes.some(i => i.toLowerCase().includes(q))
  ).length;

  // conta por categoria
  cats.forEach(c => {
    document.getElementById("count-" + c).textContent = todas.filter(r =>
      r.categoria === c &&
      (!q || r.nome.toLowerCase().includes(q) || r.ingredientes.some(i => i.toLowerCase().includes(q)))
    ).length;
  });
}

/* Desenha os cards de receita na tela */
function renderCards() {
  const grid   = document.getElementById("recipesGrid");
  const noRes  = document.getElementById("noResults");
  const lista  = receitasFiltradas();

  if (lista.length === 0) {
    // nenhuma receita encontrada
    grid.innerHTML = "";
    noRes.style.display = "block";
  } else {
    noRes.style.display = "none";
    // cria o HTML de cada card
    grid.innerHTML = lista.map((r, i) => `
      <article class="recipe-card" onclick="abrirModal(${r.id})" style="animation-delay:${i * 40}ms">
        <div class="card-thumb" style="background:${r.bg}">
          <span>${r.emoji}</span>
          <span class="card-category-badge ${classeBadge(r.categoria)}">${textoCategoria(r.categoria)}</span>
          <button class="fav-btn ${favoritos.includes(r.id) ? "active" : ""}"
                  onclick="toggleFavorito(${r.id}, event)" title="Favoritar">
            ${favoritos.includes(r.id) ? "❤️" : "🤍"}
          </button>
        </div>
        <div class="card-body">
          <h3>${r.nome}</h3>
          <p>${r.desc}</p>
          <div class="card-meta">
            <span class="meta-item">⏱ ${r.tempo}</span>
            <span class="meta-item">
              <span class="dot dot-${r.dificuldade}"></span>
              ${textoDificuldade(r.dificuldade)}
            </span>
            <span class="meta-item">🍽 ${r.porcoes}</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="nutrition-pills">
            <span class="pill">${r.kcal} kcal</span>
            <span class="pill prot">${r.proteina}g prot.</span>
            <span class="pill carb">${r.carbs}g carb.</span>
          </div>
          <button class="view-btn">Ver receita →</button>
        </div>
      </article>
    `).join("");
  }
  atualizarContadores();
}

/* =====================
   MODAL DE RECEITA
   ===================== */

/* Abre o modal com os detalhes completos da receita */
function abrirModal(id) {
  const r = todasReceitas().find(x => x.id === id);
  if (!r) return;

  document.getElementById("modalContent").innerHTML = `
    <div class="modal-thumb" style="background:${r.bg}">
      <span>${r.emoji}</span>
      <button class="modal-close" onclick="fecharModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-top">
        <h2>${r.nome}</h2>
        <span class="card-category-badge ${classeBadge(r.categoria)}"
              style="white-space:nowrap;flex-shrink:0">${textoCategoria(r.categoria)}</span>
      </div>
      <div class="modal-meta">
        <div class="modal-meta-item">⏱ ${r.tempo}</div>
        <div class="modal-meta-item">🍽 ${r.porcoes}</div>
        <div class="modal-meta-item">
          <span class="dot dot-${r.dificuldade}"
                style="display:inline-block;width:8px;height:8px;border-radius:50%"></span>
          ${textoDificuldade(r.dificuldade)}
        </div>
      </div>
      <p class="modal-desc">${r.desc}</p>

      <div class="nutrition-grid">
        <div class="nutri-item"><span class="nutri-value">${r.kcal}</span><span class="nutri-label">Calorias</span></div>
        <div class="nutri-item"><span class="nutri-value">${r.proteina}g</span><span class="nutri-label">Proteínas</span></div>
        <div class="nutri-item"><span class="nutri-value">${r.carbs}g</span><span class="nutri-label">Carboidratos</span></div>
        <div class="nutri-item"><span class="nutri-value">${r.gordura}g</span><span class="nutri-label">Gorduras</span></div>
      </div>

      <p class="modal-section-title">🛒 Ingredientes</p>
      <ul class="ingredients-list">
        ${r.ingredientes.map(i => `<li>${i}</li>`).join("")}
      </ul>

      <p class="modal-section-title">👨‍🍳 Modo de Preparo</p>
      <ol class="steps-list">
        ${r.passos.map((s, idx) => `
          <li><span class="step-num">${idx + 1}</span><span>${s}</span></li>
        `).join("")}
      </ol>
    </div>
  `;

  // abre o modal e trava a rolagem da página
  document.getElementById("modalBackdrop").classList.add("open");
  document.body.style.overflow = "hidden";
}

/* Fecha o modal */
function fecharModal() {
  document.getElementById("modalBackdrop").classList.remove("open");
  document.body.style.overflow = "";
}

/* ============================================
   MINIJOGO — HORTA NUTRI (estilo Stardew)
   ============================================ */

/* Lista de canteiros com culturas e fatos nutricionais */
const canteiros = [
  { emoji: "🥕", nome: "Cenoura",   fato: "Rica em beta-caroteno, que protege os olhos e dá brilho à pele!" },
  { emoji: "🥦", nome: "Brócolis",  fato: "Um superalimento! Rico em vitamina C, fibras e antioxidantes." },
  { emoji: "🍅", nome: "Tomate",    fato: "O licopeno do tomate protege o coração e combate o envelhecimento." },
  { emoji: "🫑", nome: "Pimentão",  fato: "Tem mais vitamina C que a laranja! Ótimo para a imunidade." },
  { emoji: "🌽", nome: "Milho",     fato: "Fonte de fibras e energia duradoura para aguentar o dia todo!" },
  { emoji: "🍓", nome: "Morango",   fato: "Cheio de vitamina C e antioxidantes. Delicioso e muito saudável!" },
  { emoji: "🥬", nome: "Alface",    fato: "Hidratante e rica em folato. Essencial para a saúde das células." },
  { emoji: "🧅", nome: "Cebola",    fato: "Antibacteriana e anti-inflamatória. Uma aliada poderosa da saúde!" },
  { emoji: "🍆", nome: "Berinjela", fato: "Baixa em calorias, rica em fibras. Perfeita para manter o peso." },
  { emoji: "🫛", nome: "Vagem",     fato: "Combina proteína vegetal com fibras. Uma dupla perfeita no prato!" },
  { emoji: "🥒", nome: "Pepino",    fato: "É 99% água! Hidratante natural, ótimo nos dias quentes." },
  { emoji: "🌿", nome: "Ervas",     fato: "Manjericão, alecrim e hortelã têm propriedades medicinais únicas!" },
];

/* Estado de cada canteiro: 'ready', 'growing' ou 'empty' */
let estadoCanteiros = canteiros.map(() => "ready");

/* Pontuação de saúde do jogador */
let pontosJogo = 0;

/* Renderiza o jardim na tela */
function renderJardim() {
  const grid = document.getElementById("gardenGrid");
  if (!grid) return; // sai se a seção não existir

  grid.innerHTML = canteiros.map((c, i) => {
    const estado = estadoCanteiros[i];
    let emojiMostrado = "";
    let label = "";

    if (estado === "ready") {
      emojiMostrado = c.emoji; // planta pronta para colher
      label = "COLHER";
    } else if (estado === "growing") {
      emojiMostrado = "🌱"; // crescendo ainda
      label = "CRESCENDO";
    } else {
      emojiMostrado = "🟫"; // canteiro vazio
      label = "VAZIO";
    }

    return `
      <div class="plot ${estado}" id="plot-${i}" onclick="colherPlanta(${i})" title="${c.nome}">
        <span class="plot-emoji">${emojiMostrado}</span>
        <span class="plot-label">${label}</span>
      </div>
    `;
  }).join("");
}

/* Lida com o clique no canteiro */
function colherPlanta(idx) {
  const estado = estadoCanteiros[idx];

  if (estado === "ready") {
    // colhe a planta e mostra o fato nutricional
    estadoCanteiros[idx] = "empty";
    pontosJogo += 10;
    atualizarPontos();
    mostrarFato(canteiros[idx]);

    // anima o canteiro
    const plot = document.getElementById("plot-" + idx);
    plot.classList.add("harvesting");
    setTimeout(() => plot.classList.remove("harvesting"), 400);

    renderJardim();

    // depois de 3 segundos começa a crescer de novo
    setTimeout(() => {
      estadoCanteiros[idx] = "growing";
      renderJardim();
      // depois de mais 5 segundos fica pronto novamente
      setTimeout(() => {
        estadoCanteiros[idx] = "ready";
        renderJardim();
      }, 5000);
    }, 3000);

  } else if (estado === "empty") {
    // canteiro vazio: planta uma semente
    estadoCanteiros[idx] = "growing";
    renderJardim();
    setTimeout(() => {
      estadoCanteiros[idx] = "ready";
      renderJardim();
    }, 5000);
  }
  // se estiver "growing", não faz nada
}

/* Mostra o fato nutricional no balão */
function mostrarFato(canteiro) {
  const balao = document.getElementById("factBubble");
  if (!balao) return;
  balao.classList.remove("empty");
  balao.innerHTML = `<p><strong>${canteiro.emoji} ${canteiro.nome}:</strong> ${canteiro.fato}</p>`;
}

/* Atualiza os pontos de saúde na tela */
function atualizarPontos() {
  const el = document.getElementById("gameScore");
  if (!el) return;
  // cada 10 pontos = 1 coração cheio
  const coracoes = Math.min(Math.floor(pontosJogo / 10), 10);
  const vazios   = 10 - coracoes;
  el.querySelector(".score-hearts").textContent =
    "❤️".repeat(coracoes) + "🤍".repeat(vazios);
  el.querySelector(".score-num").textContent = pontosJogo;
}

/* ============================================
   PAINEL DO DONO — adicionar receitas
   Acessível com Ctrl + Shift + A
   Senha: nutrivida
   ============================================ */

let adminLogado = false; // controla se o dono está logado

/* Abre o painel do admin */
function abrirAdmin() {
  document.getElementById("adminOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  if (!adminLogado) {
    mostrarTelaLogin();
  } else {
    mostrarFormulario();
  }
}

/* Fecha o painel do admin */
function fecharAdmin() {
  document.getElementById("adminOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* Mostra a tela de senha */
function mostrarTelaLogin() {
  document.getElementById("adminConteudo").innerHTML = `
    <div class="admin-login">
      <p>Digite a senha para acessar o painel do dono:</p>
      <div class="form-group">
        <input type="password" id="senhaInput" placeholder="Senha secreta..."
               onkeydown="if(event.key==='Enter') verificarSenha()" />
      </div>
      <button class="btn-save" onclick="verificarSenha()">🔓 Entrar</button>
      <div id="erroSenha" style="color:#e11d48;margin-top:12px;font-size:.85rem;display:none">
        Senha incorreta. Tente novamente.
      </div>
    </div>
  `;
  setTimeout(() => document.getElementById("senhaInput")?.focus(), 100);
}

/* Verifica se a senha está certa */
function verificarSenha() {
  const senha = document.getElementById("senhaInput")?.value;
  if (senha === "nutrivida") {
    // senha correta — entra no painel
    adminLogado = true;
    mostrarFormulario();
  } else {
    // senha errada — mostra erro
    document.getElementById("erroSenha").style.display = "block";
  }
}

/* Mostra o formulário para adicionar receitas */
function mostrarFormulario() {
  document.getElementById("adminConteudo").innerHTML = `
    <h3 style="font-size:1rem;font-weight:800;color:#374151;margin-bottom:20px">
      ➕ Nova Receita
    </h3>

    <div class="form-row">
      <div class="form-group">
        <label>Emoji da receita</label>
        <input type="text" id="f-emoji" placeholder="ex: 🥗" maxlength="2" />
      </div>
      <div class="form-group">
        <label>Categoria</label>
        <select id="f-cat">
          <option value="cafe">☀️ Café da Manhã</option>
          <option value="almoco">🌿 Almoço</option>
          <option value="jantar">🌙 Jantar</option>
          <option value="lanche">🍎 Lanche</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label>Nome da receita</label>
      <input type="text" id="f-nome" placeholder="ex: Salada de Quinoa com Abacate" />
    </div>

    <div class="form-group">
      <label>Descrição curta</label>
      <textarea id="f-desc" rows="2" placeholder="Uma frase descrevendo a receita..."></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Tempo de preparo</label>
        <input type="text" id="f-tempo" placeholder="ex: 25 min" />
      </div>
      <div class="form-group">
        <label>Porções</label>
        <input type="text" id="f-porcoes" placeholder="ex: 2 porções" />
      </div>
    </div>

    <div class="form-group">
      <label>Dificuldade</label>
      <select id="f-dif">
        <option value="easy">Fácil</option>
        <option value="medium">Médio</option>
        <option value="hard">Difícil</option>
      </select>
    </div>

    <p style="font-size:.85rem;font-weight:700;color:#374151;margin-bottom:10px">
      Informação Nutricional (por porção)
    </p>
    <div class="form-row-4">
      <div class="form-group">
        <label>Calorias</label>
        <input type="number" id="f-kcal" placeholder="320" />
      </div>
      <div class="form-group">
        <label>Proteínas (g)</label>
        <input type="number" id="f-prot" placeholder="18" />
      </div>
      <div class="form-group">
        <label>Carboidratos (g)</label>
        <input type="number" id="f-carbs" placeholder="40" />
      </div>
      <div class="form-group">
        <label>Gorduras (g)</label>
        <input type="number" id="f-gord" placeholder="8" />
      </div>
    </div>

    <div class="form-group">
      <label>Ingredientes (um por linha)</label>
      <textarea id="f-ing" rows="5" placeholder="200g de frango grelhado
1 xícara de quinoa
½ abacate
..."></textarea>
    </div>

    <div class="form-group">
      <label>Passos do preparo (um por linha)</label>
      <textarea id="f-passos" rows="5" placeholder="Cozinhe a quinoa por 15 minutos.
Tempere o frango e grelhe.
Monte o prato e sirva.
..."></textarea>
    </div>

    <button class="btn-save" onclick="salvarReceita()">💾 Salvar Receita</button>
    <div class="save-success" id="msgSucesso">✅ Receita salva com sucesso!</div>

    <div class="custom-recipes-list" id="listaCustom"></div>
  `;

  renderListaCustom(); // mostra as receitas já salvas
}

/* Salva a nova receita no localStorage */
function salvarReceita() {
  // pega os valores do formulário
  const nome    = document.getElementById("f-nome").value.trim();
  const emoji   = document.getElementById("f-emoji").value.trim() || "🍽️";
  const cat     = document.getElementById("f-cat").value;
  const desc    = document.getElementById("f-desc").value.trim();
  const tempo   = document.getElementById("f-tempo").value.trim();
  const porcoes = document.getElementById("f-porcoes").value.trim();
  const dif     = document.getElementById("f-dif").value;
  const kcal    = parseInt(document.getElementById("f-kcal").value) || 0;
  const prot    = parseInt(document.getElementById("f-prot").value) || 0;
  const carbs   = parseInt(document.getElementById("f-carbs").value) || 0;
  const gord    = parseInt(document.getElementById("f-gord").value) || 0;
  const ing     = document.getElementById("f-ing").value.trim().split("\n").filter(l => l.trim());
  const passos  = document.getElementById("f-passos").value.trim().split("\n").filter(l => l.trim());

  // verifica campos obrigatórios
  if (!nome || !desc || ing.length === 0 || passos.length === 0) {
    alert("Preencha pelo menos: nome, descrição, ingredientes e passos.");
    return;
  }

  // cria o objeto da receita
  const customList = carregarReceitasCustom();
  const novaReceita = {
    id: Date.now(), // ID único baseado na hora
    nome, emoji, categoria: cat, desc, tempo, porcoes, dificuldade: dif,
    kcal, proteina: prot, carbs, gordura: gord,
    ingredientes: ing,
    passos,
    bg: gerarGradiente(cat), // cor de fundo automática pela categoria
  };

  customList.push(novaReceita);
  window.salvarReceitaFirebase(novaReceita);

  // mostra mensagem de sucesso e atualiza tudo
  document.getElementById("msgSucesso").style.display = "block";
  setTimeout(() => {
    if (document.getElementById("msgSucesso"))
      document.getElementById("msgSucesso").style.display = "none";
  }, 3000);

  renderListaCustom();
  renderCards(); // atualiza o grid principal
}

/* Gera um gradiente automático baseado na categoria */
function gerarGradiente(cat) {
  const gradientes = {
    cafe:   "linear-gradient(135deg,#fef3e2,#fde8c8)",
    almoco: "linear-gradient(135deg,#e8f5f4,#c8e8e5)",
    jantar: "linear-gradient(135deg,#e8f4fd,#c8e0f0)",
    lanche: "linear-gradient(135deg,#fef8ec,#fdefd0)",
  };
  return gradientes[cat] || "linear-gradient(135deg,#e8f5f4,#c8e8e5)";
}

/* Renderiza a lista de receitas personalizadas no admin */
function renderListaCustom() {
  const lista = carregarReceitasCustom();
  const el    = document.getElementById("listaCustom");
  if (!el) return;

  if (lista.length === 0) {
    el.innerHTML = "";
    return;
  }

  el.innerHTML = `
    <h3>📋 Suas receitas adicionadas (${lista.length})</h3>
    ${lista.map(r => `
      <div class="custom-recipe-item">
        <span>${r.emoji} ${r.nome}</span>
        <button class="btn-delete" onclick="deletarReceita(${r.id})">🗑 Deletar</button>
      </div>
    `).join("")}
  `;
}

/* Deleta uma receita personalizada pelo ID */
function window.deletarReceitaFirebase(id); {
  if (!confirm("Tem certeza que quer deletar esta receita?")) return;
  let lista = carregarReceitasCustom();
  lista = lista.filter(r => r.id !== id); // remove a receita da lista
  localStorage.setItem("nutrivida_custom", JSON.stringify(lista));
  renderListaCustom();
  renderCards(); // atualiza o grid principal
}

/* =====================
   EVENTOS DE INTERFACE
   ===================== */

/* Filtra ao clicar nos botões de categoria */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    categoriaAtiva = btn.dataset.cat;
    renderCards();
  });
});

/* Busca em tempo real ao digitar */
document.getElementById("searchInput").addEventListener("input", e => {
  buscaAtual = e.target.value;
  renderCards();
});

/* Fecha modal ao clicar no fundo escuro */
document.getElementById("modalBackdrop").addEventListener("click", e => {
  if (e.target === document.getElementById("modalBackdrop")) fecharModal();
});

/* Fecha admin ao clicar no fundo escuro */
document.getElementById("adminOverlay").addEventListener("click", e => {
  if (e.target === document.getElementById("adminOverlay")) fecharAdmin();
});

/* Tecla Escape fecha modals abertos */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    fecharModal();
    fecharAdmin();
  }
  // Ctrl + Shift + A abre o painel do dono (atalho secreto)
  if (e.ctrlKey && e.shiftKey && e.key === "A") {
    e.preventDefault();
    abrirAdmin();
  }
});

/* =====================
   INICIALIZAÇÃO
   Roda assim que a página carrega
   ===================== */
renderCards();  // mostra os cards de receita
renderJardim(); // monta o jardim do minijogo
atualizarPontos(); // inicia a pontuação zerada

document.addEventListener("DOMContentLoaded", () => {

  /* FILTROS */
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      categoriaAtiva = btn.dataset.cat;
      renderCards();
    });
  });

  /* BUSCA */
  const search = document.getElementById("searchInput");
  if (search) {
    search.addEventListener("input", e => {
      buscaAtual = e.target.value;
      renderCards();
    });
  }

  /* MODAL FECHA CLICK FORA */
  const modal = document.getElementById("modalBackdrop");
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) fecharModal();
    });
  }

  /* ADMIN FECHA CLICK FORA */
  const admin = document.getElementById("adminOverlay");
  if (admin) {
    admin.addEventListener("click", e => {
      if (e.target === admin) fecharAdmin();
    });
  }

  /* TECLAS */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      fecharModal();
      fecharAdmin();
    }

    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
      e.preventDefault();
      abrirAdmin();
    }
  });

});
function openCredits() {
  document.getElementById("creditsModalBox").classList.add("active");
}

function closeCredits() {
  document.getElementById("creditsModalBox").classList.remove("active");
}

// fecha só clicando no fundo
document.addEventListener("click", (e) => {
  const modal = document.getElementById("creditsModalBox");
  if (!modal) return;

  if (e.target === modal) {
    closeCredits();
  }
});

// ESC fecha também
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCredits();
});
function renderRecipes() {
  const grid = document.getElementById("recipesGrid");
  grid.innerHTML = "";

  if (recipes.length === 0) {
    document.getElementById("noResults").style.display = "block";
    return;
  }

  document.getElementById("noResults").style.display = "none";
}
async function testarFirebase() {
  await salvarReceita({
    nome: "Teste",
    categoria: "cafe",
    ingredientes: "ovo, pão",
    modo: "misturar"
  });

  console.log("🔥 Receita salva no Firestore!");
}

testarFirebase();
async function carregarTudo() {
  if (window.carregarReceitasFirebase) {
    receitas = await window.carregarReceitasFirebase();
    renderCards();
  }
}

carregarTudo();
