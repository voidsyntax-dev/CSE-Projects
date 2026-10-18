"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useRouter } from "next/navigation";
import { getSkillsForCareer } from "@/lib/data";

interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
}
interface D3Link extends d3.SimulationLinkDatum<D3Node> {}

export default function SkillGraph({ careerId }: { careerId: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const simRef = useRef<d3.Simulation<D3Node, undefined> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!svgRef.current) return;

    // Dimensions
    const width = 800;
    const height = 500;

    async function drawGraph() {
      const careerSkills = await getSkillsForCareer(careerId);
      // Prepare data map
      const nodes: D3Node[] = careerSkills.map((skill) => ({
        id: skill.id,
        label: skill.name
      }));
      
      const links: D3Link[] = [];

      // Build edges exactly per dependencies targeting nodes within the graph
      careerSkills.forEach((skill) => {
        skill.dependsOn?.forEach((dep) => {
          // Only valid if dependency is naturally inside the career layout
          if (careerSkills.some(s => s.id === dep)) {
            links.push({ source: dep, target: skill.id });
          }
        });
      });


    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear on re-render

    const isDark = document.documentElement.classList.contains("dark");
    const labelColor = isDark ? "#e4e4e7" : "#374151";
    const bgColor = isDark ? "#18181b" : "white";
    const lineColor = isDark ? "#3f3f46" : "#d1d5db";
    const arrowColor = isDark ? "#71717a" : "#9ca3af";

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto")
      .style("cursor", "grab")
      .style("background-color", bgColor);

    // Defs for arrowheads
    svg
      .append("defs")
      .selectAll("marker")
      .data(["end"])
      .enter()
      .append("marker")
      .attr("id", (d) => d)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25) // Offset to account for node radius
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", arrowColor)
      .attr("d", "M0,-5L10,0L0,5");

    // Force Simulation setup
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(120) // Adjust distance between connected nodes
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60));
      
    simRef.current = simulation as any;

    // Draw Links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#end)");

    // Drag Handlers
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Define Node Group
    const nodeGroup = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        // Prevent router triggers strictly on drags
        if (event.defaultPrevented) return;
        router.push(`/skills/${d.id}`);
      })
      .call(
        d3.drag<SVGGElement, D3Node, D3Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      );

    // Node Circles
    const circle = nodeGroup
      .append("circle")
      .attr("r", 15)
      .attr("fill", "#3b82f6")
      .attr("stroke", "#eff6ff")
      .attr("stroke-width", 3)
      .style("transition", "all 0.2s ease")
      .on("mouseover", function () {
        d3.select(this).attr("r", 20).attr("fill", "#2563eb");
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 15).attr("fill", "#3b82f6");
      });

    // Node Labels
    const label = nodeGroup
      .append("text")
      .text((d) => d.label)
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", labelColor)
      .attr("text-anchor", "middle")
      .attr("dy", 35) // Position below the circle
      .style("user-select", "none")
      .style("pointer-events", "none");

    // Ticker to update positions during simulation
    const padding = 40;
    
    simulation.on("tick", () => {
      // Clamping bounds to not fly off SVG render
      nodes.forEach((d: any) => {
        d.x = Math.max(padding, Math.min(width - padding, d.x));
        d.y = Math.max(padding, Math.min(height - padding, d.y));
      });
      
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    }
    drawGraph();

    return () => {
      if (simRef.current) simRef.current.stop();
    };
  }, [careerId, router]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-black/[.08] dark:border-white/[.145] shadow-sm bg-white dark:bg-zinc-900 p-2">
      <svg ref={svgRef} className="w-full h-full block" />
    </div>
  );
}
