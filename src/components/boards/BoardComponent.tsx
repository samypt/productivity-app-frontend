import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { components } from "../../types/api";
import List from "../lists/List";
import { useMutationFetch } from "../../hooks";
import { EditableTitle } from "../common";
import { ListPlus, ListX, Trash2 } from "lucide-react";
import AddListForm from "../lists/AddListForm";
import "./BoardComponent.style.css";
import { getColorFromName } from "../../utils";

type Props = {
  board: components["schemas"]["BoardLists"];
};

type BoardUpdate = components["schemas"]["BoardUpdate"];
type BoardRead = components["schemas"]["BoardRead"];
type ListCreate = components["schemas"]["BoardListCreate"];
type ListRead = components["schemas"]["BoardListRead"];

const BoardComponent: React.FC<Props> = ({ board }) => {
  const [isAddListOpen, setAddListOpen] = useState(false);
  const [newList, setNewList] = useState<Omit<ListCreate, "board_id">>({
    name: "",
    position: 0,
  });
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setNewList({ ...newList, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullList: ListCreate = { ...newList, board_id: board.id };
    handleAddList(fullList);
    console.log(fullList);
    setNewList({
      name: "",
      position: 0,
    });
  };
  const { projectID } = useParams();

  // Update Board
  const editBoard = useMutationFetch<BoardRead, BoardUpdate>({
    url: `boards/update/${board.id}`,
    method: "PUT",
    queryKey: `boards${projectID}`,
  });

  const handleEditBoard = async (name: string) => {
    const updatedBoard: BoardUpdate = { name };
    editBoard.mutate(updatedBoard);
  };

  // Delete Board

  const deleteBoard = useMutationFetch({
    url: `boards/delete/${board.id}`,
    method: "DELETE",
    queryKey: `boards${projectID}`,
  });
  const handleDeleteBoard = () => {
    deleteBoard.mutate();
  };

  // Add new list to board

  const addList = useMutationFetch<ListRead, ListCreate>({
    url: `lists/create`,
    method: "POST",
    queryKey: `boards${projectID}`,
  });
  const handleAddList = async (listData: ListCreate) => {
    addList.mutate(listData);
  };

  const lists = board.lists.map((list) => <List key={list.id} list={list} />);
  return (
    <div
      className="board-card"
      style={{ backgroundColor: getColorFromName(board.name) }}
    >
      <header className="board-header">
        <EditableTitle
          className="board-title"
          initialTitle={board.name}
          onSave={handleEditBoard}
        />
        <Trash2 className="delete-icon" onClick={handleDeleteBoard} />
      </header>

      <article>
        <button
          className="add-list-button"
          onClick={() => setAddListOpen((prev) => !prev)}
        >
          {isAddListOpen ? (
            <>
              Close
              <ListX className="add-list-icon" />
            </>
          ) : (
            <>
              Add List
              <ListPlus className="add-list-icon" />
            </>
          )}
        </button>
      </article>

      {isAddListOpen && (
        <AddListForm
          list={newList}
          handleSubmit={(e) => {
            handleSubmit(e);
            setAddListOpen(false);
          }}
          handleChange={handleChange}
        />
      )}

      <div className="board-scroll-area">
        <div className="board-content">{lists}</div>
      </div>
    </div>
  );
};

export default BoardComponent;
