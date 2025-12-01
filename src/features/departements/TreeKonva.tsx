
import { Departement } from "@/models/Departement";
import { PaginatedResult } from "@/models/PaginatedResult";
import { getDepartementHierarchie, getDepartementsList } from "@/services/Departement";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import TreeControls from "./TreeControls";
import { Button } from "@/components/ui/button";
import { HelpCircle, ZoomIn, ZoomOut, Download } from "lucide-react";
import { Stage, Layer, Group, Rect, Text, Circle, Line } from "react-konva";
import Konva from "konva";
import { Result } from "@/models/Result";

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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [depth, setDepth] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const initialized = useRef(false);
  const lastDepartmentId = useRef<string | null>(null); // <-- Nouvelle référence

  // Fetch all departments for dropdown
  const { data: allDepartments } = useSuspenseQuery<PaginatedResult<Departement>>({
    queryKey: ["AllDepartments", {limit: -1}],
    queryFn: () => getDepartementsList(),
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
  const calculateLayout = useCallback((nodes: TreeNode[], expandedSet?: Set<string>) => {
    const visibleNodes: TreeNode[] = [];

    // Use provided expandedSet or default to component state
    const expansionSet = expandedSet || expandedIds;

    // Collect visible nodes
    const traverse = (node: TreeNode) => {
      visibleNodes.push(node);
      if (expansionSet.has(node.id)) node.children.forEach(traverse);
    };

    nodes.forEach(traverse);

    // Position nodes
    let nextX = 0;
    const setPositions = (node: TreeNode): number => {
      if (!expansionSet.has(node.id) || node.children.length === 0) {
        node.x = nextX * (NODE_WIDTH + HORIZONTAL_SPACING);
        nextX++;
      } else {
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
  }, [expandedIds]);

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

  // CORRECTION : Center view ONLY when department changes or on first load
  useEffect(() => {
    if (!tree.length || !dimensions.width || !dimensions.height || !stageRef.current) return;
    
    // Skip if department hasn't changed
    if (departmentId === lastDepartmentId.current && lastDepartmentId.current !== null) return;
    
    const { visibleNodes } = calculateLayout(tree);
    const root = visibleNodes.find((n) => n.parentId === null);
    
    if (root) {
      const stage = stageRef.current;
      stage.position({
        x: dimensions.width / 2 - (root.x + NODE_WIDTH / 2),
        y: dimensions.height / 2 - (root.y + NODE_HEIGHT / 2)
      });
      stage.scale({ x: 1, y: 1 });
      stage.batchDraw();
    }
    
    lastDepartmentId.current = departmentId;
  }, [departmentId, dimensions]); // Removed calculateLayout and tree dependencies

  // Toggle node expansion
  const toggleNode = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Handle zoom using Konva's built-in methods
  const handleZoom = (factor: number) => {
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const newScale = Math.max(0.1, Math.min(3, oldScale * factor));

    // Get current pointer position relative to stage
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Calculate new scale and position
    const mousePointTo = {
      x: (pointerPosition.x - stage.x()) / oldScale,
      y: (pointerPosition.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointerPosition.x - mousePointTo.x * newScale,
      y: pointerPosition.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
  };

  // Reset view to center
  const resetView = useCallback(() => {
    if (!tree.length || !dimensions.width || !dimensions.height || !stageRef.current) return;

    const { visibleNodes } = calculateLayout(tree);
    const root = visibleNodes.find((n) => n.parentId === null);
    if (root) {
      const stage = stageRef.current;
      stage.scale({ x: 1, y: 1 });
      stage.position({
        x: dimensions.width / 2 - (root.x + NODE_WIDTH / 2),
        y: dimensions.height / 2 - (root.y + NODE_HEIGHT / 2)
      });
      stage.batchDraw();
    }
  }, [tree, dimensions, calculateLayout]);

  // Export entire hierarchy as PNG
  const handleExportFullHierarchy = useCallback(() => {
    if (!tree.length || !departments?.data) return;
    
    setExporting(true);
    
    try {
      // Create a set with all IDs to expand everything
      const allIdsSet = new Set<string>();
      const collectIds = (nodes: TreeNode[]) => {
        nodes.forEach(node => {
          allIdsSet.add(node.id);
          collectIds(node.children);
        });
      };
      collectIds(tree);
      
      // Calculate layout with all nodes expanded
      const { visibleNodes, width: fullWidth, height: fullHeight } = calculateLayout(tree, allIdsSet);
      
      // Create an off-screen stage for export
      const offScreenStage = new Konva.Stage({
        container: document.createElement('div'),
        width: fullWidth,
        height: fullHeight
      });
      
      const offScreenLayer = new Konva.Layer();
      offScreenStage.add(offScreenLayer);
      
      // Draw connections
      visibleNodes.forEach(node => {
        if (!node.parentId) return;
        
        const parent = visibleNodes.find(n => n.id === node.parentId);
        if (!parent) return;
        
        const parentCenterX = parent.x + NODE_WIDTH / 2;
        const parentBottomY = parent.y + NODE_HEIGHT;
        const nodeCenterX = node.x + NODE_WIDTH / 2;
        const nodeTopY = node.y;
        
        offScreenLayer.add(new Konva.Line({
          points: [
            parentCenterX, parentBottomY,
            parentCenterX, parentBottomY + VERTICAL_SPACING / 2,
            nodeCenterX, parentBottomY + VERTICAL_SPACING / 2,
            nodeCenterX, nodeTopY
          ],
          stroke: '#64748b',
          strokeWidth: 2,
          fill: 'none',
        }));
      });
      
      // Draw nodes
      visibleNodes.forEach(node => {
        const group = new Konva.Group({
          x: node.x,
          y: node.y,
        });
        
        // Node rectangle
        group.add(new Konva.Rect({
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          fill: node.isExpanded ? "#e0f2fe" : "#ffffff",
          stroke: "#0ea5e9",
          strokeWidth: 2,
          cornerRadius: 8,
          shadowColor: "rgba(0,0,0,0.15)",
          shadowBlur: 10,
          shadowOffsetY: 2,
        }));
        
        // Department name
        group.add(new Konva.Text({
          x: 12,
          y: 15,
          width: NODE_WIDTH - 24,
          text: node.departmentName,
          fontSize: 13,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fill: "#1e293b",
          fontStyle: "bold",
          ellipsis: true,
        }));
        
        // Department code
        group.add(new Konva.Text({
          x: 12,
          y: 35,
          text: node.departmentCode,
          fontSize: 11,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fill: "#64748b",
        }));
        
        // Expand/collapse indicator
        if (node.children.length > 0) {
          group.add(new Konva.Circle({
            x: NODE_WIDTH - 20,
            y: 20,
            radius: 10,
            fill: "#0ea5e9",
            stroke: "#ffffff",
            strokeWidth: 2,
          }));
          
          group.add(new Konva.Text({
            x: NODE_WIDTH - 30,
            y: 15,
            width: 20,
            text: node.isExpanded ? "−" : "+",
            fontSize: 10,
            fill: "#ffffff",
            align: "center",
          }));
        }
        
        // Children count
        if (node.children.length > 0) {
          group.add(new Konva.Text({
            x: NODE_WIDTH /2 + (node.children.length !== 1 ? 55 : 70),
            y: NODE_HEIGHT - 15,
            text: `${node.children.length} child${node.children.length !== 1 ? 'ren' : ''}`,
            fontSize: 10,
            fill: "#64748b",
            align: "right",
          }));
        }
        
        offScreenLayer.add(group);
      });
      
      offScreenLayer.draw();
      
      // Export as PNG
      const dataURL = offScreenStage.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 2
      });
      
      const link = document.createElement('a');
      link.download = 'department-tree-full.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      offScreenStage.destroy();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  }, [tree, departments, calculateLayout]);

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

  // Render Konva tree
  const renderTree = () => {
    if (!tree.length) return null;
    const { visibleNodes } = calculateLayout(tree);

    return (
      <div className="relative w-full h-full">
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          draggable
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
        >
          <Layer>
            {/* Connection lines */}
            {visibleNodes.map((node) => {
              if (!node.parentId) return null;
              const parent = visibleNodes.find((n) => n.id === node.parentId);
              if (!parent) return null;
              
              const parentCenterX = parent.x + NODE_WIDTH / 2;
              const parentBottomY = parent.y + NODE_HEIGHT;
              const nodeCenterX = node.x + NODE_WIDTH / 2;
              const nodeTopY = node.y;
              
              return (
                <Line
                  key={`line-${node.id}`}
                  points={[
                    parentCenterX, parentBottomY,
                    parentCenterX, parentBottomY + VERTICAL_SPACING / 2,
                    nodeCenterX, parentBottomY + VERTICAL_SPACING / 2,
                    nodeCenterX, nodeTopY
                  ]}
                  stroke="#64748b"
                  strokeWidth={2}
                  fill="none"
                />
              );
            })}
            
            {/* Nodes */}
            {visibleNodes.map((node) => (
              <Group 
                key={node.id} 
                onClick={() => toggleNode(node.id)}
                onTap={() => toggleNode(node.id)}
              >
                <Rect
                  x={node.x}
                  y={node.y}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  fill={node.isExpanded ? "#e0f2fe" : "#ffffff"}
                  stroke={"#0ea5e9"}
                  strokeWidth={2}
                  cornerRadius={8}
                  shadowColor="rgba(0,0,0,0.15)"
                  shadowBlur={10}
                  shadowOffsetY={2}
                />
                
                {/* Department name */}
                <Text
                  x={node.x + 12}
                  y={node.y + 15}
                  width={NODE_WIDTH - 24}
                  text={node.departmentName}
                  fontSize={13}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fill="#1e293b"
                  fontStyle="bold"
                  ellipsis={true}
                />
                
                {/* Department code */}
                <Text
                  x={node.x + 12}
                  y={node.y + 35}
                  text={node.departmentCode}
                  fontSize={11}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fill="#64748b"
                />
                
                {/* Expand/collapse indicator */}
                {node.children.length > 0 && (
                  <Group>
                    <Circle
                      x={node.x + NODE_WIDTH - 20}
                      y={node.y + 20}
                      radius={10}
                      fill="#0ea5e9"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                    <Text
                      x={node.x + NODE_WIDTH - 30}
                      y={node.y + 15}
                      width={20}
                      text={node.isExpanded ? "−" : "+"}
                      fontSize={10}
                      fill="#ffffff"
                      align="center"
                    />
                  </Group>
                )}
                
                {/* Children count */}
                {node.children.length > 0 && (
                  <Text
                    x={node.x + NODE_WIDTH /2 + (node.children.length !== 1 ? 55 : 70)}
                    y={node.y + NODE_HEIGHT - 15}
                    text={`${node.children.length} child${node.children.length !== 1 ? 'ren' : ''}`}
                    fontSize={10}
                    fill="#64748b"
                    align="right"
                  />
                )}
              </Group>
            ))}
          </Layer>
        </Stage>
        
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
        
        {/* Zoom and export controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 justify-end">
            <Button 
              className="relative group px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium shadow-lg flex items-center justify-center"
              onClick={() => handleZoom(1.2)}
              disabled={stageRef.current?.scaleX() >= 3}
            >
              <ZoomIn className="h-4 w-4" />
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Zoom In
              </div>
            </Button>
            <Button 
              className="relative group px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium shadow-lg flex items-center justify-center"
              onClick={() => handleZoom(0.8)}
              disabled={stageRef.current?.scaleX() <= 0.1}
            >
              <ZoomOut className="h-4 w-4" />
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Zoom Out
              </div>
            </Button>
            <Button 
              className="relative group px-3 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900 transition-colors text-sm font-medium shadow-lg flex items-center justify-center"
              onClick={handleExportFullHierarchy}
            >
              <Download className="h-4 w-4" />
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Exporter toute la hiérarchie
              </div>
            </Button>
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-sm text-gray-600 shadow-lg text-center">
            Zoom: {Math.round((stageRef.current?.scaleX() || 1) * 100)}%
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
              <div>• Export visible view or full hierarchy</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden border border-gray-200 rounded-lg"
    >
      {exporting && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg font-medium text-gray-800">Export de la hiérarchie complète...</p>
            <p className="text-sm text-gray-600">Cette opération peut prendre quelques instants</p>
          </div>
        </div>
      )}
      {dimensions.width > 0 && dimensions.height > 0 && renderTree()}
    </div>
  );
};

export default Tree;