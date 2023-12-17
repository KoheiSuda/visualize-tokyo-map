function detail_map(d) {
    console.log(d);

    // Remove any existing map instance
    const existingMap = document.getElementById("detailMap");
    if (existingMap) {
        existingMap.remove();
    }

    // Create a new map container
    const mapContainer = document.createElement("div");
    mapContainer.id = "detailMap";
    mapContainer.style.height = "800px"; // Set the height of the map
    document.getElementById("detailMapContainer").appendChild(mapContainer);

    var detailMap = L.map("detailMap").setView([35.6895, 139.6917], 10);

    // Add OSM tile layer
    L.tileLayer("http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© Gravitystorm",
    }).addTo(detailMap);
}

export { detail_map };
