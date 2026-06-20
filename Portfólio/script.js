const cards = document.getElementById("cards");

const modal = document.getElementById("modal");
const frame = document.getElementById("projectFrame");
const closeModal = document.getElementById("closeModal");

projetos.forEach(projeto => {

const card = document.createElement("div");

card.className = "card";

card.innerHTML = `
<img src="${projeto.imagem}">
<div class="card-content">

<h3>${projeto.nome}</h3>

<p>${projeto.descricao}</p>

<div class="tags">
<span>HTML</span>
<span>CSS</span>
<span>JS</span>
</div>

<button>Abrir Projeto</button>

</div>
`;

card.querySelector("button").onclick = () => {

modal.classList.add("active");

frame.src = projeto.arquivo;

};

cards.appendChild(card);

});

closeModal.onclick = () => {

modal.classList.remove("active");

frame.src = "";

};
