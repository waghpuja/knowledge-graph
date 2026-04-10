import { Node } from "reactflow";

export type NodeData = {
  label: string;
  note: string;
};

export type GraphNode = Node<NodeData>;