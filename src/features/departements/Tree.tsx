"use client";
import { Stage, Layer, Group, Rect, Text, Line } from "react-konva";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDepartementHierarchie } from "@/services/Departement";
import { Departement, DepartementApiResponse } from "@/models/Departement.dto";

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

// Constants for layout
const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 40;
const VERTICAL_SPACING = 100;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;

const Tree = () => {
  const { data: departements } = useSuspenseQuery<DepartementApiResponse>({
    queryKey: ["Departements"],
    queryFn: getDepartementHierarchie,
  });

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const initialized = useRef(false);

  // Build tree from API data
  const buildTree = useMemo(() => {
    if (!departements?.data) return [];

    const createNode = (dept: Departement, depth: number, parentId: string | null): TreeNode => ({
      id: String(dept.id),
      departmentName: dept.DepartmentName,
      departmentCode: dept.DepartmentCode,
      parentId,
      children: (dept.DepartmentsFils ?? []).map((child) => createNode(child, depth + 1, String(dept.id))),
      depth,
      x: 0,
      y: 0,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      isExpanded: expandedIds.has(String(dept.id)),
    });

    return departements.data
      .filter((dept) => dept.ParentDepartment === null)
      .map((dept) => createNode(dept, 0, null));
  }, [departements, expandedIds]);

  // Calculate layout for visible nodes
  const calculateLayout = (roots: TreeNode[]) => {
    const visibleNodes: TreeNode[] = [];
    const levels: TreeNode[][] = [];

    const traverse = (node: TreeNode) => {
      visibleNodes.push(node);
      if (!levels[node.depth]) levels[node.depth] = [];
      levels[node.depth].push(node);

      if (node.isExpanded) {
        node.children.forEach(traverse);
      }
    };

    roots.forEach(traverse);

    const levelWidths = levels.map(
      (level) => level.length * NODE_WIDTH + (level.length - 1) * HORIZONTAL_SPACING
    );
    const maxWidth = Math.max(...levelWidths, NODE_WIDTH);

    levels.forEach((level, depth) => {
      const levelWidth =
        level.length * NODE_WIDTH + (level.length - 1) * HORIZONTAL_SPACING;
      const startX = (maxWidth - levelWidth) / 2;

      level.forEach((node, i) => {
        node.x = startX + i * (NODE_WIDTH + HORIZONTAL_SPACING);
        node.y = depth * (NODE_HEIGHT + VERTICAL_SPACING);
      });
    });

    return {
      visibleNodes,
      width: maxWidth,
      height: levels.length * (NODE_HEIGHT + VERTICAL_SPACING),
    };
  };

  // Handle window resize
  useEffect(() => {
    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Center the tree on initial render
  useEffect(() => {
    if (!buildTree.length || !dimensions.width || !dimensions.height || initialized.current) return;

    const { visibleNodes } = calculateLayout(buildTree);
    const root = visibleNodes.find((n) => n.parentId === null);

    if (root) {
      const centerX = dimensions.width / 2 - (root.x + NODE_WIDTH / 2) * scale;
      const centerY = dimensions.height / 2 - (root.y + NODE_HEIGHT / 2) * scale;
      setStagePos({ x: centerX, y: centerY });
      initialized.current = true;
    }
  }, [buildTree, dimensions, scale]);

  // Toggle node expansion
  const handleNodeClick = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Handle zoom
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    const scaleBy = 1.1;
    const newScale = e.evt.deltaY < 0 ? scale * scaleBy : scale / scaleBy;
    const clampedScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

    const mousePointTo = {
      x: (pointer.x - stagePos.x) / scale,
      y: (pointer.y - stagePos.y) / scale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    setScale(clampedScale);
    setStagePos(newPos);
  };

  // Handle drag end
  const handleDragEnd = (e: any) => {
    const newX = e.target.x();
    const newY = e.target.y();

    const minX = dimensions.width - dimensions.width * scale;
    const minY = dimensions.height - dimensions.height * scale;

    setStagePos({
      x: Math.min(0, Math.max(minX, newX)),
      y: Math.min(0, Math.max(minY, newY)),
    });
  };

  // Render the tree
  const renderTree = () => {
    if (!buildTree.length) return null;

    const { visibleNodes } = calculateLayout(buildTree);

    return (
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        x={stagePos.x}
        y={stagePos.y}
        scaleX={scale}
        scaleY={scale}
        draggable
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
      >
        <Layer>
          <Group>
            {visibleNodes.map((node) => {
              if (!node.parentId) return null;
              const parent = visibleNodes.find((n) => n.id === node.parentId);
              if (!parent) return null;

              return (
                <Line
                  key={`line-${node.id}`}
                  points={[
                    node.x + NODE_WIDTH / 2,
                    node.y,
                    node.x + NODE_WIDTH / 2,
                    node.y - VERTICAL_SPACING / 2,
                    parent.x + NODE_WIDTH / 2,
                    parent.y + NODE_HEIGHT,
                  ]}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  dash={[5, 5]}
                />
              );
            })}

            {visibleNodes.map((node) => (
              <Group
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                onTap={() => handleNodeClick(node.id)}
              >
                <Rect
                  x={node.x}
                  y={node.y}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  fill={node.isExpanded ? "#e0f2fe" : "#ffffff"}
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  cornerRadius={4}
                  shadowColor="#00000020"
                  shadowBlur={5}
                  shadowOffsetY={2}
                />
                <Text
                  x={node.x + 10}
                  y={node.y + 10}
                  width={NODE_WIDTH - 20}
                  text={node.departmentName}
                  fontSize={14}
                  fontStyle="bold"
                  fill="#1e293b"
                  fontFamily="Arial"
                />
                <Text
                  x={node.x + 10}
                  y={node.y + 30}
                  width={NODE_WIDTH - 20}
                  text={node.departmentCode}
                  fontSize={12}
                  fill="#64748b"
                  fontFamily="Arial"
                />
                {node.children.length > 0 && (
                  <Text
                    x={node.x + NODE_WIDTH - 20}
                    y={node.y + NODE_HEIGHT - 20}
                    text={node.isExpanded ? "▼" : "▶"}
                    fontSize={12}
                    fill="#64748b"
                  />
                )}
              </Group>
            ))}
          </Group>
        </Layer>
      </Stage>
    );
  };

  return (
    <div ref={containerRef} className="h-[80vh] w-full bg-slate-50 overflow-hidden">
      {dimensions.width > 0 && dimensions.height > 0 && renderTree()}
    </div>
  );
};

export default Tree;