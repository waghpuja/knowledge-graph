"use client";

type Props = {
  node: any;
  onChange: (field: "label" | "note", value: string) => void;
  onDelete: () => void;
};

export default function Sidebar({ node, onChange, onDelete }: Props) {
  if (!node) return null;

  return (
    <div className="w-80 p-4 bg-gray-900 border-l border-gray-700 text-white">
      <h2 className="text-lg font-bold mb-4">Node Details</h2>

      {/* Title */}
      <label className="text-sm text-gray-400">Title</label>
      <input
        className="w-full p-2 mt-1 mb-4 bg-gray-800 border border-gray-600 rounded outline-none focus:border-blue-500"
        value={node.data?.label || ""}
        onChange={(e) => onChange("label", e.target.value)}
      />

      {/* Note */}
      <label className="text-sm text-gray-400">Note</label>
      <textarea
        className="w-full p-2 mt-1 mb-4 bg-gray-800 border border-gray-600 rounded outline-none focus:border-blue-500"
        value={node.data?.note || ""}
        onChange={(e) => onChange("note", e.target.value)}
      />

      {/* Delete */}
      <button
        onClick={onDelete}
        className="bg-red-600 hover:bg-red-500 w-full p-2 rounded mt-2"
      >
        Delete Node
      </button>
    </div>
  );
}