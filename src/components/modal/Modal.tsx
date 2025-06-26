import React from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { CircleX } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";
import "./Modal.style.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  enabled?: boolean;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  enabled,
  children,
}) => {
  const settingsRef = React.useRef<HTMLDivElement>(null);

  useClickOutside({ ref: settingsRef, onClose, enabled });

  if (!isOpen) return null;

  const modelObject = (
    <div className="modal-overlay">
      <motion.div
        className="modal"
        ref={settingsRef}
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CircleX
          onClick={onClose}
          className="cancel"
          aria-label="Close modal"
        />
        {children}
      </motion.div>
    </div>
  );

  // return createPortal(modelObject, document.body);
  return createPortal(modelObject, document.getElementById("modal-root")!);
};
