// Monster Database Code (Updated for DOMContentLoaded and Minimalist Design)
document.addEventListener("DOMContentLoaded", () => {
    const csvFilePath = "https://raw.githubusercontent.com/Sodral/monstros/main/monster_data.csv";
    let monstersData = [];

    function loadCSV() {
        Papa.parse(csvFilePath, {
            download: true,
            header: true,
            complete: function (results) {
                // Ignore the last two rows if they are blank
                monstersData = results.data.filter(row => row.Name && row.Name.trim() !== "");
                populateFilters();
            }
        });
    }

    function populateFilters() {
        const typeSet = new Set();
        const crSet = new Set();

        monstersData.forEach(monster => {
            if (monster.Type) typeSet.add(monster.Type);
            if (monster.ChallengeRating) crSet.add(monster.ChallengeRating);
        });

        const typeFilter = document.getElementById("filter-type");
        const crFilter = document.getElementById("filter-cr");

        if (typeFilter && crFilter) {
            [...typeSet].sort().forEach(type => {
                const option = document.createElement("option");
                option.value = type;
                option.textContent = type;
                typeFilter.appendChild(option);
            });

            [...crSet].sort().forEach(cr => {
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
                (!cr || monster.ChallengeRating === cr)
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

                Object.entries(monster).forEach(([key, value]) => {
                    const row = document.createElement("tr");
                    const cellKey = document.createElement("th");
                    cellKey.textContent = key;
                    const cellValue = document.createElement("td");
                    cellValue.textContent = value || "N/A";
                    row.appendChild(cellKey);
                    row.appendChild(cellValue);
                    table.appendChild(row);
                });

                resultsContainer.appendChild(table);
            });
        } else {
            resultsContainer.textContent = "No results found.";
        }
    }

    document.getElementById("search-button")?.addEventListener("click", filterMonsters);

    loadCSV();
});
