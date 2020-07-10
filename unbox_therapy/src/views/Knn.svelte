<script>
    import { onMount } from 'svelte';
    let outdata;
    let sortdata;
    let kdata;
    const color = {1: 'red', 2:'steelblue', 3:'green'}
    const margin = {top: 20, right: 10, bottom: 10, left: 40};
    const height = 280;
    const width = 500;
    const r = 3.5;
    let k = 6;
    let xAxis;
    let yAxis;
    let y, ry;
    let x, rx;
    let point = {};
    let link;

    
    onMount(async () => {
        const data = await d3.csv("PUBLIC_URL/assets/data/test.csv");
        // const data = d3.csvParse(await FileAttachment("PUBLIC_URL/assets/data/us-population-state-age.csv").text(), d3.autoType);
        // const ages = data.columns.slice(1);
        // for (const d of data) d.total = d3.sum(ages, age => d[age]);
        // outdata = ages.flatMap(age => data.map(d => ({name: d.name, age, value: d[age] / d.total})));

        const labels = data.columns.slice(1);
        outdata = data.map(d => ({x: d.x, y: d.y, label: d.label}));

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

        const svg = d3.select('#knn-svg')
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
            .selectAll("line")
            .data(kdata)
            .join("line")
            .attr("stroke", d => color[d.label])
            .style('opacity', 0.5)
            .attr("x1", x(point.x))
            .attr("y1", y(point.y))
            .attr("x2", d => x(d.x))
            .attr("y2", d => y(d.y))
        
    })

    function dragstarted(d){
        d3.select(this).attr("stroke", "black");
    }

    function dragged(d){
        d3.select(this).raise().attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        point.x = rx(d3.event.x)
        point.y = ry(d3.event.y)
        link.attr("x1", x(point.x))
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
        sortdata.sort((a, b) =>{
            let distance1 = (a.x - point.x)**2 + (a.y - point.y)**2;
            let distance2 = (b.x - point.x)**2 + (b.y - point.y)**2;
            return distance1 - distance2;
        });
        kdata = sortdata.slice(0, k);
        link.data(kdata)
            .transition()
            .duration(1000)
            .attr("x1", x(point.x))
            .attr("y1", y(point.y))
            .attr("x2", d => x(d.x))
            .attr("y2", d => y(d.y))
            .attr("stroke", d => color[d.label])
    }

</script>

<div class="knn">
    <svg id="knn-svg"></svg>
</div>
