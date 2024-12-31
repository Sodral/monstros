const monstros = [
    { nome: "Dragão Vermelho", tipo: "Dragão", hp: 300, habilidades: "Fogo, Voo" },
    { nome: "Troll", tipo: "Gigante", hp: 120, habilidades: "Regeneração" },
    { nome: "Lobo Fantasma", tipo: "Animal", hp: 80, habilidades: "Velocidade, Furtividade" },
];

const search = document.getElementById('search');
const results = document.getElementById('results');

function renderMonstros(filter = "") {
    results.innerHTML = ""; // Limpa os resultados
    monstros
        .filter(m => m.nome.toLowerCase().includes(filter.toLowerCase()))
        .forEach(m => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerText = m.nome;
            card.onclick = () => alert(`Nome: ${m.nome}\nTipo: ${m.tipo}\nHP: ${m.hp}\nHabilidades: ${m.habilidades}`);
            results.appendChild(card);
        });
}

search.addEventListener("input", (e) => renderMonstros(e.target.value));

// Renderiza os monstros inicialmente
renderMonstros();
