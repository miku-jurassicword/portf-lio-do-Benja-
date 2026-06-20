const cards = document.getElementById("cards");

projetos.forEach(projeto => {

    const div = document.createElement("div");

    div.className = "project";

    div.innerHTML = `
    
        <div class="project-info">
            <h3>${projeto.nome}</h3>
            <p>${projeto.descricao}</p>
        </div>

        <button class="open">
            Abrir →
        </button>

    `;

    div.querySelector(".open").onclick = () => {

        window.location.href = projeto.arquivo;

    };

    cards.appendChild(div);

});
