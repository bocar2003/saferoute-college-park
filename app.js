async function loadChart() {

    const response = await fetch('/api/external-crime');
  
    const data = await response.json();
  
    const crimeTypes = {};
  
    data.forEach((crime) => {
  
      const type = crime.clearance_code_inc_type || 'Other';
  
      if (crimeTypes[type]) {
        crimeTypes[type]++;
      } else {
        crimeTypes[type] = 1;
      }
    });
  
    const ctx = document.getElementById('crimeChart');
  
    if (ctx) {
  
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(crimeTypes),
          datasets: [
            {
              label: 'Crime Incidents',
              data: Object.values(crimeTypes)
            }
          ]
        }
      });
    }
  }
  
  async function loadMap() {
  
    const mapDiv = document.getElementById('map');
  
    if (!mapDiv) return;
  
    const map = L.map('map').setView([38.9897, -76.9378], 13);
  
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ).addTo(map);
  
    const response = await fetch('/api/external-crime');
  
    const data = await response.json();
  
    data.forEach((crime) => {
  
      if (crime.latitude && crime.longitude) {
  
        L.marker([
          crime.latitude,
          crime.longitude
        ])
        .addTo(map)
        .bindPopup(
          `<b>${crime.clearance_code_inc_type}</b>`
        );
      }
    });
  }
  
  loadChart();
  loadMap();