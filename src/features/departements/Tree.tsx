
import { Departement } from "@/models/Departement";
import { PaginatedResult } from "@/models/PaginatedResult";
import { Result } from "@/models/Result";
import { getDepartementHierarchie, getDepartements } from "@/services/Departement";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import TreeControls from "./TreeControls";
import { Button } from "@/components/ui/button";
import { HelpCircle, ZoomIn, ZoomOut } from "lucide-react";

// Tree node interface
interface TreeNode {
  id: string;
  departmentName: string;
  departmentCode: string;
  parentId: string | null;
  children: TreeNode[];
  depth: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isExpanded: boolean;
}

// Layout constants
const NODE_WIDTH = 220;
const NODE_HEIGHT = 70;
const HORIZONTAL_SPACING = 50;
const VERTICAL_SPACING = 120;

const Tree: React.FC = () => {
  // State for tree interactions and inputs
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [depth, setDepth] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Fetch all departments for dropdown
  const { data: allDepartments } = useSuspenseQuery<PaginatedResult<Departement>>({
    queryKey: ["AllDepartments"],
    queryFn: () => getDepartements(),
  });

  // Fetch department hierarchy
  const { data: departments } = useSuspenseQuery<Result<Departement>>({
    queryKey: ["Departments", departmentId, depth],
    queryFn: () => getDepartementHierarchie(departmentId, depth),
  });

  // Expand selected department or root on initial load
  useEffect(() => {
    if (departments?.data?.id && !initialized.current) {
      setExpandedIds(new Set([departments.data.id]));
      initialized.current = true;
    }
  }, [departments]);

  // Build tree structure
  const tree = useMemo(() => {
    if (!departments?.data) return [];

    const createNode = (dept: Departement, depth: number, parentId: string | null): TreeNode => ({
      id: dept.id,
      departmentName: dept.departmentName,
      departmentCode: dept.departmentCode,
      parentId,
      children: (dept.departmentsFils ?? []).map((child) => createNode(child, depth + 1, dept.id)),
      depth,
      x: 0,
      y: 0,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      isExpanded: expandedIds.has(dept.id),
    });

    return [createNode(departments.data, 0, null)];
  }, [departments, expandedIds]);

  // Calculate layout for visible nodes
const calculateLayout = useCallback((nodes: TreeNode[]) => {
  const visibleNodes: TreeNode[] = [];

  // Étape 1: collecter les nœuds visibles en profondeur
  const traverse = (node: TreeNode) => {
    visibleNodes.push(node);
    if (node.isExpanded) node.children.forEach(traverse);
  };

  nodes.forEach(traverse);

  // Étape 2: placer les feuilles de gauche à droite
  let nextX = 0;
  const setPositions = (node: TreeNode): number => {
    if (!node.isExpanded || node.children.length === 0) {
      // feuille
      node.x = nextX * (NODE_WIDTH + HORIZONTAL_SPACING);
      nextX++;
    } else {
      // a des enfants -> position moyenne de ses enfants
      const childrenX = node.children.map(setPositions);
      const minX = Math.min(...childrenX);
      const maxX = Math.max(...childrenX);
      node.x = (minX + maxX) / 2;
    }

    node.y = node.depth * (NODE_HEIGHT + VERTICAL_SPACING);
    return node.x;
  };

  nodes.forEach(setPositions);

  const maxX = Math.max(...visibleNodes.map((n) => n.x));
  const maxY = Math.max(...visibleNodes.map((n) => n.y));

  return {
    visibleNodes,
    width: maxX + NODE_WIDTH,
    height: maxY + NODE_HEIGHT,
  };
}, []);


  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) setDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

// Centrer seulement lors du changement de données (pas d'expansion)
useEffect(() => {
  if (!tree.length || !dimensions.width || !dimensions.height) return;

  const { visibleNodes } = calculateLayout(tree);
  const root = visibleNodes.find((n) => n.parentId === null);
  if (root) {
    setStagePos({
      x: dimensions.width / 2 - (root.x + NODE_WIDTH / 2) * scale,
      y: dimensions.height / 2 - (root.y + NODE_HEIGHT / 2) * scale,
    });
  }
}, [dimensions, calculateLayout, scale, departmentId,tree]);

// Centrer seulement lors du changement initial des données
useEffect(() => {
  if (!departments?.data || !dimensions.width || !dimensions.height || initialized.current) return;

  const { visibleNodes } = calculateLayout(tree);
  const root = visibleNodes.find((n) => n.parentId === null);
  if (root) {
    setStagePos({
      x: dimensions.width / 2 - (root.x + NODE_WIDTH / 2) * scale,
      y: dimensions.height / 2 - (root.y + NODE_HEIGHT / 2) * scale,
    });
  }
}, [departments?.data, dimensions, calculateLayout, scale, tree]);

// Alternative encore plus propre : utilisez une ref pour tracker si c'est la première fois
const isInitialRender = useRef(true);

useEffect(() => {
  if (!tree.length || !dimensions.width || !dimensions.height) return;

  // Centrer seulement si c'est le premier rendu ou si departmentId change
  if (isInitialRender.current || departmentId !== null) {
    const { visibleNodes } = calculateLayout(tree);
    const root = visibleNodes.find((n) => n.parentId === null);
    if (root) {
      setStagePos({
        x: dimensions.width / 2 - (root.x + NODE_WIDTH / 2) * scale,
        y: dimensions.height / 2 - (root.y + NODE_HEIGHT / 2) * scale,
      });
    }
    isInitialRender.current = false;
  }
}, [dimensions, calculateLayout, scale, departmentId,tree]); // Sans 'tree'

  // Toggle node expansion
  const toggleNode = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Handle drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left mouse button
    
    e.preventDefault();
    setIsDragging(true);
    
    const startPos = { x: e.clientX, y: e.clientY };
    const initialStagePos = { ...stagePos };

    const onMouseMove = (e: MouseEvent) => {
      setStagePos({
        x: initialStagePos.x + (e.clientX - startPos.x),
        y: initialStagePos.y + (e.clientY - startPos.y),
      });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [stagePos]);

  // Handle zoom in
  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(scale * 1.2, 3);
    if (newScale !== scale) {
      // Zoom vers le centre de l'écran
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      
      const scaleDiff = newScale - scale;
      const newX = stagePos.x - (centerX - stagePos.x) * scaleDiff / scale;
      const newY = stagePos.y - (centerY - stagePos.y) * scaleDiff / scale;
      
      setStagePos({ x: newX, y: newY });
      setScale(newScale);
    }
  }, [scale, stagePos, dimensions]);

  // Handle zoom out
  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(scale * 0.8, 0.1);
    if (newScale !== scale) {
      // Zoom vers le centre de l'écran
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      
      const scaleDiff = newScale - scale;
      const newX = stagePos.x - (centerX - stagePos.x) * scaleDiff / scale;
      const newY = stagePos.y - (centerY - stagePos.y) * scaleDiff / scale;
      
      setStagePos({ x: newX, y: newY });
      setScale(newScale);
    }
  }, [scale, stagePos, dimensions]);

  // Reset view to center
  const resetView = useCallback(() => {
    if (!tree.length || !dimensions.width || !dimensions.height) return;

    const { visibleNodes } = calculateLayout(tree);
    const root = visibleNodes.find((n) => n.parentId === null);
    if (root) {
      setScale(1);
      setStagePos({
        x: dimensions.width / 2 - (root.x + NODE_WIDTH / 2),
        y: dimensions.height / 2 - (root.y + NODE_HEIGHT / 2),
      });
    }
  }, [tree, dimensions, calculateLayout]);

  // Expand all nodes
  const expandAll = useCallback(() => {
    const allIds = (nodes: TreeNode[]): string[] =>
      nodes.flatMap((node) => [node.id, ...allIds(node.children)]);
    setExpandedIds(new Set(allIds(tree)));
  }, [tree]);

  // Collapse all nodes
  const collapseAll = useCallback(() => {
    const rootIds = tree.map(node => node.id);
    setExpandedIds(new Set(rootIds));
  }, [tree]);

  // Handle node click
  const handleNodeClick = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (!isDragging) {
      toggleNode(nodeId);
    }
  }, [isDragging, toggleNode]);

  // Render SVG tree
  const renderTree = () => {
    if (!tree.length) return null;
    const { visibleNodes } = calculateLayout(tree);

    return (
      <div className="relative w-full h-full">
        <svg 
          width={dimensions.width} 
          height={dimensions.height} 
          className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
          onMouseDown={handleMouseDown}
        >
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.15)" />
            </filter>
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#f8fafc', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#dbeafe', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#bfdbfe', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="expandedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#e0f2fe', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#bae6fd', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          <g transform={`translate(${stagePos.x}, ${stagePos.y}) scale(${scale})`}>
            {/* Connection lines */}
            {visibleNodes.map((node) => {
              if (!node.parentId) return null;
              const parent = visibleNodes.find((n) => n.id === node.parentId);
              if (!parent) return null;
              
              const parentCenterX = parent.x + NODE_WIDTH / 2;
              const parentBottomY = parent.y + NODE_HEIGHT;
              const nodeCenterX = node.x + NODE_WIDTH / 2;
              const nodeTopY = node.y;
              // Control points for curve
              // const controlPoint1X = parentCenterX;
              // const controlPoint1Y = parentBottomY + VERTICAL_SPACING / 3;
              // const controlPoint2X = nodeCenterX;
              // const controlPoint2Y = nodeTopY - VERTICAL_SPACING / 3;
              
              return (
                <path
                  key={`line-${node.id}`}
                  // rectangle line
                  d={`M ${parentCenterX} ${parentBottomY} 
                      L ${parentCenterX} ${parentBottomY + VERTICAL_SPACING / 2} 
                      L ${nodeCenterX} ${parentBottomY + VERTICAL_SPACING / 2}
                      L ${nodeCenterX} ${nodeTopY}`}
                  // curve line
                  // d={`M ${parentCenterX} ${parentBottomY} 
                  //     C ${controlPoint1X} ${controlPoint1Y}, 
                  //       ${controlPoint2X} ${controlPoint2Y}, 
                  //       ${nodeCenterX} ${nodeTopY}`}
                  stroke="#64748b"
                  strokeWidth="2"
                  fill="none"
                />
              );
            })}
            
            {/* Nodes */}
            {visibleNodes.map((node) => (
              <g 
                key={node.id} 
                className="cursor-pointer" 
                onClick={(e) => handleNodeClick(e, node.id)}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  fill={
                        node.isExpanded 
                      ? "url(#expandedGradient)" 
                      : "url(#nodeGradient)"
                  }
                  stroke={"#0ea5e9"}
                  strokeWidth="2"
                  rx="8"
                  filter="url(#shadow)"
                />
                
                {/* Department name */}
                <text 
                  x={node.x + 12} 
                  y={node.y + 25} 
                  fontSize="13" 
                  fontWeight="600" 
                  fill="#1e293b" 
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {node.departmentName.length > 20 
                    ? `${node.departmentName.substring(0, 20)}...` 
                    : node.departmentName}
                </text>
                
                {/* Department code */}
                <text 
                  x={node.x + 12} 
                  y={node.y + 45} 
                  fontSize="11" 
                  fill="#64748b" 
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {node.departmentCode}
                </text>
                
                {/* Expand/collapse indicator */}
                {node.children.length > 0 && (
                  <g>
                    <circle
                      cx={node.x + NODE_WIDTH - 20}
                      cy={node.y + 20}
                      r="10"
                      fill="#0ea5e9"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={node.x + NODE_WIDTH - 20}
                      y={node.y + 23}
                      fontSize="10"
                      fill="#ffffff"
                      textAnchor="middle"
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      {node.isExpanded ? "−" : "+"}
                    </text>
                  </g>
                )}
                
                {/* Children count */}
                {node.children.length > 0 && (
                  <text
                    x={node.x + NODE_WIDTH - 12}
                    y={node.y + NODE_HEIGHT - 8}
                    fontSize="10"
                    fill="#64748b"
                    textAnchor="end"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {node.children.length} child{node.children.length !== 1 ? 'ren' : ''}
                  </text>
                )}
              </g>
            ))}
          </g>
        </svg>
        
        {/* Tree Controls */}
        <TreeControls
          departmentId={departmentId}
          depth={depth}
          allDepartments={allDepartments}
          onDepartmentChange={setDepartmentId}
          onDepthChange={setDepth}
        />
        
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button 
            className="relative group bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-lg" 
            onClick={resetView}
          >
            🎯
            <div className="absolute -bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Reset View
            </div>
          </Button>
          <Button 
            className="relative group bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium shadow-lg" 
            onClick={expandAll}
          >
            📂
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Expand All
            </div>
          </Button>
          <Button 
            className="relative group bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium shadow-lg" 
            onClick={collapseAll}
          >
            📁
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Collapse All
            </div>
          </Button>
        </div>
        
        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 justify-end">
            <Button 
              className="relative group px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium shadow-lg flex items-center justify-center"
              onClick={handleZoomIn}
              disabled={scale >= 3}
            >
              <ZoomIn className="h-4 w-4" />
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Zoom In
              </div>
            </Button>
            <Button 
              className="relative group px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium shadow-lg flex items-center justify-center"
              onClick={handleZoomOut}
              disabled={scale <= 0.1}
            >
              <ZoomOut className="h-4 w-4" />
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Zoom Out
              </div>
            </Button>
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-sm text-gray-600 shadow-lg text-center">
            Zoom: {Math.round(scale * 100)}%
          </div>
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
          <div className="relative group">
            <HelpCircle className="h-5 w-5 text-gray-600 cursor-help" />
            <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md text-xs text-gray-600 shadow-lg max-w-xs">
              <div className="font-medium mb-1">Controls:</div>
              <div>• Click nodes to expand/collapse</div>
              <div>• Drag to pan • Use zoom buttons</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="h-[80vh] w-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden border border-gray-200 rounded-lg"
    >
      {dimensions.width > 0 && dimensions.height > 0 && renderTree()}
    </div>
  );
};

export default Tree;