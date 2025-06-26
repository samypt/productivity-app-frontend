import React from "react";
import "./EditableTitle.css";

interface EditableTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  initialTitle: string;
  onSave: (newTitle: string) => void;
  className?: string;
  // style?: React.CSSProperties | undefined;
}

export const EditableTitle: React.FC<EditableTitleProps> = ({
  initialTitle,
  onSave,
  className = "",
}) => {
  const [title, setTitle] = React.useState(initialTitle);
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    onSave(title.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") inputRef.current?.blur();
    if (e.key === "Escape") {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  const handleChildClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className={`editable-title ${className}`}>
      {isEditing ? (
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="editable-input"
          onClick={handleChildClick}
        />
      ) : (
        <h1
          className="title-text"
          onClick={(e) => {
            handleChildClick(e);
            setIsEditing(true);
          }}
        >
          {title}
        </h1>
      )}
    </div>
  );
};
