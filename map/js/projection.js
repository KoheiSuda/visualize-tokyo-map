const scale = Math.min(window.innerWidth, window.innerHeight) * 100;

let width = window.innerWidth;
let height = window.innerHeight;

var projection = d3
        .geoMercator()
        .center([139.4, 35.6895])
        .translate([width / 2, height / 2])
        .scale(scale);

export { width, height, projection };