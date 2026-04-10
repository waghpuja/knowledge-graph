"use client";

import { GraphNode } from "../types";

type Props = {
  node: GraphNode;
  onChange: (field: "label" | "note", value: string) => void;
  onDelete: () => void;
};

export default function Sidebar({ node, onChange, onDelete }: Props) {
  return (
    <div className="w-80 p-4 border-l bg-white shadow-lg">
      <h2 className="text-lg font-bold mb-3">Node Details</h2>

      <label className="text-sm">Title</label>
      <input
        className="w-full border p-2 mb-3 rounded"
        value={node.data.label}
        onChange={(e) => onChange("label", e.target.value)}
      />

      <label className="text-sm">Note</label>
      <textarea
        className="w-full border p-2 mb-4 rounded"
        value={node.data.note}
        onChange={(e) => onChange("note", e.target.value)}
      />

      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-3 py-2 rounded w-full"
      >
        Delete Node
      </button>
    </div>
  );
}