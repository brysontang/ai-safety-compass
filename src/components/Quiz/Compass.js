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

    const width = 600;
    const height = 600;
    const margin = { top: 15, right: 15, bottom: 15, left: 15 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-75, -75, width + 150, height + 150])
      .attr('style', 'max-width: 100%; height: auto;');

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#0f172a');

    // Grid lines
    const gridGroup = svg.append('g').attr('class', 'grid');
    for (let i = 0; i <= width; i += 30) {
      gridGroup
        .append('line')
        .attr('x1', i)
        .attr('y1', 0)
        .attr('x2', i)
        .attr('y2', height)
        .attr('stroke', 'rgba(74, 222, 128, 0.2)')
        .attr('stroke-width', 1.5);
    }
    for (let i = 0; i <= height; i += 30) {
      gridGroup
        .append('line')
        .attr('x1', 0)
        .attr('y1', i)
        .attr('x2', width)
        .attr('y2', i)
        .attr('stroke', 'rgba(74, 222, 128, 0.2)')
        .attr('stroke-width', 1.5);
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
      .attr('stroke-width', 1.5);
    axesGroup
      .append('line')
      .attr('x1', width / 2)
      .attr('y1', 0)
      .attr('x2', width / 2)
      .attr('y2', height)
      .attr('stroke', 'rgba(74, 222, 128, 0.8)')
      .attr('stroke-width', 1.5);

    // Axis labels
    const labelsGroup = svg.append('g').attr('class', 'labels');
    let offset = 30;
    labelsGroup
      .append('text')
      .attr('x', -offset)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f8fafc')
      .attr('font-family', '"Geist Mono", monospace')
      .attr('font-size', '18px')
      .attr('transform', `rotate(-90, ${-offset}, ${height / 2})`)
      .text('No Alignment');
    labelsGroup
      .append('text')
      .attr('x', width + offset)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f8fafc')
      .attr('font-family', '"Geist Mono", monospace')
      .attr('font-size', '18px')
      .attr('transform', `rotate(90, ${width + offset}, ${height / 2})`)
      .text('Pro Alignment');
    labelsGroup
      .append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'bottom')
      .attr('fill', '#f8fafc')
      .attr('font-family', '"Geist Mono", monospace')
      .attr('font-size', '18px')
      .text('Closed Source');
    labelsGroup
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 45)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging')
      .attr('fill', '#f8fafc')
      .attr('font-family', '"Geist Mono", monospace')
      .attr('font-size', '18px')
      .text('Open Source');

    // Quadrant backgrounds and labels
    const quadrantsGroup = svg.append('g').attr('class', 'quadrants');

    const quadrants = [
      {
        x: 0,
        y: 0,
        width: width / 2,
        height: height / 2,
        label: 'Proprietary Pragmatist',
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
        .attr('font-size', '16px')
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

      const labelPadding = 20; // Space between point and start of line
      const sideMargin = 100; // Space from edge for labels
      const minLabelSpacing = 20; // Minimum vertical space between labels

      // Sort models by y-coordinate to avoid line crossings
      const sortedModels = [...aiModels].sort((a, b) => {
        const yA = (a.y + 1) * (height / 2);
        const yB = (b.y + 1) * (height / 2);
        return yA - yB;
      });

      // Split models into left and right based on x-position
      const leftModels = sortedModels.filter(
        (model) => (model.x + 1) * (width / 2) < width / 2
      );
      const rightModels = sortedModels.filter(
        (model) => (model.x + 1) * (width / 2) >= width / 2
      );

      // Calculate label positions for left side
      const leftLabelPositions = leftModels.map((_, index) => {
        const totalHeight = height - 2 * sideMargin;
        const spacing = totalHeight / (leftModels.length || 1);
        return sideMargin + index * Math.max(spacing, minLabelSpacing);
      });

      // Calculate label positions for right side
      const rightLabelPositions = rightModels.map((_, index) => {
        const totalHeight = height - 2 * sideMargin;
        const spacing = totalHeight / (rightModels.length || 1);
        return sideMargin + index * Math.max(spacing, minLabelSpacing);
      });

      // Plot models and their labels
      sortedModels.forEach((model, index) => {
        const modelX = (model.x + 1) * (width / 2);
        const modelY = (model.y + 1) * (height / 2);

        // Plot the point
        modelsGroup
          .append('circle')
          .attr('cx', modelX)
          .attr('cy', modelY)
          .attr('r', 9)
          .attr('fill', model.color || '#f8fafc');

        // Determine if the label goes on the left or right
        const isLeft = modelX < width / 2;
        const modelIndexInSide = isLeft
          ? leftModels.indexOf(model)
          : rightModels.indexOf(model);
        const labelY = isLeft
          ? leftLabelPositions[modelIndexInSide]
          : rightLabelPositions[modelIndexInSide];
        const labelX = isLeft ? sideMargin : width - sideMargin;

        // Add leader line
        modelsGroup
          .append('line')
          .attr('x1', modelX)
          .attr('y1', modelY)
          .attr('x2', isLeft ? labelX - 10 : labelX + 10)
          .attr('y2', labelY)
          .attr('stroke', model.color || '#f8fafc')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4');

        // Add label
        modelsGroup
          .append('text')
          .attr('x', labelX)
          .attr('y', labelY)
          .attr('text-anchor', isLeft ? 'start' : 'end')
          .attr('dy', '.35em')
          .attr('fill', model.color || '#f8fafc')
          .attr('font-family', '"Geist Mono", monospace')
          .attr('font-size', '14px')
          .style('pointer-events', 'none')
          .text(model.name);
      });

      // Rest of your existing code (user position, etc.) remains here
    }

    if (showUserPosition) {
      // Plot the user position
      modelsGroup
        .append('circle')
        .attr('cx', normalizedX * (width / 2))
        .attr('cy', normalizedY * (height / 2))
        .attr('r', 9)
        .attr('fill', 'rgba(248, 250, 252, 0.9)')
        .attr('font-family', '"Geist Mono", monospace')
        .attr('font-size', '14px')
        .style('pointer-events', 'none')
        .text('Your Position');
    }
  }, [normalizedX, normalizedY, aiModels, showUserPosition, defaultView]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="p-6 bg-slate-800 border border-cyan-500/30 rounded-lg shadow-lg shadow-cyan-500/20">
        <h2 className="text-2xl font-bold text-center mb-6 text-cyan-400 font-mono">
          AI SAFETY COMPASS
        </h2>
        <svg
          ref={svgRef}
          width={600}
          height={600}
          className="w-full rounded-md"
        />
        {showUserPosition && !defaultView && (
          <div className="mt-6 grid grid-cols-2 gap-6 text-base text-slate-300">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-400 rounded-full mr-3"></span>
              <span>X: {normalizedX.toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-blue-400 rounded-full mr-3"></span>
              <span>Y: {normalizedY.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compass;
