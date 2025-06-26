import React from "react";
import "./ActionButton.style.css";

type ButtonType = "accept" | "decline" | "read";

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  typeVariant: ButtonType;
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  typeVariant,
  children,
  ...props
}) => {
  return (
    <button className={`action-button ${typeVariant}`} {...props}>
      {children}
    </button>
  );
};

export default ActionButton;
