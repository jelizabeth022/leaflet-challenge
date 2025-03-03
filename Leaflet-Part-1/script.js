// Create the map centered at a reasonable location
let map = L.map("map").setView([20, 0], 2);

// Add a tile layer (Base map)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Define the USGS earthquake data URL
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch data and plot markers
d3.json(earthquakeUrl).then(data => {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            let magnitude = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];

            // Set marker style
            let markerOptions = {
                radius: magnitude * 5,
                fillColor: getColor(depth),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            };

            return L.circleMarker(latlng, markerOptions).bindPopup(
                `<strong>Magnitude:</strong> ${magnitude}<br>
                <strong>Depth:</strong> ${depth} km<br>
                <strong>Location:</strong> ${feature.properties.place}`
            );
        }
    }).addTo(map);
});

// Function to determine color based on depth
function getColor(depth) {
    return depth > 90 ? "#d73027" :
           depth > 70 ? "#fc8d59" :
           depth > 50 ? "#fee08b" :
           depth > 30 ? "#d9ef8b" :
           depth > 10 ? "#91cf60" :
                        "#1a9850";
}

// Add legend control
let legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];

    for (let i = 0; i < depths.length; i++) {
        div.innerHTML += `<i style="background:${getColor(depths[i] + 1)}"></i> 
                          ${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+"}`;
    }
    return div;
};

legend.addTo(map);
