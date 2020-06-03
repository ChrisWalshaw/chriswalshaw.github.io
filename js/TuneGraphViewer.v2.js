function TuneGraph(jsonFileName, canvasElementId, scoreElementId, experimental, linkToCollectionBased, diagnostics) {
    var canvasElement = document.getElementById(canvasElementId);
    if (canvasElement === null) {
        if (diagnostics) {
            alert('canvas element null');
        }
        return;
    }
    var scoreElement = document.getElementById(scoreElementId);
    if (scoreElement === null) {
        if (diagnostics) {
            alert('score element null');
        }
        return;
    }

    var height = canvasElement.clientHeight;
    var width = canvasElement.clientWidth;

    // fixed parameters
    var zoomAndPan = false;
    var clickToRender = false;
    var clickToRelocate = !clickToRender;
    var doubleClickToRelocate = true;
    var mouseOverToRender = !clickToRender;
    var appendTitleOnMouseover = true;
    var appendTextOnMouseover = !appendTitleOnMouseover;
    var radius = 8;
    var mouseoverRadius = radius * 2;
    var linkDistance = 20;
    var fixedRoot = true;

    var svg;
//    var color = d3.scale.category20c(); // see https://github.com/mbostock/d3/wiki/Ordinal-Scales
    var color = d3.scale.linear() // see https://github.com/mbostock/d3/wiki/Quantitative-Scales
            .domain([0, 2])
            .range(["#CC0099", "cadetblue"]);
//    .domain([0, 1, 2])
//    .range(["#3182bd",  "#A8CAE3",  "#CDE1EF"]);
//        var color = d3.scale.linear()
//    .domain([0, 2])
////    .range(["crimson",  "cadetblue"]);
//    .range(["red",  "midnightblue"]);

    if (zoomAndPan) {
        svg = d3.select(canvasElement)
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height)
                //      .attr({"width": "100%","height": "100%"})
                .attr("pointer-events", "all")
                .append('svg:g')
                .call(d3.behavior.zoom().on("zoom", redraw))
                .append('svg:g');

        svg.append('svg:rect')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'white');

        function redraw() {
            console.log("here", d3.event.translate, d3.event.scale);
            svg.attr("transform",
                    "translate(" + d3.event.translate + ")"
                    + " scale(" + d3.event.scale + ")");
        }

    } else {
        svg = d3.select(canvasElement).append("svg")
                .attr("width", width)
                .attr("height", height);
    }


    d3.json(jsonFileName, function (error, graph) {
        if (error)
            return console.warn(error);

        if (fixedRoot) {
            var root = graph.nodes[0];
            root.fixed = true;
            root.x = width / 2;
            root.y = height / 2;
        }

        var force = d3.layout.force()
                .nodes(graph.nodes)
                .links(graph.links)
                //    .nodes(d3.values(nodes))
                //    .links(links)
                .size([width, height])
                .linkDistance(linkDistance)
                .charge(-300)
                .on("tick", tick)
                .start();

        //    force.nodes()[0].fixed = true;
        //    force.nodes()[0].x = width/2;
        //    force.nodes()[0].y = height/2;

        var link = svg.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function (d) {
                    return d.value;
                });
        var click = 'click';
        if (doubleClickToRelocate) {
            click = 'dblclick';
        }

        var node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("g")
                .attr("class", "node")
//      .style("fill", function(d) { return color(d.group); })
//                .on('click', function(node) {
                .on(click, function (node) {
                    if (clickToRender) {
                        render(node);
                    } else if (clickToRelocate) {
                        if (linkToCollectionBased) {
                            var targetTuneCode = node.url;
                            var lastSlashIndex = targetTuneCode.lastIndexOf("/");
                            var targetUrl = 'http://' + targetTuneCode.slice(0, lastSlashIndex) + '#' + targetTuneCode.slice(lastSlashIndex + 1);
                            window.location.assign(targetUrl);
                        } else {
                            var prefix = experimental ? "/_" : "/";
                            if (node.url.charAt(0) === "/") { // old version
                                window.location.assign(prefix + node.url.substring(1));
                            } else {
                                window.location.assign(prefix + "tunePage?a=" + node.url);
                            }
                        }
                    }
                })
//                .on("mouseover", mouseover)
                .on("mouseover", function (node) {
//                    mouseover(node); 
//                        mouseover();
                    if (appendTitleOnMouseover) {
                        d3.select(this).append("title")
                                .text(function (d) {
                                    return d.name;
                                });
                    }
                    if (appendTextOnMouseover) {
                        d3.select(this)
                                .append("text")
                                .attr("x", 12)
                                .attr("dy", ".35em")
                                .text(function (d) {
                                    return d.name;
                                });
                    }
                    d3.select(this).select("circle").transition()
                            .duration(750)
                            .attr("r", mouseoverRadius);
                    if (mouseOverToRender) {
                        render(node);
                    }
                })
                .on("mouseout", mouseout)
                .call(force.drag);

        node.append("circle")
                .attr("r", radius)
//                    .style("fill", function(d) {
//                        return "#f00"; // red
//                    })
                .style("fill", function (d) {
                    return color(d.group);
                });
        //
        //node.append("text")
        //    .attr("x", 12)
        //    .attr("dy", ".35em")
        //    .text(function(d) { return d.name; });

        function tick() {
            link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

            node
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
        }

//        function mouseover(node) {
//            d3.select(this)
//                    .select("circle")
//                    .transition()
//                    .duration(750)
//                    .attr("r", mouseoverRadius);
//            if (appendTextOnMouseover)
//                d3.select(this)
//                        .append("text")
//                        .attr("x", 12)
//                        .attr("dy", ".35em")
//                        .text(function(d) {
//                            return d.name;
//                        });
//            if (appendTitleOnMouseover)
//                d3.select(this)
//                        .append("title")
//                        .text(function(d) {
//                            return d.name;
//                        });
//            if (mouseOverToRender) {
//                render(node);
//            }
//        }

        function render(node) {
            ABCJS.renderAbc(scoreElementId, node.abc.replace('barsperstaff 6', 'barsperstaff 4'), {}, {scale: 0.5, staffwidth: 598, paddingright: 1, paddingleft: 1});
//            notationElement.style.position = 'absolute';
//            notationElement.style.left = '1400px';
        }

        function mouseout() {
            if (appendTitleOnMouseover)
                d3.select(this).select("title").remove();
            if (appendTextOnMouseover)
                d3.select(this).select("text").remove();
            d3.select(this).select("circle").transition()
                    .duration(750)
                    .attr("r", 8);
        }
    });
}
