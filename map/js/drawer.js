ShopData = [];

var legRow = d3.select("#genreTable").append("div").attr("class","legend")
    .append("table").selectAll("tr").data(ShopData[0].genre).enter().append("tr").append("td");
legRow.append("div")
        .style("background",function(d){ 
            if (choice_genres[d]) {
                return colors[color_dict[d]].color;
            }
            return "#FFFFFF";})
        .style("cursor","pointer")
        .on("mouseover", function(event, d) {
            var now = d;
            legRow.style("background-color", function(d) {
                if (d == now) {return "silver";}
                if (choice_genres[d]) {
                    return choiced_color ;
                }
                return nav_background_color;
            });
        })
        .on("mouseout", function(event, d) {
            legRow.style("background-color", function(d) {
                if (choice_genres[d]) {
                    return choiced_color ;
                }
                return nav_background_color;
            });
        })
		.on("click", function(event,d) {
			pull_all_data();
            if (choice_genres[d]) {
				choice_genres[d] = false;
				colors[color_dict[d]].genre = undefined;
                true_num--;
            }
            else {
				choice_genres[d] = true;
				for (var index in colors) {
					if (colors[index].genre === undefined) {
						colors[index].genre = d;
						color_dict[d] = index;
						break;
					}
				}
                true_num++;
            }
            push_all_data();
            legRow.style("background-color", function(d) {
                    if (choice_genres[d]) {
                        return choiced_color ;
                    }
                    return nav_background_color;
                });
            legRow.selectAll("div")
                .style("background",function(d){ 
                    if (choice_genres[d]) {
                        return colors[color_dict[d]].color;
                    }
                    return "#FFFFFF";
                });	
			updateGanre(ShopData, "contentDiv");
			updateGanrePre(ShopPrefectureData, "contentDivPre");
            updateJapanPlot(svgJapanMap);
            updatePrefecturePlot(svgPrefectureMap);
        });
		
    legRow.append("span").text(function(d){ return d;})
        .style("cursor","pointer")
        .on("mouseover", function(event, d) {
            var now = d;
            legRow.style("background-color", function(d) {
                if (d == now) {return "silver";}
                if (choice_genres[d]) {
                    return choiced_color ;
                }
                return nav_background_color;
            });
        })
        .on("mouseout", function(event, d) {
            legRow.style("background-color", function(d) {
                if (choice_genres[d]) {
                    return choiced_color ;
                }
                return nav_background_color;
            });
        })
		.on("click", function(event,d) {
            pull_all_data();
            if (choice_genres[d]) {
				choice_genres[d] = false;
				colors[color_dict[d]].genre = undefined;
                true_num--;
            }
            else {
				choice_genres[d] = true;
				for (var index in colors) {
					if (colors[index].genre === undefined) {
						colors[index].genre = d;
						color_dict[d] = index;
						break;
					}
				}
                true_num++;
            }
            push_all_data();
            legRow.style("background-color", function(d) {
                    if (choice_genres[d]) {
                        return choiced_color ;
                    }
                    return nav_background_color;
                });
            legRow.selectAll("div")
                .style("background",function(d){ 
                    if (choice_genres[d]) {
                        return colors[color_dict[d]].color;
                    }
                    return "#FFFFFF";
                });	
			updateGanre(ShopData, "contentDiv");
			updateGanrePre(ShopPrefectureData, "contentDivPre");
            updateJapanPlot(svgJapanMap);
            updatePrefecturePlot(svgPrefectureMap);
        });