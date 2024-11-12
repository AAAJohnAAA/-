document.addEventListener('DOMContentLoaded', () => {
    const athletes = [
        { name: '张继科', stats: [85, 90, 86, 89, 80, 86] },
        { name: '许昕', stats: [80, 74, 85, 60, 80, 90] },
        { name: '樊振东', stats: [80, 90, 86, 70, 85, 90] },
        { name: '马龙', stats: [97, 95, 95, 98, 92, 90] }
    ];

    const categories = ['正手', '反手', '接发球', '发球', '创造力', '耐力'];
    const margin = { top: 20, right: 120, bottom: 20, left: 20 }; 
    const width = 800 - margin.left - margin.right; 
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select('#radar-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const angleSlice = (Math.PI * 2) / categories.length;
    const radius = Math.min(width, height) / 2;

    const radarBackground = d3.range(1, 6).map(i => {
        const points = new Array(categories.length).fill(1).map((_, j) => {
            const angle = angleSlice * j;
            return [
                Math.cos(angle) * (i * radius) / 5,
                Math.sin(angle) * (i * radius) / 5
            ];
        });

        points.push(points[0]);
        return d3.line()(points); 
    });

    svg.selectAll('.background')
        .data(radarBackground)
        .enter()
        .append('path')
        .attr('class', 'background')
        .attr('d', d => d)
        .style('fill', 'lightgrey') 
        .style('opacity', 0.5);

    svg.selectAll('.scale')
        .data(radarBackground)
        .enter()
        .append('path')
        .attr('class', 'scale')
        .attr('d', d => d)
        .style('fill', 'none') 
        .style('stroke', 'black')
        .style('stroke-width', 1);

    categories.forEach((category, index) => {
        const angle = angleSlice * index;
        const x = Math.cos(angle) * (radius) * 1.1; 
        const y = Math.sin(angle) * (radius) * 1.1;

        svg.append('text')
            .attr('x', x)
            .attr('y', y)
            .style('font-size', '12px')
            .style('text-anchor', 'middle')
            .text(category);
    });

    

    athletes.forEach((athlete, athleteIndex) => {
        const totalScore = athlete.stats.reduce((sum, score) => sum + score, 0); 
        const points = athlete.stats.map((stat, index) => {
            const angle = angleSlice * index;
            return [
                Math.cos(angle) * ((stat - 0) / 100) * radius,
                Math.sin(angle) * ((stat - 0) / 100) * radius
            ];
        });

        points.push(points[0]); 

        svg.append('path')
            .datum(points)
            .attr('class', 'athlete')
            .attr('d', d3.line())
            .style('fill', 'none') 
            .style('stroke', d3.schemeCategory10[athleteIndex]) 
            .style('stroke-width', totalScore / 80) 
            .style('opacity', 0.7);

        svg.append('text')
            .attr('x', radius + 50) 
            .attr('y', (athleteIndex - athletes.length / 2) * 20)
            .style('fill', d3.schemeCategory10[athleteIndex])
            .style('font-size', '12px')
            .text(athlete.name);
    });

    svg.append('text')
        .attr('x', 55) 
        .attr('y', -10) 
        .style('font-size', '12px') 
        .style('fill', 'red') 
        .style('text-anchor', 'middle') 
        .text('20'); 

    svg.append('text')
        .attr('x', 110) 
        .attr('y', -10) 
        .style('font-size', '12px') 
        .style('fill', 'red') 
        .style('text-anchor', 'middle') 
        .text('40'); 

    svg.append('text')
        .attr('x',170) 
        .attr('y', -10) 
        .style('font-size', '12px') 
        .style('fill', 'red') 
        .style('text-anchor', 'middle') 
        .text('60'); 


    svg.append('text')
        .attr('x', 200) 
        .attr('y', -10) 
        .style('font-size', '12px') 
        .style('fill', 'red') 
        .style('text-anchor', 'middle') 
        .text('80'); 


    svg.append('text')
        .attr('x', 280) 
        .attr('y', -15) 
        .style('font-size', '12px') 
        .style('fill', 'red') 
        .style('text-anchor', 'middle') 
        .text('100'); 
});
