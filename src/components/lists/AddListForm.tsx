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
    <form className="add-list-form" onSubmit={handleSubmit}>
      <input
        name="name"
        value={list.name}
        onChange={handleChange}
        placeholder="name"
        required
      />
      <input
        type="number"
        name="position"
        value={list.position}
        onChange={handleChange}
        required
      />
      <button type="submit">Add List</button>
    </form>
  );
};

export default AddListForm;
