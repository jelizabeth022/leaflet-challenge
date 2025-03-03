// Create the map
let myMap = L.map("map").setView([37.09, -95.71], 5);

// Add base layers
let street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(myMap);

// Function to determine marker size based on magnitude
function getRadius(magnitude) {
    return magnitude ? magnitude * 4 : 1;
}

// Function to determine marker color based on depth
function getColor(depth) {
    return depth > 90 ? "#ff0000" :  // Red
           depth > 70 ? "#ff6600" :  // Orange-Red
           depth > 50 ? "#ffcc00" :  // Orange-Yellow
           depth > 30 ? "#ccff33" :  // Yellow-Green
           depth > 10 ? "#33ff33" :  // Green
                        "#00ff99";   // Light Green

}

// Function to style each marker
function styleInfo(feature) {
    return {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]), // Depth determines color
        color: "#ffffff",  // White border
        weight: 1.5,       // Thickness of the border
        opacity: 1,
        fillOpacity: 0.8
    };
}

// Load earthquake data from USGS GeoJSON
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, styleInfo(feature));
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<strong>Magnitude:</strong> ${feature.properties.mag}<br>
                            <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km<br>
                            <strong>Location:</strong> ${feature.properties.place}`);
        }
    }).addTo(myMap);
});

// Add legend for depth colors
let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90],
        colors = ["#00ff99", "#33ff33", "#ccff33", "#ffcc00", "#ff6600", "#ff0000"];

    // Loop through depth values and generate labels
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            `<i style="background:${colors[i]}; width: 20px; height: 20px; display: inline-block; border: 1px solid #000;"></i> ` +
            depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }
    return div;
};

// Add legend to the map
legend.addTo(myMap);

