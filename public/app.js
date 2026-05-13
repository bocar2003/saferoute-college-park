async function getCrimeData() {
    const response = await fetch("/api/external-crime");
    const data = await response.json();
    return data;
  }
  
  function getCrimeType(crime) {
    return (
      crime.clearance_code_inc_type ||
      crime.incident_type ||
      crime.offense ||
      crime.crime_type ||
      crime.type ||
      "Unknown"
    );
  }
  
  function getLatitude(crime, index) {
    const possibleLat =
      crime.latitude ||
      crime.lat ||
      crime.y ||
      crime.geocoded_column?.coordinates?.[1];
  
    if (possibleLat) {
      return Number(possibleLat);
    }
  
    return 38.9897 + (index % 10) * 0.003;
  }
  
  function getLongitude(crime, index) {
    const possibleLng =
      crime.longitude ||
      crime.lng ||
      crime.long ||
      crime.x ||
      crime.geocoded_column?.coordinates?.[0];
  
    if (possibleLng) {
      return Number(possibleLng);
    }
  
    return -76.9378 + (index % 10) * 0.003;
  }
  
  async function loadChart() {
    const chartElement = document.getElementById("crimeChart");
  
    if (!chartElement) return;
  
    const data = await getCrimeData();
    const crimeCounts = {};
  
    data.forEach((crime) => {
      const type = getCrimeType(crime);
      crimeCounts[type] = (crimeCounts[type] || 0) + 1;
    });
  
    new Chart(chartElement, {
      type: "bar",
      data: {
        labels: Object.keys(crimeCounts).slice(0, 8),
        datasets: [
          {
            label: "Number of Incidents",
            data: Object.values(crimeCounts).slice(0, 8)
          }
        ]
      },
      options: {
        responsive: true
      }
    });
  }
  
  async function loadMap() {
    const mapElement = document.getElementById("map");
  
    if (!mapElement) return;
  
    const map = L.map("map").setView([38.9897, -76.9378], 13);
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap"
    }).addTo(map);
  
    const data = await getCrimeData();
    const filter = document.getElementById("crimeFilter");
    const markerLayer = L.layerGroup().addTo(map);
  
    const crimeTypes = [...new Set(data.map((crime) => getCrimeType(crime)))];
  
    crimeTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      filter.appendChild(option);
    });
  
    function drawMarkers(selectedType) {
      markerLayer.clearLayers();
  
      data.forEach((crime, index) => {
        const type = getCrimeType(crime);
  
        if (selectedType !== "all" && type !== selectedType) {
          return;
        }
  
        const lat = getLatitude(crime, index);
        const lng = getLongitude(crime, index);
  
        if (!lat || !lng || Number.isNaN(lat) || Number.isNaN(lng)) {
          return;
        }
  
        L.marker([lat, lng])
          .addTo(markerLayer)
          .bindPopup(`
            <strong>${type}</strong><br>
            Source: Prince George's County Open Data
          `);
      });
    }
  
    drawMarkers("all");
  
    filter.addEventListener("change", () => {
      drawMarkers(filter.value);
    });
  }
  
  async function submitReport() {
    const form = document.getElementById("reportForm");
  
    if (!form) return;
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const location = document.getElementById("location").value;
      const description = document.getElementById("description").value;
      const message = document.getElementById("reportMessage");
  
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ location, description })
      });
  
      if (response.ok) {
        message.textContent = "Report submitted successfully.";
        form.reset();
        loadReports();
      } else {
        message.textContent = "Something went wrong. Check your Supabase setup.";
      }
    });
  }
  
  async function loadReports() {
    const reportsList = document.getElementById("reportsList");
  
    if (!reportsList) return;
  
    const response = await fetch("/api/reports");
    const reports = await response.json();
  
    reportsList.innerHTML = "";
  
    reports.forEach((report) => {
      const div = document.createElement("div");
      div.className = "report-item";
      div.innerHTML = `
        <strong>${report.location}</strong>
        <p>${report.description}</p>
      `;
      reportsList.appendChild(div);
    });
  }
  
  loadChart();
  loadMap();
  submitReport();
  loadReports();