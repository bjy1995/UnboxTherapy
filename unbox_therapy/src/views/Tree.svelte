<script type="text/javascript">
    import { onMount } from 'svelte';
    var m = [20, 120, 20, 120],
        w = 1000 - m[1] - m[3],
        h = 800 - m[0] - m[2],
        i = 0,
        rect_width = 80,
        rect_height = 20,
        max_link_width = 20,
        min_link_width = 1.5,
        char_to_pxl = 8,
        root;

    var tree;
    var diagonal;
    var vis;
    var gLink;
    var gNode;
    var link_stoke_scale;
    var color_map;
    // stroke style of link - either color or function
    var stroke_callback = "#ccc";

    onMount(async () =>{
        // Add datasets dropdown
        d3.select("#datasets")
            .on("change", function() {
            if (this.value !== '-') {
                d3.json(this.value + ".json", load_dataset);
            }
            })
        .selectAll("option")
            .data([
            "-",
            "iris",
            "boston",
            "test",
            ])
        .enter().append("option")
            .attr("value", String)
            .text(String);

        tree = d3.tree()
            .size([h, w]);

        diagonal = d3.linkHorizontal()
            .x(d => d.x)
            .y(d => d.y);

        // vis = d3.select("#body").append("svg")
        //     .attr("viewBox", [0, 0, w + m[1] + m[3], h + m[0] + m[2] + 1000])
        //     .append("g")
        //     .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
        vis = d3.select("#tree-svg")
                .attr("viewBox", [0, 0, w + m[1] + m[3], h + m[0] + m[2] + 1000]);

        gLink = vis.append("g")
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4);

        gNode = vis.append("g")
                .attr("cursor", "pointer")
                .attr("pointer-events", "all");

        color_map = d3.scaleOrdinal(d3.schemeCategory10);
    })



    function load_dataset(json) {
        // root = json;
        root = d3.hierarchy(json);
        root.x0 = 0;
        root.y0 = 50;

        // var n_samples = root.samples;
        // var n_labels = root.value.length;
        var n_samples = json.samples;
        var n_labels = json.value.length;

        if (n_labels >= 2) {
            stroke_callback = mix_colors;
        } else if (n_labels === 1) {
            stroke_callback = mean_interpolation(root);
        }

        link_stoke_scale = d3.scaleLinear()
                                    .domain([0, n_samples])
                                    .rangeRound([min_link_width, max_link_width]);

        function toggleAll(d) {
            if (d && d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
            }
        }

        // Initialize the display to show a few nodes.
        // root.children.forEach(toggleAll);
        root.descendants().forEach((d, i) => {
            d.id = i;
            d._children = d.children;
            d.children = null;
            if (d.data.type === "leaf") d.children = null;
        });

        update(root);
    }

    function update(source) {
        var duration = d3.event && d3.event.altKey ? 5000 : 500;
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);
        // const treeRoot = d3.hierarchy(root);
        // tree(treeRoot)
        // var nodes = treeRoot.descendants();

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Update the nodes…
        // var node = vis.selectAll("g.node")
        //     .data(nodes, function(d) { return d.id || (d.id = ++i); });
        const node = gNode.selectAll("g")
                        .data(nodes, d => d.id)

        // Enter any new nodes at the parent's previous position.
        // var nodeEnter = node.enter().append("g")
        //     .attr("class", "node")
        //     .attr("transform", function(d) { return `translate(${source.x0}, ${source.y0})`})
        //     .on("click", function(d) { toggle(d.data); update(d.data); });
        const nodeEnter = node.enter().append("g")
            .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", d => {
                d.children = d.children ? null : d._children;
                update(d);
            });
                

        nodeEnter.append("rect")
            .attr("x", function(d) {
                var label = node_label(d);
                var text_len = label.length * char_to_pxl;
                var width = d3.max([rect_width, text_len])
                return -width / 2;
            })
            .attr("width", 1e-6)
            .attr("height", 1e-6)
            .attr("rx", function(d) { return d.data.type === "split" ? 2 : 0;})
            .attr("ry", function(d) { return d.data.type === "split" ? 2 : 0;})
            .style("stroke", function(d) { return d.data.type === "split" ? "steelblue" : "olivedrab";})
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeEnter.append("text")
            .attr("dy", "12px")
            .attr("text-anchor", "middle")
            .text(node_label)
            .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        // var nodeUpdate = node.transition()
        //     .duration(duration)
        //     .attr("transform", function(d) { return `translate(${d.x}, ${d.y})` });
        const nodeUpdate = node.merge(nodeEnter).transition()
            .duration(duration)
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);


        nodeUpdate.select("rect")
            .attr("width", function(d) {
                var label = node_label(d);
                var text_len = label.length * char_to_pxl;
                var width = d3.max([rect_width, text_len])
                return width;
            })
            .attr("height", rect_height)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        // var nodeExit = node.exit().transition()
        //     .duration(duration)
        //     .attr("transform", function(d) { return `translate(${source.x0}, ${source.y0})` })
        //     .remove();

        // nodeExit.select("rect")
        //     .attr("width", 1e-6)
        //     .attr("height", 1e-6);

        // nodeExit.select("text")
        //     .style("fill-opacity", 1e-6);
        const nodeExit = node.exit().transition().remove()
            .attr("transform", d => `translate(${source.x},${source.y})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        // Update the links
        // const links = treeRoot.links();
        // var link = vis.selectAll("path.link")
        //     .data(links, function(d) { return d.target.id; });
        const link = gLink.selectAll("path")
            .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        // link.enter().insert("path", "g")
        //     .attr("class", "link")
        //     .attr("d", function(d) {
        //         var o = {x: source.x0, y: source.y0};
        //         return diagonal({source: o, target: o});
        //     })
        //     .transition()
        //     .duration(duration)
        //     .attr("d", diagonal)
        //     .style("stroke-width", function(d) {return link_stoke_scale(d.target.data.samples);})
        //     .style("stroke", stroke_callback);
        const linkEnter = link.enter().append("path")
            .attr("d", d => {
            const o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        // link.transition()
        //     .duration(duration)
        //     .attr("d", diagonal)
        //     .style("stroke-width", function(d) {return link_stoke_scale(d.target.data.samples);})
        //     .style("stroke", stroke_callback);
        link.merge(linkEnter).transition()
            .attr("d", diagonal)          
            .style("stroke", stroke_callback);

        // Transition exiting nodes to the parent's new position.
        // link.exit().transition()
        //     .duration(duration)
        //     .attr("d", function(d) {
        //         var o = {x: source.x0, y: source.y0};
        //         return diagonal({source: o, target: o});
        //     })
        //     .remove();
        link.exit().transition().remove()
            .attr("d", d => {
            const o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
            });

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Toggle children.
    function toggle(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
    }

    // Node labels
    function node_label(d) {
        d = d.data;
        if (d.type === "leaf") {
            // leaf
            var formatter = d3.format(".2f");
            var vals = [];
            d.value.forEach(function(v) {
                vals.push(formatter(v));
            });
            return "[" + vals.join(", ") + "]";
        } else {
            // split node
            return d.label;
        }
    }

    /**
     * Mixes colors according to the relative frequency of classes.
     */
    function mix_colors(d) {
        var value = d.target.data.value;
        var sum = d3.sum(value);
        var col = d3.rgb(0, 0, 0);
        value.forEach(function(val, i) {
            var label_color = d3.rgb(color_map(i));
            var mix_coef = val / sum;
            col.r += mix_coef * label_color.r;
            col.g += mix_coef * label_color.g;
            col.b += mix_coef * label_color.b;
        });
        return col;
    }


    /**
     * A linear interpolator for value[0].
     *
     * Useful for link coloring in regression trees.
     */
    function mean_interpolation(root) {

        var max = 1e-9,
            min = 1e9;

        function recurse(node) {
            if (node.value[0] > max) {
            max = node.value[0];
            }

            if (node.value[0] < min) {
            min = node.value[0];
            }

            if (node.children) {
            node.children.forEach(recurse);
            }
        }
        recurse(root);

        var scale = d3.scale.linear().domain([min, max])
                                    .range(["#2166AC","#B2182B"]);

        function interpolator(d) {
            return scale(d.target.data.value[0]);
        }

        return interpolator;
    }

    /*
    * Function to load json file from file system
    **/
    function loadFile() {
        var input, file, fr;

        if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
        }

        input = document.getElementById('fileinput');
        if (!input) {
        alert("Um, couldn't find the fileinput element.");
        }
        else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
        }
        else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
        }
        else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
        }

        function receivedText(e) {
        var lines = e.target.result;
        var newArr = JSON.parse(lines); 
            load_dataset(newArr);
        }
    }
</script>


<style type="text/css">

    .body {
    font-family: "Helvetica Neue", Helvetica;
    }

    .hint {
    font-size: 12px;
    color: #999;
    }

    .node rect {
    cursor: pointer;
    fill: #fff;
    stroke-width: 1.5px;
    }

    .node text {
    font-size: 11px;
    }

    path.link {
    fill: none;
    stroke: #ccc;
    }

</style>

<div id="body">
    <div id="footer">
        <h1>Decision Tree viewer</h1>
        <form id="jsonFile" name="jsonFile" enctype="multipart/form-data" method="post">
            <fieldset>
                <h2>Json File</h2>
                <input type='file' id='fileinput'>
                <input type='button' id='btnLoad' value='Load' on:click={loadFile}>
            </fieldset>
         </form>
    </div>
    <svg id="tree-svg"></svg>
</div>