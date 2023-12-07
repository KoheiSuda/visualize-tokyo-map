/**
 * data を読み込む関数
 */
const getData = async () => {
    // 日本地図のデータを読み込む
    //const japanJson = await d3.json("./data/N03-20_13_200101.geojson");
    //const topojsonData = topojson.feature(japanJson, japanJson.objects.japan);
    //return topojsonData;
    const geojsonData = await d3.json("./data/N03-20_13_200101.geojson");
    return geojsonData;
};

const createMap = async () => {
    const geojsonData = await getData();
    const width = 800;
    const height = 800;

    const svg = d3
        .select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const projection = d3
        .geoMercator()
        .center([139.6917, 35.6895]) // 東京の中心点を指定
        .scale(15000) // スケールを調整
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    svg.selectAll("path")
        .data(geojsonData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "lightgray")
        .attr("stroke", "black")
        .attr("stroke-width", 0.5);
};

createMap();

///**
// * グラフを描画する関数
// */
//const createGraphs = (data, topojsonData) => {
//    const width = 800;
//    const height = 800;

//    const svg = d3
//        .select("body")
//        .append("svg")
//        .attr("width", width)
//        .attr("height", height);

//    const projection = d3
//        .geoMercator()
//        .center([137, 34]) // 日本の中心に焦点を当てる
//        .translate([width / 2, height / 2])
//        .scale(1500);

//    const path = d3.geoPath().projection(projection);

//    svg.selectAll("path")
//        .data(topojsonData.features) // TopoJSONデータの結びつけ
//        .enter()
//        .append("path")
//        .attr("d", path)
//        .attr("stroke", "#333333")
//        .attr("stroke-width", 0.5)
//        .attr("fill", "lightgray"); // 地図の色を設定
//};

///**
// * main 関数
// * 読み込み時一度だけ実行される
// */
//const main = async () => {
//    // data を読み込む
//    const { data, topojsonData } = await getData();
//    // data の中身を確認
//    console.log(data, topojsonData);

//    // グラフを描画する
//    createGraphs(data, topojsonData);
//};

//main();
