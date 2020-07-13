<script>
    import { onMount } from 'svelte';
    let outdata;
    let sortdata;
    var kdata;
    const color = {"apple": 'red', "blueberry":'steelblue', "watermelon":'green'}
    const arrcolor = ['red', 'steelblue', 'green']
    const labels = ["apple", "blueberry", "watermelon"]
    const margin = {top: 20, right: 10, bottom: 10, left: 40};
    const height = 280;
    const width = 500;
    const r = 3.5;
    let counts = {"apple": 0, "blueberry": 0, "watermelon": 0}
    let testlabel = ""
    let k = 6;
    let svg;
    let xAxis;
    let yAxis;
    let y, ry;
    let x, rx;
    let point = {};
    let link;
    let strlegend;

    
    onMount(async () => {
        strlegend = swatches({
            color: d3.scaleOrdinal(labels, arrcolor)
        })
        const data = await d3.csv("PUBLIC_URL/assets/data/test.csv");
        // const data = d3.csvParse(await FileAttachment("PUBLIC_URL/assets/data/us-population-state-age.csv").text(), d3.autoType);
        // const ages = data.columns.slice(1);
        // for (const d of data) d.total = d3.sum(ages, age => d[age]);
        // outdata = ages.flatMap(age => data.map(d => ({name: d.name, age, value: d[age] / d.total})));

        const newlabels = data.columns.slice(1);
        outdata = data.map(d => ({x: d.x, y: d.y, label: labels[d.label - 1]}));

        y = d3.scaleLinear()
            .domain(d3.extent(outdata, d => d.y))
            .rangeRound([margin.top, height - margin.bottom]);

        ry = d3.scaleLinear()
            .domain([margin.top, height - margin.bottom])
            .rangeRound(d3.extent(outdata, d => d.y));

        x = d3.scaleLinear()
            .domain(d3.extent(outdata, d => d.x))
            .rangeRound([margin.left + 10, width - margin.right]);  
 
        rx = d3.scaleLinear()
            .domain([margin.left + 10, width - margin.right])
            .rangeRound(d3.extent(outdata, d => d.x));    

        yAxis = g => g.attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.selectAll(".tick line").clone().attr("stroke-opacity", 0.1).attr("x2", width - margin.right - margin.left))
            .call(g => g.selectAll(".domain").remove());

        xAxis = g => g.attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(x))
            .call(g => g.selectAll(".tick line").clone().attr("stroke-opacity", 0.1).attr("y2", height - margin.bottom - margin.top))
            .call(g => g.selectAll(".domain").remove());

        svg = d3.select('#knn-svg')
        .attr("viewBox", [0, 0, width, height]);

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.append("g")
            .attr("class", "tcircles")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .selectAll("circle")
            .data(outdata)   
            .join("circle")
            .attr("stroke", d => color[d.label])
            .attr("r", r)
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .append("title")
            .text(d => `label: ${d.label}  (${(d.x)},  ${d.y})`);

        const circles = d3.range(1).map(i => ({
            x: 50,
            y: 50,
        }));
        point.x = 50;
        point.y = 50;
        svg.append('g')
            .selectAll("circle")
            .data(circles)
            .join("circle")
            .attr("fill", "yellow")
            .attr("stroke", "#C4C400")
            .attr("r", r)
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
        sortdata = outdata;
        sortdata.sort((a, b) =>{
            let distance1 = (a.x - point.x)**2 + (a.y - point.y)**2;
            let distance2 = (b.x - point.x)**2 + (b.y - point.y)**2;
            return distance1 - distance2;
        })
        kdata = sortdata.slice(0, k);
        link = svg.insert("g", ".tcircles")
            .attr("id", "lines")
            .selectAll("line")
            .data(kdata)
            .join("line")
            .attr("stroke", d => color[d.label])
            .style('opacity', 0.5)
            .attr("x1", x(point.x))
            .attr("y1", y(point.y))
            .attr("x2", d => x(d.x))
            .attr("y2", d => y(d.y))
        
        d3.select('#num-k').text("k = " + k);
        d3.select("#add-layers").on("click", () => {
            k++;
            let diff = 1;
            if (k > 10) {
                k = 10;
                diff = 0;
            }
            d3.select("#num-k").text("k = " + k);
            drawklines(diff);
        });

        d3.select("#remove-layers").on("click", () => {
            k--;
            let diff = -1;
            if (k <= 0) {
                k = 1;
                diff = 0;
            }
            d3.select("#num-k").text("k = " + k);
            drawklines(diff);
        });
        countlabelnums();
    })

    function drawklines(diff){
        sortdata.sort((a, b) =>{
            let distance1 = (a.x - point.x)**2 + (a.y - point.y)**2;
            let distance2 = (b.x - point.x)**2 + (b.y - point.y)**2;
            return distance1 - distance2;
        });
        kdata = sortdata.slice(0, k);
        if(diff > 0){
            link = d3.select("#lines").selectAll("line");
            link.data(kdata)
            .enter()
            .append('line')
            .transition()
            .duration(1000)
            .attr("stroke", d => color[d.label]) 
            .style('opacity', 0.5)
            .attr("x1", x(point.x))
            .attr("y1", y(point.y))
            .attr("x2", d => x(d.x))
            .attr("y2", d => y(d.y));

        }else if(diff < 0){
            link = d3.select("#lines").selectAll("line");
            link.data(kdata)
            .exit()
            .transition()
            .duration(100)
            .remove()
            .attr("stroke", d => color[d.label])
            .style('opacity', 0.5)
            .attr("x1", x(point.x))
            .attr("y1", y(point.y))
            .attr("x2", d => x(d.x))
            .attr("y2", d => y(d.y));

        }else{
            link.data(kdata)
            .transition()
            .duration(1000)
            .attr("x1", x(point.x))
            .attr("y1", y(point.y))
            .attr("x2", d => x(d.x))
            .attr("y2", d => y(d.y))
            .attr("stroke", d => color[d.label]) 
            .style('opacity', 0.5);
        }
    }

    function dragstarted(d){
        link = d3.select("#lines").selectAll("line");
        d3.select(this).attr("stroke", "black");
    }

    function dragged(d){
        d3.select(this).raise().attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        point.x = rx(d3.event.x)
        point.y = ry(d3.event.y)
        link.data(kdata)
            .attr("x1", x(point.x))
            .attr("y1", y(point.y))
            .attr("x2", d => x(d.x))
            .attr("y2", d => y(d.y))
    }
    function dragended(d){
        d3.select(this).attr("stroke", "#C4C400");
        if(d3.event.x > width - margin.right || d3.event.x < margin.left + 10){
            d3.select(this).attr("cx", d.x = x(50));
            point.x = 50;
        }else if(d3.event.y > height - margin.bottom || d3.event.y < margin.top){
            d3.select(this).attr("cy", d.y = y(50));
            point.y = 50;
        }else{
            point.x = rx(d3.event.x)
            point.y = ry(d3.event.y) 
        }
        drawklines(0);
        countlabelnums();
    }

    function countlabelnums(){
        counts = {"apple": 0, "blueberry": 0, "watermelon": 0};
        for(let i=0; i<k; ++i){
            counts[kdata[i].label] += 1;
        }
        let max_num = 0;
        let keys = Object.keys(counts);
        for(let i=0; i<keys.length; ++i){
            if(counts[keys[i]] > max_num){
                max_num = counts[keys[i]];
                testlabel = keys[i];
            }
        }
    }

    function swatches({
        color,
        format = x => x,
        swatchSize = 20,
        swatchWidth = swatchSize,
        swatchHeight = swatchSize,
        marginLeft = 0
    }) {
        const id = 'color-legend2';
    
        return `<div style="display: flex; align-items: center; min-height: 33px; margin-left: ${+marginLeft}px; font: 10px sans-serif; float: right">
        <style>

        .${id} {
        display: inline-flex;
        align-items: center;
        margin-right: 2em;
        }

        .${id}::before {
        content: "";
        width: ${+swatchWidth}px;
        height: ${+swatchHeight}px;
        margin-right: 0.5em;
        background: var(--color);
        }

        </style>
        <div>${color.domain().map(
            value => `<span class="${id}" style="--color: ${color(value)}">${value}</span>`).join("")}</div>`;
    }
</script>

<style>
	.box {
		width: 150px;
		border: 1px solid #aaa;
		border-radius: 2px;
		box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
		padding: 1em;
		margin: 0 0 0.5em 0;
        position:absolute;
        left: 880px;
        top:-598px;
        border-radius: 5px;
	}
    .box1 {
		width: 880px;
		border: 1px solid #aaa;
		border-radius: 2px;
		box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
		padding: 1em;
		margin: 0 0 0.5em 0;
        border-radius: 5px;
	}
    .clearfix{
        width: 880px;
		border: 1px solid #aaa;
		border-radius: 2px;
		box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
		padding: 1em;
		margin: 0 0 0.5em 0;
        border-radius: 5px;
    }
    .clearfix:after {
        content: '.';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
</style>


<div class="knn">
    <div id="top-legends" class="clearfix">
        <div style="float: left; margin-right: 5px;">
            <div class="ui-numHiddenLayers" style="float: left; margin-right: 15px;">
                <button id="add-layers" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                    <i class="material-icons">add</i>
                </button>
                <button id="remove-layers" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                    <i class="material-icons">remove</i>
                </button>
            </div>
            <span id="num-k" style="float: left; margin-right: 5px; font-size: 25px"></span>
        </div>

        {@html strlegend}
    </div>
    <div id="knn-graph">
        <div class="box1"> 
            <svg id="knn-svg"></svg>
        </div>
        <div class="box" style="position: relative;">
            <slot>
                <p style="font-size: 25px;">{testlabel} </p>
                {#each labels as label, i}
                    <p>{label} : {counts[label]}</p>
                {/each}
            </slot>
        </div>
    </div>
</div>
