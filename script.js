/* ============================================================
   PORTFÓLIO DE BENJAMIM — script.js
   Controla: projetos, filtros, modal, animações
   ============================================================ */

/* ============================================================
   DADOS DOS PROJETOS
   Para adicionar um novo projeto, copie um objeto abaixo
   e preencha os campos. Coloque o arquivo em public/projects/
   ============================================================ */
const projects = [
  {
    id: "radar-saude",
    title: "Radar Saúde",
    description:
      "Aplicação web para localizar e avaliar hospitais públicos do Brasil com dados em tempo real, filtros por estado e tipo de serviço.",
    longDescription:
      "O Radar Saúde é um projeto que aproxima os brasileiros dos serviços de saúde pública. Com uma interface intuitiva, o usuário consegue localizar hospitais próximos, ver avaliações e entender a disponibilidade de serviços como UTI, emergência e cirurgia. Desenvolvido inteiramente em HTML, CSS e JavaScript puro — sem dependências externas.",
    category: "js",
    technologies: ["HTML", "CSS", "JavaScript", "Geolocalização"],
    featured: true,
    fileUrl: "./projects/radar-saude.html",
    fileLabel: "Abrir Projeto",
    githubUrl: "",
    demoUrl: "./projects/radar-saude.html",
    createdAt: "2025",
  },
  /*
   * TEMPLATE — copie aqui para adicionar novo projeto:
   *
   * {
   *   id: "meu-projeto",
   *   title: "Nome do Projeto",
   *   description: "Descrição curta (aparece no card).",
   *   longDescription: "Descrição completa (aparece no modal).",
   *   category: "js",         // "js" | "python" | "game" | "other"
   *   technologies: ["Tag1", "Tag2"],
   *   featured: false,
   *   fileUrl: "./projects/arquivo.html",  // arquivo que pode ser aberto
   *   fileLabel: "Abrir Projeto",
   *   githubUrl: "https://github.com/...",
   *   demoUrl: "",
   *   createdAt: "2025",
   * },
   */
];

/* ============================================================
   CONSTANTES
   ============================================================ */
const CATEGORY_LABELS = {
  all:    "Todos",
  js:     "JavaScript",
  python: "Python",
  game:   "Games",
  other:  "Outros",
};

const BADGE_CLASS = {
  js:     "badge-js",
  python: "badge-python",
  game:   "badge-game",
  other:  "badge-other",
};

const STRIPE_CLASS = {
  js:     "card-stripe-js",
  python: "card-stripe-python",
  game:   "card-stripe-game",
  other:  "card-stripe-other",
};

/* ============================================================
   ESTADO
   ============================================================ */
let currentFilter = "all";

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("footer-year").textContent = new Date().getFullYear();

  initTyping();
  renderProjects();
  initFilters();
  initModal();
  initViewer();
  initProjectsSidebar();
  initNavbarScroll();
  initCounters();
});

/* ============================================================
   ANIMAÇÃO DE TYPING NO HERO
   ============================================================ */
function initTyping() {
  const phrases = [
    "init_system()",
    "const dev = 'Benjamim'",
    "import python_magic",
    "game.run()",
    "console.log('hello!')",
  ];
  const el = document.getElementById("typed-text");
  if (!el) return;

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (paused) {
      paused = false;
      setTimeout(tick, deleting ? 500 : 1800);
      return;
    }

    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        deleting = true;
        paused = true;
        setTimeout(tick, 80);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        paused = true;
        setTimeout(tick, 80);
        return;
      }
    }

    setTimeout(tick, deleting ? 45 : 90);
  }

  tick();
}

/* ============================================================
   CONTADORES DE STATS (animação count-up)
   ============================================================ */
function initCounters() {
  const counts = {
    total:  projects.length,
    js:     projects.filter((p) => p.category === "js").length,
    py:     projects.filter((p) => p.category === "python").length,
    game:   projects.filter((p) => p.category === "game").length,
  };

  updateFilterCounts();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount("stat-total", counts.total);
          animateCount("stat-js",    counts.js);
          animateCount("stat-py",    counts.py);
          animateCount("stat-game",  counts.game);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  const bar = document.getElementById("stats-bar");
  if (bar) observer.observe(bar);
}

function animateCount(elId, target) {
  const el = document.getElementById(elId);
  if (!el) return;
  const duration = 1200;
  const fps = 60;
  const total = Math.round(duration / (1000 / fps));
  let frame = 0;

  const timer = setInterval(() => {
    frame++;
    const progress = frame / total;
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (frame >= total) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, 1000 / fps);
}

/* ============================================================
   RENDERIZAR PROJETOS
   ============================================================ */
function getFilteredProjects() {
  if (currentFilter === "all") return projects;
  return projects.filter((p) => p.category === currentFilter);
}

function renderProjects() {
  const grid = document.getElementById("projects-grid");
  const countEl = document.getElementById("projects-count");
  if (!grid) return;

  const filtered = getFilteredProjects();

  countEl.textContent =
    filtered.length === 1
      ? "1 projeto"
      : `${filtered.length} projetos`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 24px; color:var(--text-muted);">
        <div style="font-size:2.5rem; margin-bottom:16px;">◌</div>
        <div style="font-size:1rem; margin-bottom:8px; color:var(--text);">Nenhum projeto nessa categoria ainda</div>
        <div style="font-size:0.85rem;">Em breve...</div>
      </div>`;
    return;
  }

  grid.innerHTML = filtered
    .map((p, i) => createCardHTML(p, i))
    .join("");

  grid.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.projectId;
      openModal(id);
    });
  });
}

function createCardHTML(project, index) {
  const delay = index * 60;
  return `
    <div class="project-card category-${project.category}"
         data-project-id="${project.id}"
         style="animation-delay: ${delay}ms">
      <div class="card-stripe ${STRIPE_CLASS[project.category] || STRIPE_CLASS.other}"></div>
      <div class="card-body">
        <div class="card-top">
          <div class="card-title">${project.title}</div>
          <span class="card-badge ${BADGE_CLASS[project.category] || BADGE_CLASS.other}">
            ${CATEGORY_LABELS[project.category] || "Outro"}
          </span>
        </div>
        <p class="card-desc">${project.description}</p>
        <div class="card-techs">
          ${project.technologies.slice(0, 4).map((t) => `<span class="tech-tag">${t}</span>`).join("")}
        </div>
        <button class="card-action">
          Ver projeto →
        </button>
      </div>
    </div>`;
}

/* ============================================================
   FILTROS
   ============================================================ */
function initFilters() {
  updateFilterCounts();

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;

      document.querySelectorAll(".filter-btn").forEach((b) =>
        b.classList.remove("active")
      );
      btn.classList.add("active");

      renderProjects();
    });
  });
}

function updateFilterCounts() {
  const counts = {
    all:    projects.length,
    js:     projects.filter((p) => p.category === "js").length,
    python: projects.filter((p) => p.category === "python").length,
    game:   projects.filter((p) => p.category === "game").length,
  };

  for (const [key, val] of Object.entries(counts)) {
    const el = document.getElementById(`fc-${key}`);
    if (el) el.textContent = val;
  }
}

/* ============================================================
   MODAL
   ============================================================ */
function initModal() {
  const backdrop = document.getElementById("modal-backdrop");
  const closeBtn = document.getElementById("modal-close");

  if (!backdrop || !closeBtn) return;

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function openModal(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;

  const backdrop = document.getElementById("modal-backdrop");
  const content  = document.getElementById("modal-content");
  if (!backdrop || !content) return;

  const stripeClass = STRIPE_CLASS[project.category] || STRIPE_CLASS.other;
  const badgeClass  = BADGE_CLASS[project.category]  || BADGE_CLASS.other;
  const fileUrl     = project.fileUrl || project.demoUrl || "";

  let actionsHTML = "";

  /* Botão principal: abre dentro do portfólio (iframe) */
  if (fileUrl) {
    actionsHTML += `
      <button
        class="modal-btn modal-btn-primary"
        onclick="openViewer('${project.id}')"
      >▶ Abrir aqui</button>`;
  }

  /* Botão secundário: abre em nova aba */
  if (fileUrl) {
    actionsHTML += `
      <a href="${fileUrl}" target="_blank" rel="noopener" class="modal-btn modal-btn-outline">
        ↗ Nova aba
      </a>`;
  }

  /* GitHub */
  if (project.githubUrl) {
    actionsHTML += `
      <a href="${project.githubUrl}" target="_blank" rel="noopener" class="modal-btn modal-btn-outline">
        GitHub
      </a>`;
  }

  content.innerHTML = `
    <div class="modal-stripe ${stripeClass}"
         style="margin:-32px -32px 24px;border-radius:18px 18px 0 0;height:5px;"></div>
    <div class="modal-header">
      <h2 class="modal-title">${project.title}</h2>
      <span class="modal-badge ${badgeClass}">${CATEGORY_LABELS[project.category]}</span>
    </div>
    <p class="modal-desc">${project.longDescription || project.description}</p>
    <div class="modal-section-title">Tecnologias</div>
    <div class="modal-techs">
      ${project.technologies.map((t) => `<span class="modal-tech">${t}</span>`).join("")}
    </div>
    ${project.createdAt
      ? `<div class="modal-section-title" style="margin-top:16px;">Ano</div>
         <div style="color:var(--text-muted);font-size:0.9rem;">${project.createdAt}</div>`
      : ""}
    ${actionsHTML ? `<div class="modal-actions">${actionsHTML}</div>` : ""}
  `;

  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const backdrop = document.getElementById("modal-backdrop");
  if (!backdrop) return;
  backdrop.classList.remove("open");
  document.body.style.overflow = "";
}

/* ============================================================
   VISUALIZADOR EMBUTIDO (iframe fullscreen dentro do portfólio)
   ============================================================ */
function openViewer(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;

  const url = project.fileUrl || project.demoUrl;
  if (!url) return;

  const overlay  = document.getElementById("viewer-overlay");
  const frame    = document.getElementById("viewer-frame");
  const title    = document.getElementById("viewer-title");
  const external = document.getElementById("viewer-external");

  if (!overlay || !frame) return;

  title.textContent    = project.title;
  external.href        = url;
  frame.src            = url;

  closeModal();
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeViewer() {
  const overlay = document.getElementById("viewer-overlay");
  const frame   = document.getElementById("viewer-frame");
  if (!overlay) return;
  overlay.classList.remove("open");
  if (frame) frame.src = "";
  document.body.style.overflow = "";
}

function initViewer() {
  const closeBtn = document.getElementById("viewer-close");
  if (closeBtn) closeBtn.addEventListener("click", closeViewer);

  document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("viewer-overlay");
    if (e.key === "Escape" && overlay?.classList.contains("open")) {
      closeViewer();
    }
  });
}

/* ============================================================
   BARRA LATERAL DE PROJETOS
   ============================================================ */
let sidebarFilter = "all";
let sidebarSearch = "";

function initProjectsSidebar() {
  const toggle   = document.getElementById("sidebar-toggle");
  const sidebar  = document.getElementById("projects-sidebar");
  const closeBtn = document.getElementById("psidebar-close");
  const backdrop = document.getElementById("psidebar-backdrop");
  const searchEl = document.getElementById("psidebar-search-input");

  if (!toggle || !sidebar) return;

  toggle.addEventListener("click", toggleSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  backdrop?.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("open")) closeSidebar();
  });

  searchEl?.addEventListener("input", (e) => {
    sidebarSearch = e.target.value.toLowerCase();
    renderSidebarList();
  });

  document.querySelectorAll(".psidebar-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      sidebarFilter = btn.dataset.sfilter;
      document.querySelectorAll(".psidebar-filter").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderSidebarList();
    });
  });

  renderSidebarList();
}

function toggleSidebar() {
  const sidebar  = document.getElementById("projects-sidebar");
  const toggle   = document.getElementById("sidebar-toggle");
  const backdrop = document.getElementById("psidebar-backdrop");
  if (!sidebar) return;

  const isOpen = sidebar.classList.contains("open");
  if (isOpen) {
    closeSidebar();
  } else {
    sidebar.classList.add("open");
    toggle?.classList.add("active");
    backdrop?.classList.add("visible");
    document.getElementById("psidebar-search-input")?.focus();
  }
}

function closeSidebar() {
  document.getElementById("projects-sidebar")?.classList.remove("open");
  document.getElementById("sidebar-toggle")?.classList.remove("active");
  document.getElementById("psidebar-backdrop")?.classList.remove("visible");
}

const CATEGORY_ICON = {
  js:     { emoji: "⚡", cls: "icon-js" },
  python: { emoji: "🐍", cls: "icon-python" },
  game:   { emoji: "🎮", cls: "icon-game" },
  other:  { emoji: "◈",  cls: "icon-other" },
};

function renderSidebarList() {
  const list     = document.getElementById("psidebar-list");
  const countEl  = document.getElementById("psidebar-count");
  if (!list) return;

  const filtered = projects.filter((p) => {
    const matchCat    = sidebarFilter === "all" || p.category === sidebarFilter;
    const matchSearch = !sidebarSearch ||
      p.title.toLowerCase().includes(sidebarSearch) ||
      p.technologies.some((t) => t.toLowerCase().includes(sidebarSearch));
    return matchCat && matchSearch;
  });

  if (countEl) {
    countEl.innerHTML = `<span>${filtered.length}</span> projeto${filtered.length !== 1 ? "s" : ""}`;
  }

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="psidebar-empty">
        <div class="psidebar-empty-icon">◌</div>
        Nenhum projeto encontrado
      </div>`;
    return;
  }

  list.innerHTML = filtered.map((p) => {
    const cat = CATEGORY_ICON[p.category] || CATEGORY_ICON.other;
    return `
    <div class="psidebar-item" data-project-id="${p.id}">
      <div class="psidebar-item-icon ${cat.cls}">${cat.emoji}</div>
      <div class="psidebar-item-info">
        <div class="psidebar-item-name">${p.title}</div>
        <div class="psidebar-item-tech">${p.technologies.slice(0, 3).join(" · ")}</div>
      </div>
      <div class="psidebar-item-arrow">›</div>
    </div>`;
  }).join("");

  list.querySelectorAll(".psidebar-item").forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.projectId;
      closeSidebar();
      setTimeout(() => openModal(id), 180);
    });
  });
}

/* ============================================================
   NAVBAR — efeito de scroll
   ============================================================ */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    },
    { passive: true }
  );
}
