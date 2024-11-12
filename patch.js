document.addEventListener('DOMContentLoaded', () => {
    const athletes = [
        { name: '张继科', stats: [85, 90, 86, 89, 80, 86] },
        { name: '许昕', stats: [80, 74, 85, 60, 80, 90] },
        { name: '樊振东', stats: [80, 90, 86, 70, 85, 90] },
        { name: '马龙', stats: [97, 95, 95, 98, 92, 90] }
    ];

    const categories = ['正手', '反手', '接发球', '发球', '创造力', '耐力'];

    const svg = d3.select('#bar-chart')
        .attr('width', 700)
        .attr('height', 550);

    const x = d3.scaleBand()
        .domain(athletes.map((athlete) => athlete.name))
        .range([0, 600])
        .padding(0.5); 

    const y = d3.scaleLinear()
        .domain([0, 620]) 
        .range([400, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const stack = d3.stack()
        .keys(categories)
        .value((d, key) => d.stats[categories.indexOf(key)]);

    const series = stack(athletes);

    svg.selectAll('.series')
        .data(series)
        .enter()
        .append('g')
        .attr('class', 'series')
        .attr('fill', (d, i) => color(i))
        .selectAll('rect')
        .data(d => d)
        .enter()
        .append('rect')
        .attr('x', d => x(d.data.name))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth() * 0.9);

    svg.append('g')
        .attr('transform', 'translate(0,400)')
        .call(d3.axisBottom(x))
        .append('text')
        .attr('x', 300)  
        .attr('y', 30)  
        .attr('fill', 'black')
        .style('text-anchor', 'middle')

    const yAxis = d3.axisLeft(y)
        .ticks(10) 
        .tickFormat(d3.format("d")); 

    svg.append('g')
        .attr('transform', 'translate(30,0)') 
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)') 
        .attr('y', -80) 
        .attr('x', -200) 
        .attr('fill', 'black')
        .style('text-anchor', 'middle')

    athletes.forEach((athlete) => {
        const totalScore = athlete.stats.reduce((sum, score) => sum + score, 0);
        svg.append('text')
            .attr('x', x(athlete.name) + x.bandwidth() / 2) 
            .attr('y', y(d3.sum(athlete.stats)) - 5) 
            .attr('text-anchor', 'middle')
            .text(totalScore)
            .style('fill', 'black')
            .style('font-size', '12px');
    });

    const legend = svg.append('g')
        .attr('transform', 'translate(620, 50)'); 

    categories.forEach((category, i) => {
        legend.append('rect')
            .attr('x', 0)
            .attr('y', i * 20) 
            .attr('width', 18)
            .attr('height', 18)
            .attr('fill', color(i)); 

        legend.append('text')
            .attr('x', 25) 
            .attr('y', i * 20 + 14) 
            .text(category)
            .style('font-size', '12px');
    });
});
