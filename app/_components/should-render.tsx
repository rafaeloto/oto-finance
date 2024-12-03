import React from "react";

interface ShouldRenderProps {
  condition: boolean;
  children: React.ReactNode;
}

const ShouldRender = ({ condition, children }: ShouldRenderProps) => {
  if (condition) {
    return { children };
  }

  return null;
};

export default ShouldRender;
