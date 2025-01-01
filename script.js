document.addEventListener("DOMContentLoaded", () => {
    const csvFilePath = "monster_database.csv"; // Nome do arquivo
    let monstersData = [];

    // Função para carregar o CSV
    function loadCSV() {
        Papa.parse(csvFilePath, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                monstersData = results.data.filter(row => row.Name && row.Name.trim() !== "");
                monstersData.forEach(monster => {
                    if (monster["Challenge Rating"]) {
                        monster["Challenge Rating"] = monster["Challenge Rating"].trim();
                    }
                });
                populateFilters();
            }
        });
    }

    // Função para filtrar monstros
    function filterMonsters() {
        const name = document.getElementById("search-name").value.toLowerCase();
        const type = document.getElementById("filter-type").value;
        const cr = document.getElementById("filter-cr").value;

        const filtered = monstersData.filter(monster => {
            return (
                (!name || monster.Name.toLowerCase().includes(name)) &&
                (!type || monster.Type === type) &&
                (!cr || monster["Challenge Rating"] === cr)
            );
        });

        displayResults(filtered);
    }

    // Função para exibir resultados como cards
    function displayResults(monsters) {
        const resultsContainer = document.getElementById("results-container");
        if (!resultsContainer) {
            console.error("Results container not found.");
            return;
        }

        resultsContainer.innerHTML = "";

        if (monsters.length > 0) {
            monsters.forEach(monster => {
                const card = document.createElement("div");
                card.className = "monster-card";
                card.addEventListener("click", () => openModal(monster)); // Ao clicar, abre o modal

                const name = document.createElement("h3");
                name.textContent = monster.Name;

                const hitDice = document.createElement("p");
                hitDice.textContent = `Hit Dice: ${monster["Hit Dice"] || "N/A"}`;

                const cr = document.createElement("p");
                cr.textContent = `Challenge Rating: ${monster["Challenge Rating"] || "N/A"}`;

                card.appendChild(name);
                card.appendChild(hitDice);
                card.appendChild(cr);
                resultsContainer.appendChild(card);
            });
        } else {
            resultsContainer.textContent = "No results found.";
        }
    }

    // Função para abrir o modal
    function openModal(monster) {
        const modal = document.getElementById("monster-modal");
        const modalName = document.getElementById("modal-monster-name");
        const modalDetails = document.getElementById("modal-monster-details");

        modal.style.display = "flex";
        modalName.textContent = monster.Name;

        // Exibir todos os detalhes do monstro no modal
        modalDetails.innerHTML = ""; // Limpa detalhes antigos
        Object.entries(monster).forEach(([key, value]) => {
            const detailRow = document.createElement("p");
            detailRow.textContent = `${key}: ${value || "N/A"}`;
            modalDetails.appendChild(detailRow);
        });
    }

    // Função para fechar o modal
    function closeModal() {
        const modal = document.getElementById("monster-modal");
        modal.style.display = "none";
    }

    // Evento para fechar o modal
    document.querySelector(".close-button").addEventListener("click", closeModal);

    // Função de limpar filtros
    function clearFilters() {
        document.getElementById("search-name").value = "";
        document.getElementById("filter-type").value = "";
        document.getElementById("filter-cr").value = "";
        const resultsContainer = document.getElementById("results-container");
        if (resultsContainer) {
            resultsContainer.innerHTML = ""; // Limpa os resultados
        }
    }

    // Eventos de busca
    document.getElementById("search-button").addEventListener("click", filterMonsters);
    document.getElementById("clear-button").addEventListener("click", clearFilters);

    loadCSV();
});