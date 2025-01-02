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
                displayResults([]); // Exibe a página sem resultados ao iniciar (sem monstros carregados inicialmente)
            }
        });
    }
    
// Função para converter frações em números decimais
    function convertFractionToDecimal(cr) {
        const parts = cr.split('/');
        if (parts.length === 2) {
            return parseFloat(parts[0]) / parseFloat(parts[1]);
        }
        return parseFloat(cr);
    }
    // Função para popular os filtros
    function populateFilters() {
        const typeSet = new Set();
        const crSet = new Set();

        monstersData.forEach(monster => {
            if (monster.Type) typeSet.add(monster.Type.trim());
            if (monster["Challenge Rating"]) crSet.add(monster["Challenge Rating"]);
        });

        const typeFilter = document.getElementById("filter-type");
        const crFilter = document.getElementById("filter-cr");

        if (typeFilter && crFilter) {
            // Organiza o tipo
            [...typeSet].sort((a, b) => a.localeCompare(b)).forEach(type => {
                const option = document.createElement("option");
                option.value = type;
                option.textContent = type;
                typeFilter.appendChild(option);
            });

            // Organiza o Challenge Rating
             [...crSet].sort((a, b) => {
                const numA = parseFloat(a); // Converte para número
                const numB = parseFloat(b); // Converte para número
                return numA - numB; // Ordena numericamente
            }).forEach(cr => {
                const option = document.createElement("option");
                option.value = cr;
                option.textContent = cr;
                crFilter.appendChild(option);
            });
        }
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

        resultsContainer.innerHTML = ""; // Limpa os resultados antes de exibir os novos

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

        // Exibir todos os detalhes do monstro no modal como uma tabela
        modalDetails.innerHTML = ""; // Limpa detalhes antigos
        const table = document.createElement("table");

        Object.entries(monster).forEach(([key, value]) => {
            // Não inclui o "Stat_Block" no modal
            if (key !== "Stat_Block") {
                const row = document.createElement("tr");
                const cellKey = document.createElement("th");
                cellKey.textContent = key;
                const cellValue = document.createElement("td");
                cellValue.textContent = value || "N/A";
                row.appendChild(cellKey);
                row.appendChild(cellValue);
                table.appendChild(row);
            }
        });

        modalDetails.appendChild(table);
    }

    // Função para fechar o modal
    function closeModal() {
        const modal = document.getElementById("monster-modal");
        modal.style.display = "none";
    }

    // Evento para fechar o modal
    document.querySelector(".close-button").addEventListener("click", closeModal);

    // Fechar o modal ao clicar fora dele
    const modal = document.getElementById("monster-modal");
    modal.addEventListener("click", (event) => {
        // Fecha o modal se o clique for fora da área do conteúdo
        if (event.target === modal) {
            closeModal();
        }
    });

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
