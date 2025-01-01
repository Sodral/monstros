document.addEventListener("DOMContentLoaded", () => {
    const csvFilePath = "monster_database.csv"; // Nome do arquivo
    let monstersData = [];

    function loadCSV() {
        Papa.parse(csvFilePath, {
            download: true,
            header: true,
            skipEmptyLines: true, // Ignora linhas completamente vazias
            complete: function (results) {
                // Remove linhas com valores inconsistentes e limpa espaços extras
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
            [...typeSet].sort((a, b) => a.localeCompare(b)).forEach(type => {
                const option = document.createElement("option");
                option.value = type;
                option.textContent = type;
                typeFilter.appendChild(option);
            });

            [...crSet].sort((a, b) => a.localeCompare(b)).forEach(cr => {
                const option = document.createElement("option");
                option.value = cr;
                option.textContent = cr;
                crFilter.appendChild(option);
            });
        }
    }

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

function displayResults(monsters) {
    const resultsContainer = document.getElementById("results-container");
    if (!resultsContainer) {
        console.error("Results container not found.");
        return;
    }

    resultsContainer.innerHTML = "";

    if (monsters.length > 0) {
        monsters.forEach(monster => {
            const table = document.createElement("table");
            table.className = "monster-table";

            // Aqui, garantimos que 'Challenge Rating' esteja após 'Subtype'
            const keys = Object.keys(monster); // Pega todas as chaves

            // Remove o 'Challenge Rating' da lista de chaves para inseri-lo depois do 'Subtype'
            const crIndex = keys.indexOf("Challenge Rating");
            if (crIndex > -1) {
                keys.splice(crIndex, 1); // Remove 'Challenge Rating' da lista
            }

            // Adiciona 'Challenge Rating' logo após 'Subtype'
            const subtypeIndex = keys.indexOf("Subtype");
            if (subtypeIndex > -1) {
                keys.splice(subtypeIndex + 1, 0, "Challenge Rating"); // Insere 'Challenge Rating' após 'Subtype'
            }

            // Agora, vamos iterar sobre as chaves na nova ordem
            keys.forEach(key => {
                const row = document.createElement("tr");
                const cellKey = document.createElement("th");
                cellKey.textContent = key;
                cellKey.style.width = "30%"; // Define largura consistente
                const cellValue = document.createElement("td");
                cellValue.textContent = monster[key] || "N/A";
                cellValue.style.width = "70%"; // Define largura consistente
                row.appendChild(cellKey);
                row.appendChild(cellValue);
                table.appendChild(row);
            });

            // Agora adiciona o 'Challenge Rating' no final da tabela
            if (monster["Challenge Rating"]) {
                const row = document.createElement("tr");
                const cellKey = document.createElement("th");
                cellKey.textContent = "Challenge Rating";
                cellKey.style.width = "30%"; // Define largura consistente
                const cellValue = document.createElement("td");
                cellValue.textContent = monster["Challenge Rating"] || "N/A";
                cellValue.style.width = "70%"; // Define largura consistente
                row.appendChild(cellKey);
                row.appendChild(cellValue);
                table.appendChild(row);
            }

            resultsContainer.appendChild(table);
        });
    } else {
        resultsContainer.textContent = "No results found.";
    }
}

    function clearFilters() {
        document.getElementById("search-name").value = "";
        document.getElementById("filter-type").value = "";
        document.getElementById("filter-cr").value = "";
        const resultsContainer = document.getElementById("results-container");
        if (resultsContainer) {
            resultsContainer.innerHTML = ""; // Limpa os resultados
        }
    }

    document.getElementById("search-button").addEventListener("click", filterMonsters);
    document.getElementById("clear-button").addEventListener("click", clearFilters);

    loadCSV();
});
