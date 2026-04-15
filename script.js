let visiDati = [];
let currentFilter = "all";

function renderTable(data) {
  const tableBody = document.getElementById("dataTableBody");
  tableBody.innerHTML = "";

  if (!data.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7">Nav atrastu ierakstu</td>
      </tr>
    `;
    return;
  }

  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.nosaukums}</td>
      <td>${item.tips}</td>
      <td>${item.apakstips}</td>
      <td>${item.skaits}</td>
      <td>${item.daudzums}</td>
      <td>${item.komentari}</td>
    `;
    tableBody.appendChild(row);
  });
}

function updateTable() {
  let filtered = [...visiDati];

  if (currentFilter === "vielas") {
    filtered = filtered.filter(item => item.tips === "Viela");
  } else if (currentFilter === "inventars") {
    filtered = filtered.filter(item => item.tips === "Aprīkojums");
  }

  renderTable(filtered);
}

function attachEvents() {
  document.getElementById("showAllBtn").addEventListener("click", function () {
    currentFilter = "all";
    updateTable();
  });

  document.getElementById("showVielasBtn").addEventListener("click", function () {
    currentFilter = "vielas";
    updateTable();
  });

  document.getElementById("showInventarsBtn").addEventListener("click", function () {
    currentFilter = "inventars";
    updateTable();
  });
}

async function loadData() {
  try {
    const inventarsResponse = await fetch("inventars.json");
    const vielasResponse = await fetch("vielas.json");

    const inventars = await inventarsResponse.json();
    const vielas = await vielasResponse.json();

    const inventaraDati = inventars.map(item => ({
      id: item.id,
      nosaukums: item.nosaukums,
      tips: "Aprīkojums",
      apakstips: item.apakstips,
      skaits: item.skaits,
      daudzums: "",
      komentari: item.komentari || ""
    }));

    const vieluDati = vielas.map(item => ({
      id: item.id,
      nosaukums: item.nosaukums,
      tips: "Viela",
      apakstips: item.apakstips,
      skaits: item.skaits,
      daudzums: `${item.daudzums || ""} ${item.mervienibas || ""}`.trim(),
      komentari: item.komentari || ""
    }));

    visiDati = [...inventaraDati, ...vieluDati];
    updateTable();
  } catch (error) {
    console.error("Kļūda, ielādējot datus:", error);
    document.getElementById("dataTableBody").innerHTML = `
      <tr>
        <td colspan="7">Neizdevās ielādēt datus</td>
      </tr>
    `;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  attachEvents();
  loadData();
});