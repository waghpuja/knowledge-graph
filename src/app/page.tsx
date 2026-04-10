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

// 🎯 Custom Node (Card Style)
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

// 🎯 Custom Edge (Styled Label)
const CustomEdge = (props: any) => {
  const [edgePath, labelX, labelY] = getBezierPath(props);

  return (
    <>
      <path
        id={props.id}
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

// ✅ Seed Data
const seedNodes = [
  { id: "1", type: "custom", position: { x: 0, y: 0 }, data: { label: "React", note: "UI library" } },
  { id: "2", type: "custom", position: { x: 250, y: 0 }, data: { label: "Next.js", note: "Framework" } },
  { id: "3", type: "custom", position: { x: 500, y: 0 }, data: { label: "TypeScript", note: "Typed JS" } },
  { id: "4", type: "custom", position: { x: 0, y: 200 }, data: { label: "State Mgmt", note: "State handling" } },
  { id: "5", type: "custom", position: { x: 250, y: 200 }, data: { label: "Component Design", note: "Reusable UI" } },
  { id: "6", type: "custom", position: { x: 500, y: 200 }, data: { label: "Performance", note: "Optimization" } },
  { id: "7", type: "custom", position: { x: 150, y: 400 }, data: { label: "Testing", note: "Testing strategies" } },
  { id: "8", type: "custom", position: { x: 400, y: 400 }, data: { label: "CSS & Styling", note: "UI styling" } },
];

const seedEdges = [
  { id: "e1", source: "2", target: "1", label: "built on", type: "custom" },
  { id: "e2", source: "1", target: "3", label: "pairs well", type: "custom" },
];

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Load
  useEffect(() => {
    const saved = localStorage.getItem("graph");

    if (saved) {
      const parsed = JSON.parse(saved);

      const fixedNodes = parsed.nodes.map((n: any) => ({
        ...n,
        type: "custom",
      }));

      const fixedEdges = parsed.edges.map((e: any) => ({
        ...e,
        type: "custom",
      }));

      setNodes(fixedNodes);
      setEdges(fixedEdges);
    } else {
      setNodes(seedNodes);
      setEdges(seedEdges);
    }
  }, [setNodes, setEdges]);

  // Save
  useEffect(() => {
    localStorage.setItem("graph", JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  // Connect
  const onConnect = useCallback((params: any) => {
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
  }, [setEdges]);

  const onNodeClick = (_: any, node: any) => {
    setSelectedNode(node);
  };

  const updateNode = (field: "label" | "note", value: string) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? { ...n, data: { ...n.data, [field]: value } }
          : n
      )
    );

    setSelectedNode({
      ...selectedNode,
      data: { ...selectedNode.data, [field]: value },
    });
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

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">

      {/* 🔷 NAVBAR */}
      <div className="h-14 bg-gray-800 flex items-center px-6 justify-between border-b border-gray-700 shadow">
        <h1 className="font-semibold text-lg tracking-wide">
          🧠 Knowledge Graph
        </h1>

        <button
          onClick={addNode}
          className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-500"
        >
          + Add Node
        </button>
      </div>

      <div className="flex flex-1">
        {/* GRAPH */}
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
            fitView
          >
            <Background color="#555" />
            <Controls />

            {/* Arrow marker */}
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

        {/* SIDEBAR */}
        {selectedNode && (
          <div className="w-80 p-4 bg-gray-800 border-l border-gray-700">
            <h2 className="font-bold mb-2">Node Details</h2>

            <input
              className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded"
              value={selectedNode.data.label}
              onChange={(e) => updateNode("label", e.target.value)}
            />

            <textarea
              className="w-full p-2 mb-3 bg-gray-700 border border-gray-600 rounded"
              value={selectedNode.data.note}
              onChange={(e) => updateNode("note", e.target.value)}
            />

            <button
              onClick={deleteNode}
              className="bg-red-600 w-full p-2 rounded"
            >
              Delete Node
            </button>
          </div>
        )}
      </div>
    </div>
  );
}