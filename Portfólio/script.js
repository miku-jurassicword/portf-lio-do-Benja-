const cards = document.getElementById("cards");

const search = document.getElementById("search");

const buttons =
document.querySelectorAll("[data-filter]");

let filtro = "all";

function renderProjetos(){

cards.innerHTML = "";

const texto =
search.value.toLowerCase();

const filtrados =
projetos.filter(projeto => {

const nome =
projeto.nome.toLowerCase();

const busca =
nome.includes(texto);

const categoria =
filtro === "all" ||
projeto.categoria === filtro ||
projeto.linguagem === filtro;

return busca && categoria;

});

filtrados.forEach(projeto => {

const div =
document.createElement("div");

div.className = "project";

div.innerHTML = `

<div class="project-info">

<h3>${projeto.nome}</h3>

<p>${projeto.descricao}</p>

<div class="tags">

<span>${projeto.categoria}</span>
<span>${projeto.linguagem}</span>

</div>

</div>

<button class="open">
Abrir →
</button>

`;

div
.querySelector(".open")
.onclick = () => {

window.location.href =
projeto.arquivo;

};

cards.appendChild(div);

});

}

search.addEventListener(
"input",
renderProjetos
);

buttons.forEach(btn => {

btn.onclick = () => {

filtro =
btn.dataset.filter;

renderProjetos();

};

});

renderProjetos();

const sidebar =
document.querySelector(".sidebar");

document
.getElementById("toggleSidebar")
.onclick = () => {

sidebar.classList.toggle(
"collapsed"
);

};
