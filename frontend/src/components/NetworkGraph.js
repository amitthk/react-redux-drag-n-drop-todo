import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const NetworkGraph = ({ todos = [], projects = [], links = [] }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!todos.length || !projects.length || !links.length) return;

    const width = 600;
    const height = 400;

    // Ensure each node has x and y positions
    const nodes = [
      ...todos.map((todo) => ({
        ...todo,
        type: "todo",
        id: `todo-${todo.id}`,
        x: Math.random() * width,
        y: Math.random() * height
      })),
      ...projects.map((project) => ({
        ...project,
        type: "project",
        id: `project-${project.id}`,
        x: Math.random() * width,
        y: Math.random() * height
      }))
    ];

    // Map link connections properly
    const edges = links
      .map((link) => {
        const sourceNode = nodes.find((n) => n.id === `todo-${link.todoId}`);
        const targetNode = nodes.find((n) => n.id === `project-${link.projectId}`);
        return sourceNode && targetNode ? { source: sourceNode, target: targetNode } : null;
      })
      .filter(Boolean);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove(); // Clear previous graph

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id((d) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(20));

    // Draw links (edges)
    const link = svg
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 2);

    // Draw nodes (circles)
    const node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d) => (d.type === "todo" ? "blue" : "green"))
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
      );

    // Add node labels
    const text = svg
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("dx", 12)
      .attr("dy", 4)
      .text((d) => d.name || d.text)
      .style("font-size", "12px")
      .style("fill", "black");

    // Simulation update on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      text.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    // Drag event functions
    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [todos, projects, links]);

  return <div className="row"><svg ref={svgRef}></svg></div>;
};

export default NetworkGraph;
