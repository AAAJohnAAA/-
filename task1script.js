const svg = d3.select("#sankey");
const width = (window.innerWidth * 2) / 3; 
const height = width * 2; 
svg.attr("width", width)
   .attr("height", height);

svg.append("rect")
   .attr("x", 0)
   .attr("y", 0)
   .attr("width", width)
   .attr("height", height)
   .attr("fill", "none")
   .attr("stroke", "#333")
   .attr("stroke-width", 2);


const nodes = [
    { name: '天津（南开大学）', cx: 60, cy: 650, r: 5 }, 
];

const rightNodes = [
    { name: '黑龙江', latitude: 45.76 },
    { name: '吉林', latitude: 43.89 },
    { name: '辽宁', latitude: 41.80 },
    { name: '内蒙古', latitude: 40.82 },
    { name: '山西', latitude: 37.86 },
    { name: '北京', latitude: 39.90 },
    { name: '天津', latitude: 39.13 },
    { name: '河北', latitude: 38.05 },
    { name: '山东', latitude: 36.68 },
    { name: '河南', latitude: 34.76 },
    { name: '江苏', latitude: 32.04 },
    { name: '安徽', latitude: 31.86 },
    { name: '江西', latitude: 28.68 },
    { name: '湖北', latitude: 30.58 },
    { name: '重庆', latitude: 29.53 },
    { name: '湖南', latitude: 28.19 },
    { name: '四川', latitude: 31.20 },
    { name: '贵州', latitude: 26.58 },
    { name: '云南', latitude: 25.04 },
    { name: '福建', latitude: 26.08 },
    { name: '广东', latitude: 23.13 },
    { name: '海外', latitude: 22 }, 
];

const rightNodeYStart = 50; 
const rightNodeYEnd = 2150; 

const latitudeScale = d3.scaleLinear()
    .domain([d3.max(rightNodes, d => d.latitude), d3.min(rightNodes, d => d.latitude)])
    .range([rightNodeYStart, rightNodeYEnd]);


rightNodes.forEach((node) => {
    node.cx = width - 200; 
    node.cy = latitudeScale(node.latitude); 
    node.r = 5; 
});

nodes[0].cy=rightNodes[6].cy;

nodes.push(...rightNodes);

const links = rightNodes.map(target => ({
    source: '天津（南开大学）', 
    target: target.name, 
}));

svg.selectAll("circle")
   .data(nodes)
   .enter()
   .append("circle")
   .attr("cx", d => d.cx)
   .attr("cy", d => d.cy)
   .attr("r", d => d.r * 0.9) 
   .attr("fill", "rgba(300, 50, 50, 1.0)"); 


svg.selectAll("text")
   .data(nodes)
   .enter()
   .append("text")
   .attr("x", d => d.cx-40) 
   .attr("y", d => d.cy + 20) 
   .attr("fill", "black")
   .style("font-size", "12px") 
   .text(d => d.name);




const lineX = width - 200; 
const lineYStart = rightNodeYStart; 
const lineYEnd = rightNodeYEnd + 50; 

svg.append("line")
   .attr("x1", lineX)
   .attr("y1", lineYStart)
   .attr("x2", lineX)
   .attr("y2", lineYEnd)
   .attr("stroke", "#333")
   .attr("stroke-width", 2);

svg.append("defs")
   .append("marker")
   .attr("id", "arrow")
   .attr("viewBox", "0 0 10 10")
   .attr("refX", 10) 
   .attr("refY", 5) 
   .attr("markerWidth", 6) 
   .attr("markerHeight", 6)
   .attr("orient", "auto") 
   .append("polygon")
   .attr("points", "11,5 0,0 0,10") 
   .attr("fill", "#333");

const l2Y = lineYEnd; 
const l2Xstart = lineX; 
const l2end = l2Xstart + 150;
svg.append("line")
   .attr("x1", l2Xstart)
   .attr("y1", l2Y)
   .attr("x2", l2end)
   .attr("y2", l2Y)
   .attr("stroke", "#333")
   .attr("stroke-width", 2)
   .attr("stroke-dasharray", "5,5")
   .attr("marker-end", "url(#arrow)");
svg.append("line")
   .attr("x1", l2Xstart)
   .attr("y1", rightNodeYStart)
   .attr("x2", l2Xstart)
   .attr("y2", rightNodeYStart-40)
   .attr("stroke", "#333")
   .attr("stroke-width", 2)
   .attr("marker-end", "url(#arrow)"); 
svg.append("text")
   .attr("x", l2Xstart - 50)
   .attr("y", rightNodeYStart - 15)
   .attr("fill", "black")
   .text("纬度");


svg.append("text")
   .attr("x", l2Xstart-50) 
   .attr("y", l2Y + 20) 
   .attr("fill", "black")
   .text("各地报考人数");

d3.csv("data/hdt.csv").then(data => {
    const fPoints = []; 
    rightNodes.forEach((node, index) => {
        const value = +data[index].Data; 
        const fNode = {
            name: `f${index+1}`, 
            cx: node.cx + value*10, 
            cy: node.cy, 
            r: 5 
        };
        fPoints.push(fNode); 
        svg.append("circle")
           .attr("cx", fNode.cx)
           .attr("cy", fNode.cy)
           .attr("r", fNode.r*0.9)
           .attr("fill", "rgba(100, 100, 255, 1.0)"); 
        svg.append("text")
           .attr("x", fNode.cx + 10) 
           .attr("y", fNode.cy + 5) 
           .attr("fill", "black")
           .text(data[index].Data);
    });

    fPoints.sort((a, b) => a.cy - b.cy);

    

    const lineGenerator = d3.line()
        .x(d => d.cx)
        .y(d => d.cy)
        .curve(d3.curveMonotoneY); 
    
    svg.append("path")
        .datum(fPoints) 
        .attr("d", lineGenerator) 
        .attr("fill", "none")
        .attr("stroke", "rgba(100, 100, 255, 0.8)")
        .attr("stroke-width", 2); 
});

d3.csv("data/hdt.csv").then(data => {
    const sourceNode = nodes[0]; 
    rightNodes.forEach((targetNode, index) => {
        const wid = +data[index].Data; 
        const width = 2*wid; 
        const midX = (sourceNode.cx + targetNode.cx) / 2; 

        const dim=width/0.5;
        for (let i = 0; i <= dim; i++){
            const dy=width/dim;
            const curvetp = `M${sourceNode.cx + sourceNode.r} ${sourceNode.cy} 
                        C${midX} ${sourceNode.cy - dy*i}, 
                        ${midX} ${targetNode.cy - dy*i}, 
                        ${targetNode.cx - targetNode.r} ${targetNode.cy}`;
            svg.append("path")
                .attr("d", curvetp)
                .attr("fill", "none")
                .attr("stroke", "rgba(200, 100, 100, 0.5)")
                .attr("stroke-width", 1); 


        }
        for (let i = 1; i <= dim; i++){
            const dy=width/dim;
            const curvetp = `M${sourceNode.cx + sourceNode.r} ${sourceNode.cy} 
                        C${midX} ${sourceNode.cy + dy*i}, 
                        ${midX} ${targetNode.cy + dy*i}, 
                        ${targetNode.cx - targetNode.r} ${targetNode.cy}`;
            svg.append("path")
                .attr("d", curvetp)
                .attr("fill", "none")
                .attr("stroke", "rgba(200, 100, 100, 0.5)")
                .attr("stroke-width", 1); 


        }
    });



});