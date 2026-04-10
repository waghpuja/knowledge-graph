"use client";

import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  EdgeLabelRenderer,
  getBezierPath,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

// 🎯 Custom Node
const CustomNode = ({ data }: any) => {
  return (
    <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg w-44 border border-gray-600">
      <div className="font-semibold text-sm">{data.label}</div>
      <div className="text-xs text-gray-300 mt-1">{data.note}</div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

// 🎯 Custom Edge
const CustomEdge = (props: any) => {
  const [edgePath, labelX, labelY] = getBezierPath(props);

  return (
    <>
      <path
        d={edgePath}
        stroke="#888"
        strokeWidth={2}
        fill="none"
        markerEnd="url(#arrow)"
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: "#1f2937",
            color: "white",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "10px",
            border: "1px solid #4b5563",
          }}
        >
          {props.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

// ✅ FULL Seed Data (Correct)
const seedNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 300, y: 100 },
    data: {
      label: "React",
      note: "A JavaScript library for building user interfaces using components.",
    },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 300, y: 0 },
    data: {
      label: "Next.js",
      note: "React framework with SSR, routing, and API support built in.",
    },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 550, y: 100 },
    data: {
      label: "TypeScript",
      note: "Typed superset of JavaScript that compiles to plain JS.",
    },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 100, y: 250 },
    data: {
      label: "State Management",
      note: "Patterns for managing shared application state.",
    },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 300, y: 250 },
    data: {
      label: "Component Design",
      note: "Principles for building reusable UI components.",
    },
  },
  {
    id: "6",
    type: "custom",
    position: { x: 500, y: 250 },
    data: {
      label: "Performance",
      note: "Techniques like memoization and lazy loading.",
    },
  },
  {
    id: "7",
    type: "custom",
    position: { x: 200, y: 400 },
    data: {
      label: "Testing",
      note: "Unit, integration, and e2e testing strategies.",
    },
  },
  {
    id: "8",
    type: "custom",
    position: { x: 450, y: 400 },
    data: {
      label: "CSS & Styling",
      note: "Tailwind, CSS Modules, styled-components.",
    },
  },
];

const seedEdges = [
  { id: "e1", source: "2", target: "1", label: "built on", type: "custom" },
  { id: "e2", source: "1", target: "3", label: "pairs well with", type: "custom" },
  { id: "e3", source: "1", target: "4", label: "uses", type: "custom" },
  { id: "e4", source: "1", target: "5", label: "guides", type: "custom" },
  { id: "e5", source: "2", target: "6", label: "improves", type: "custom" },
  { id: "e6", source: "1", target: "7", label: "requires", type: "custom" },
  { id: "e7", source: "1", target: "8", label: "styled with", type: "custom" },
  { id: "e8", source: "4", target: "6", label: "impacts", type: "custom" },
  { id: "e9", source: "5", target: "6", label: "impacts", type: "custom" },
];

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Load from localStorage OR seed
  // Load (FIXED)
useEffect(() => {
  const saved = localStorage.getItem("graph");

  if (saved) {
    const parsed = JSON.parse(saved);

    // ✅ Only use saved data if it's complete
    if (
      parsed.nodes?.length >= 8 &&
      parsed.edges?.length >= 9
    ) {
      setNodes(parsed.nodes);
      setEdges(parsed.edges);
      return;
    }
  }

  // ✅ Otherwise load full seed data
  setNodes(seedNodes);
  setEdges(seedEdges);
}, [setNodes, setEdges]);

  // Save
  useEffect(() => {
    localStorage.setItem("graph", JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  // Connect
  const onConnect = useCallback(
    (params: any) => {
      const label = prompt("Enter relationship") || "relates to";

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            id: Date.now().toString(),
            label,
            type: "custom",
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onNodeClick = (_: any, node: any) => {
  setSelectedNode({
    ...node,
    data: {
      label: node.data?.label || "",
      note: node.data?.note || "",
    },
  });
};

  const updateNode = (field: "label" | "note", value: string) => {
  setNodes((nds) =>
    nds.map((n) =>
      n.id === selectedNode.id
        ? {
            ...n,
            data: {
              ...n.data,
              [field]: value,
            },
          }
        : n
    )
  );

  setSelectedNode((prev: any) => ({
    ...prev,
    data: {
      ...prev.data,
      [field]: value,
    },
  }));
};

  const addNode = () => {
    const newNode = {
      id: Date.now().toString(),
      type: "custom",
      position: { x: 200, y: 200 },
      data: { label: "New Node", note: "Add details..." },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const deleteNode = () => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) =>
          e.source !== selectedNode.id && e.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  };

  const onEdgeClick = (_: any, edge: any) => {
    if (confirm("Delete this edge?")) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <div className="h-14 bg-gray-800 flex items-center px-6 justify-between border-b border-gray-700">
        <h1 className="font-semibold text-lg">🧠 Knowledge Graph</h1>

        <button
          onClick={addNode}
          className="bg-blue-600 px-4 py-1 rounded"
        >
          + Add Node
        </button>
      </div>

      <div className="flex flex-1">
        {/* Graph */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            fitView
          >
            <Background />
            <Controls />

            <svg>
              <defs>
                <marker
                  id="arrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="10"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#888" />
                </marker>
              </defs>
            </svg>
          </ReactFlow>
        </div>

        {/* Sidebar */}
        {selectedNode && (
          <Sidebar
            node={selectedNode}
            onChange={updateNode}
            onDelete={deleteNode}
          />
        )}
      </div>
    </div>
  );
}