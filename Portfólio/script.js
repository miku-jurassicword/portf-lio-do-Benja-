const cards = document.getElementById("cards");

const modal = document.getElementById("modal");
const viewer = document.getElementById("viewer");
const closeBtn = document.getElementById("close");

projetos.forEach(projeto => {

const card = document.createElement("div");

card.className = "card";

card.innerHTML = `
<img src="${projeto.imagem}">
<div class="content">

<h3>${projeto.nome}</h3>

<p>${projeto.descricao}</p>

<button>Abrir Projeto</button>

</div>
`;

card.querySelector("button").onclick = () => {

viewer.src = projeto.arquivo;
modal.classList.add("active");

};

cards.appendChild(card);

});

closeBtn.onclick = () => {

viewer.src = "";
modal.classList.remove("active");

};
