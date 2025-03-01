'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Compass = ({
  xValue,
  yValue,
  aiModels = [],
  showUserPosition = true,
  defaultView, // New prop
}) => {
  const svgRef = useRef(null);
  const normalizedX = Math.max(-1, Math.min(1, xValue));
  const normalizedY = Math.max(-1, Math.min(1, yValue));

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const width = 400;
    const height = 400;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-50, -50, width + 100, height + 100])
      .attr('style', 'max-width: 100%; height: auto;');

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#0f172a');

    // Grid lines
    const gridGroup = svg.append('g').attr('class', 'grid');
    for (let i = 0; i <= width; i += 20) {
      gridGroup
        .append('line')
        .attr('x1', i)
        .attr('y1', 0)
        .attr('x2', i)
        .attr('y2', height)
        .attr('stroke', 'rgba(74, 222, 128, 0.2)')
        .attr('stroke-width', 1);
    }
    for (let i = 0; i <= height; i += 20) {
      gridGroup
        .append('line')
        .attr('x1', 0)
        .attr('y1', i)
        .attr('x2', width)
        .attr('y2', i)
        .attr('stroke', 'rgba(74, 222, 128, 0.2)')
        .attr('stroke-width', 1);
    }

    // Axes
    const axesGroup = svg.append('g').attr('class', 'axes');
    axesGroup
      .append('line')
      .attr('x1', 0)
      .attr('y1', height / 2)
      .attr('x2', width)
      .attr('y2', height / 2)
      .attr('stroke', 'rgba(74, 222, 128, 0.8)')
      .attr('stroke-width', 1);
    axesGroup
      .append('line')
      .attr('x1', width / 2)
      .attr('y1', 0)
      .attr('x2', width / 2)
      .attr('y2', height)
      .attr('stroke', 'rgba(74, 222, 128, 0.8)')
      .attr('stroke-width', 1);

    // Axis labels
    const labelsGroup = svg.append('g').attr('class', 'labels');
    let offset = 20;
    labelsGroup
      .append('text')
      .attr('x', -offset)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f8fafc')
      .attr('font-family', '"Geist Mono", monospace')
      .attr('font-size', '14px')
      .attr('transform', `rotate(-90, ${-offset}, ${height / 2})`)
      .text('No Alignment');
    labelsGroup
      .append('text')
      .attr('x', width + offset)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f8fafc')
      .attr('font-family', '"Geist Mono", monospace')
      .attr('font-size', '14px')
      .attr('transform', `rotate(90, ${width + offset}, ${height / 2})`)
      .text('Pro Alignment');
    labelsGroup
      .append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'bottom')
      .attr('fill', '#f8fafc')
      .attr('font-family', '"Geist Mono", monospace')
      .attr('font-size', '14px')
      .text('Closed Source');
    labelsGroup
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 30)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging')
      .attr('fill', '#f8fafc')
      .attr('font-family', '"Geist Mono", monospace')
      .attr('font-size', '14px')
      .text('Open Source');

    // Quadrant backgrounds and labels
    const quadrantsGroup = svg.append('g').attr('class', 'quadrants');

    const quadrants = [
      {
        x: 0,
        y: 0,
        width: width / 2,
        height: height / 2,
        label: 'Cautious Gatekeeper',
        color: 'rgba(139, 92, 246, 0.3)',
      },
      {
        x: width / 2,
        y: 0,
        width: width / 2,
        height: height / 2,
        label: 'Regulated Innovation',
        color: 'rgba(45, 212, 191, 0.3)',
      },
      {
        x: 0,
        y: height / 2,
        width: width / 2,
        height: height / 2,
        label: 'Open Experimentation',
        color: 'rgba(251, 191, 36, 0.3)',
      },
      {
        x: width / 2,
        y: height / 2,
        width: width / 2,
        height: height / 2,
        label: 'Aligned Openness',
        color: 'rgba(244, 63, 94, 0.3)',
      },
    ];

    const backgrounds = [];
    const labels = [];

    quadrants.forEach((q) => {
      const bg = quadrantsGroup
        .append('rect')
        .attr('x', q.x)
        .attr('y', q.y)
        .attr('width', q.width)
        .attr('height', q.height)
        .attr('fill', q.color)
        .attr('opacity', defaultView ? 1 : 0) // Show by default if defaultView is true
        .style('transition', 'opacity 0.3s ease');

      const label = quadrantsGroup
        .append('text')
        .attr('x', q.x + q.width / 2)
        .attr('y', q.y + q.height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(248, 250, 252, 0.9)')
        .attr('font-family', '"Geist Mono", monospace')
        .attr('font-size', '12px')
        .attr('opacity', defaultView ? 1 : 0) // Show by default if defaultView is true
        .style('transition', 'opacity 0.3s ease')
        .style('pointer-events', 'none')
        .text(q.label);

      backgrounds.push(bg);
      labels.push(label);
    });

    // Only add hover overlay if not in defaultView
    if (!defaultView) {
      const hoverOverlay = svg
        .append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'transparent')
        .attr('pointer-events', 'all');

      hoverOverlay
        .on('mouseover', () => {
          backgrounds.forEach((bg) => bg.attr('opacity', 1));
          labels.forEach((label) => label.attr('opacity', 1));
        })
        .on('mouseout', () => {
          backgrounds.forEach((bg) => bg.attr('opacity', 0));
          labels.forEach((label) => label.attr('opacity', 0));
        });
    }

    // Only render models and user position if not in defaultView
    if (!defaultView) {
      // AI models
      const modelsGroup = svg.append('g').attr('class', 'models');
      aiModels.forEach((model) => {
        const modelX = (model.x + 1) * (width / 2);
        const modelY = (model.y + 1) * (height / 2);
        modelsGroup
          .append('circle')
          .attr('cx', modelX)
          .attr('cy', modelY)
          .attr('r', 6)
          .attr('fill', model.color || '#f8fafc');

        modelsGroup
          .append('text')
          .attr(
            'x',
            model.name === 'o1 Pro' || model.name === 'Gemini 2.0 Flash'
              ? modelX - 10
              : modelX + 10
          )
          .attr('y', modelY + 4)
          .attr(
            'text-anchor',
            model.name === 'o1 Pro' || model.name === 'Gemini 2.0 Flash'
              ? 'end'
              : 'start'
          )
          .attr('fill', model.color || '#f8fafc')
          .attr('font-family', '"Geist Mono", monospace')
          .attr('font-size', '10px')
          .style('pointer-events', 'none')
          .text(model.name);
      });

      // User position
      if (showUserPosition) {
        const posX = (normalizedX + 1) * (width / 2);
        const posY = (normalizedY + 1) * (height / 2);

        const defs = svg.append('defs');
        const gradient = defs
          .append('radialGradient')
          .attr('id', 'userGlow')
          .attr('cx', '50%')
          .attr('cy', '50%')
          .attr('r', '50%');
        gradient
          .append('stop')
          .attr('offset', '0%')
          .attr('stop-color', 'rgba(34, 211, 238, 1)');
        gradient
          .append('stop')
          .attr('offset', '70%')
          .attr('stop-color', 'rgba(34, 211, 238, 0.3)');
        gradient
          .append('stop')
          .attr('offset', '100%')
          .attr('stop-color', 'rgba(34, 211, 238, 0)');

        svg
          .append('circle')
          .attr('cx', posX)
          .attr('cy', posY)
          .attr('r', 20)
          .attr('fill', 'url(#userGlow)');
        svg
          .append('circle')
          .attr('cx', posX)
          .attr('cy', posY)
          .attr('r', 8)
          .attr('fill', '#22d3ee');
        svg
          .append('text')
          .attr('x', posX + 15)
          .attr('y', posY + 5)
          .attr('text-anchor', 'start')
          .attr('fill', '#22d3ee')
          .attr('font-family', '"Geist Mono", monospace')
          .attr('font-size', '12px')
          .style('pointer-events', 'none')
          .text('You');
      }
    }
  }, [normalizedX, normalizedY, aiModels, showUserPosition, defaultView]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="p-4 bg-slate-800 border border-cyan-500/30 rounded-lg shadow-lg shadow-cyan-500/20">
        <h2 className="text-xl font-bold text-center mb-4 text-cyan-400 font-mono">
          AI SAFETY COMPASS
        </h2>
        <svg
          ref={svgRef}
          width={400}
          height={400}
          className="w-full rounded-md"
        />
        {showUserPosition && !defaultView && (
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
              <span>X: {normalizedX.toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
              <span>Y: {normalizedY.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compass;
