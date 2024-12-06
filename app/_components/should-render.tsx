import React from "react";

interface Props {
  if: boolean;
  children: React.ReactNode;
}

const ShouldRender: React.FC<Props> = ({ if: condition, children }) => (
  <>{condition ? children : null}</>
);

export default ShouldRender;
