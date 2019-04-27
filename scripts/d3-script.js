let updateGraph = () => {
    document.getElementById('chart-area').innerHTML = '';
    const margin = { left: 100, right: 10, top: 10, bottom: 150 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");
    const g = d3.select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
    // x label
    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 100)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text(() => {
            switch (interval) {
                case 'daily':
                    return 'Days';
                case 'weekly':
                    return 'Weeks';
                case 'monthly':
                    return 'Months';
            }
        });
    // y label
    g.append("text")
        .attr("class", "y axis-label")
        .attr("x", - (height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Activity - Number of posts");
    const x = d3.scaleBand()
        .domain(dateStr.reverse())
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);
    const y = d3.scaleLinear()
        .domain([0, 1.05 * d3.max(frequencies)])
        .range([height, 0]);
    const xAxisCall = d3.axisBottom(x)
        .ticks(3);
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-45)");
    const yAxisCall = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(d => { return d + " tweets"; });
    g.append("g")
        .attr("class", "y-axis")
        .call(yAxisCall);
    const rects = g.selectAll("rect")
        .data(counts);
    rects.exit().remove();
    rects
        .attr("y", d => { return y(d.frequency); })
        .attr("x", d => { return x(d.date_str); })
        .attr("width", x.bandwidth)
        .attr("height", d => { return height - y(d.frequency); });
    rects.enter()
        .append("rect")
        .attr("y", d => { return y(d.frequency); })
        .attr("x", d => { return x(d.date_str); })
        .attr("width", x.bandwidth)
        .attr("height", d => { return height - y(d.frequency); })
        .attr("fill", "blue")
        .on("mouseover", d => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("<p>" + d.frequency + " tweets </p>" + "\n" + "<p>" + d.date_str + "</p>")
                .style("display", "block")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        ;
};