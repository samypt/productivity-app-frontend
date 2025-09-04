import React from "react";
import { components } from "../../types/api";
import "./AddListForm.style.css";

type List = components["schemas"]["BoardListCreate"];
type Props = {
  list: Omit<List, "board_id">;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
};

const AddListForm: React.FC<Props> = ({ list, handleSubmit, handleChange }) => {
  return (
    <form className="add-list-form" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        name="name"
        value={list.name}
        onChange={handleChange}
        placeholder="List name"
        required
        className="input-name"
        autoFocus
      />
      <input
        type="number"
        name="position"
        value={list.position}
        onChange={handleChange}
        placeholder="Position"
        required
        className="input-position"
        min={0}
      />
      <button type="submit" className="btn-submit" aria-label="Add list">
        Add List
      </button>
    </form>
  );
};

export default AddListForm;
