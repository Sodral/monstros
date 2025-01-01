// Carrega o CSV
const csvFilePath = "https://sodral.github.io/monstros/monsters_data.csv"; // Substitua pelo nome correto do arquivo CSV.

let monstersData = [];

function loadCSV() {
    Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: function (results) {
            monstersData = results.data;
            populateFilters();
        }
    });
}

function populateFilters() {
    const typeSet = new Set();
    const crSet = new Set();

    monstersData.forEach(monster => {
        typeSet.add(monster.Type);
        crSet.add(monster.ChallengeRating);
    });

    const typeFilter = document.getElementById("filter-type");
    const crFilter = document.getElementById("filter-cr");

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
    const tableHeader = document.getElementById("table-header");
    const tableBody = document.getElementById("table-body");

    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";

    if (monsters.length > 0) {
        // Criar cabeçalhos
        Object.keys(monsters[0]).forEach(key => {
            const th = document.createElement("th");
            th.textContent = key;
            tableHeader.appendChild(th);
        });

        // Criar linhas
        monsters.forEach(monster => {
            const row = document.createElement("tr");
            Object.values(monster).forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                row.appendChild(td);
            });
            tableBody.appendChild(row);
        });
    } else {
        const noDataRow = document.createElement("tr");
        const noDataCell = document.createElement("td");
        noDataCell.colSpan = Object.keys(monstersData[0] || {}).length;
        noDataCell.textContent = "No results found.";
        noDataRow.appendChild(noDataCell);
        tableBody.appendChild(noDataRow);
    }
}

document.getElementById("search-button").addEventListener("click", filterMonsters);

loadCSV();
