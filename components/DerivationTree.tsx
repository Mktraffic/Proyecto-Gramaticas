'use client';

import React from 'react';
import { DerivationTreeNode } from '@/types/grammar';

interface DerivationTreeProps {
  tree: DerivationTreeNode;
}

/**
 * Componente para visualizar el árbol de derivación
 * Muestra el árbol de forma gráfica usando SVG
 */
export default function DerivationTree({ tree }: DerivationTreeProps) {
  const nodeRadius = 25;
  const levelHeight = 80;
  const minHorizontalSpacing = 60;

  // Calcular el ancho necesario para cada subárbol
  const calculateWidth = (node: DerivationTreeNode): number => {
    if (node.children.length === 0) {
      return 1;
    }
    return node.children.reduce((sum, child) => sum + calculateWidth(child), 0);
  };

  // Calcular la profundidad del árbol
  const calculateDepth = (node: DerivationTreeNode): number => {
    if (node.children.length === 0) {
      return 1;
    }
    return 1 + Math.max(...node.children.map(calculateDepth));
  };

  const treeWidth = calculateWidth(tree);
  const treeDepth = calculateDepth(tree);
  const svgWidth = Math.max(800, treeWidth * minHorizontalSpacing);
  const svgHeight = treeDepth * levelHeight + 50;

  interface NodePosition {
    x: number;
    y: number;
    node: DerivationTreeNode;
  }

  const positions: NodePosition[] = [];

  // Función recursiva para calcular posiciones
  const calculatePositions = (
    node: DerivationTreeNode,
    x: number,
    y: number,
    width: number
  ) => {
    positions.push({ x, y, node });

    if (node.children.length > 0) {
      const childrenWidths = node.children.map(calculateWidth);
      const totalWidth = childrenWidths.reduce((sum, w) => sum + w, 0);
      
      let currentX = x - (totalWidth * minHorizontalSpacing) / 2;
      
      node.children.forEach((child, index) => {
        const childWidth = childrenWidths[index];
        const childX = currentX + (childWidth * minHorizontalSpacing) / 2;
        calculatePositions(child, childX, y + levelHeight, childWidth * minHorizontalSpacing);
        currentX += childWidth * minHorizontalSpacing;
      });
    }
  };

  calculatePositions(tree, svgWidth / 2, 40, svgWidth);

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Árbol de Derivación</h3>
      <svg width={svgWidth} height={svgHeight} className="mx-auto">
        {/* Dibujar aristas */}
        {positions.map((pos, index) => (
          <g key={`edges-${index}`}>
            {pos.node.children.map((child, childIndex) => {
              const childPos = positions.find(p => p.node === child);
              if (childPos) {
                return (
                  <line
                    key={`edge-${index}-${childIndex}`}
                    x1={pos.x}
                    y1={pos.y}
                    x2={childPos.x}
                    y2={childPos.y}
                    stroke="#4B5563"
                    strokeWidth="2"
                  />
                );
              }
              return null;
            })}
          </g>
        ))}

        {/* Dibujar nodos */}
        {positions.map((pos, index) => (
          <g key={`node-${index}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={nodeRadius}
              fill={pos.node.isTerminal ? '#10B981' : '#3B82F6'}
              stroke="#1F2937"
              strokeWidth="2"
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold"
            >
              {pos.node.symbol === '' ? 'ε' : pos.node.symbol}
            </text>
          </g>
        ))}
      </svg>
      
      <div className="mt-4 flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span>No Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Terminal</span>
        </div>
      </div>
    </div>
  );
}
