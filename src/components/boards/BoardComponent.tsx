import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { components } from "../../types/api";
import List from "../lists/List";
import { EditableTitle } from "../common";
import { Trash2, ListPlus, ListX } from "lucide-react";
import AddListForm from "../lists/AddListForm";
import { usePastelColor } from "../../utils";
import { useBoardStore, Sort } from "../../store/boards";
import "./BoardComponent.style.css";

import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskRow from "../tasks/TaskRow";
import { useMoveTask } from "../../api/tasks";
import { useDeleteBoard, useEditBoard } from "../../api/boards";
import { useCreateList } from "../../api/lists";

type Props = {
  board: components["schemas"]["BoardLists"];
};
type TaskFull = components["schemas"]["TaskFull"];
type ListCreate = components["schemas"]["BoardListCreate"];

const DEFAULT_SORT: Sort = { key: null, order: null };

const BoardComponent: React.FC<Props> = ({ board }) => {
  /* --------------------------------------------------------------------------
   * STORE HOOKS (init, access, update lists)
   * -------------------------------------------------------------------------- */
  const initList = useBoardStore((s) => s.initList);
  const replaceFlat = useBoardStore((s) => s.setTasks);

  // helper to safely access flat tasks from store
  const flatByList = (listId: string) =>
    useBoardStore.getState().lists[listId]?.flat ?? [];

  // initialize lists when board changes
  React.useEffect(() => {
    board.lists.forEach((l) => initList(l.id, DEFAULT_SORT));
  }, [board.lists, initList]);

  /* --------------------------------------------------------------------------
   * LOCAL STATE
   * -------------------------------------------------------------------------- */
  const [activeTask, setActiveTask] = useState<TaskFull | null>(null);

  // Sensors for drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // UI state for "Add List"
  const [isAddListOpen, setAddListOpen] = useState(false);
  const [newList, setNewList] = useState<Omit<ListCreate, "board_id">>({
    name: "",
    position: 0,
  });

  /* --------------------------------------------------------------------------
   * FORM HANDLERS (create new list)
   * -------------------------------------------------------------------------- */
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
    setNewList({ name: "", position: 0 });
  };

  /* --------------------------------------------------------------------------
   * API HOOKS (edit, delete, create list, move task)
   * -------------------------------------------------------------------------- */
  const { projectID } = useParams();
  const { editBoard: handleEditBoard } = useEditBoard(board.id, projectID!);
  const { deleteBoard: handleDeleteBoard } = useDeleteBoard(
    board.id,
    projectID!
  );
  const { createList: handleAddList } = useCreateList(projectID!);
  const { moveTask: handleApiMoveTask } = useMoveTask();

  /* --------------------------------------------------------------------------
   * DRAG & DROP HANDLERS
   * -------------------------------------------------------------------------- */
  // When drag starts → set active task for overlay
  const handleDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id);
    for (const l of board.lists) {
      const found = flatByList(l.id).find((t) => t.id === id);
      if (found) {
        setActiveTask(found);
        break;
      }
    }
  };

  // When drag ends → reorder or move task
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveTask(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // 1 Find source task (list + index)
    let fromListId: string | null = null;
    let fromIdx = -1;
    for (const l of board.lists) {
      const tasks = flatByList(l.id);
      const idx = tasks.findIndex((t) => t.id === activeId);
      if (idx !== -1) {
        fromListId = l.id;
        fromIdx = idx;
        break;
      }
    }
    if (!fromListId) return;

    // 2 Find target task or list
    let toListId: string | null = null;
    let toIdx = -1;

    const overIsTask = board.lists.some((l) =>
      flatByList(l.id).some((t) => t.id === overId)
    );

    if (overIsTask) {
      for (const l of board.lists) {
        const tasks = flatByList(l.id);
        const idx = tasks.findIndex((t) => t.id === overId);
        if (idx !== -1) {
          toListId = l.id;
          toIdx = idx;
          break;
        }
      }
    } else {
      // dropped into empty list space
      toListId = overId;
      toIdx = flatByList(toListId)?.length ?? 0;
    }

    if (!toListId) return;

    // 3 Reorder within the same list
    if (fromListId === toListId) {
      const tasks = [...flatByList(fromListId)];
      const reordered = arrayMove(tasks, fromIdx, toIdx);
      replaceFlat(fromListId, reordered);
      return;
    }

    // 4 Move across lists
    const fromFlat = [...flatByList(fromListId)];
    const toFlat = [...flatByList(toListId)];

    const [moved] = fromFlat.splice(fromIdx, 1);
    moved.list_id = toListId; // update reference
    toFlat.splice(toIdx, 0, moved);

    // update store
    replaceFlat(fromListId, fromFlat);
    replaceFlat(toListId, toFlat);

    // update via API
    handleApiMoveTask(moved.id, toListId);
  };

  /* --------------------------------------------------------------------------
   * RENDER LISTS
   * -------------------------------------------------------------------------- */
  const lists = board.lists.map((list) => {
    const tasks = flatByList(list.id);

    return (
      <SortableContext
        key={list.id}
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <List list={list} />
      </SortableContext>
    );
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <section
        className="board"
        style={{ backgroundColor: usePastelColor(board.name) }}
      >
        <header className="board-header">
          <EditableTitle
            className="board-title"
            initialTitle={board.name}
            onSave={async (newTitle) => {
              await handleEditBoard({ name: newTitle });
            }}
          />
          <div className="board-controls">
            {isAddListOpen && (
              <button
                className="board-button"
                onClick={() => setAddListOpen(false)}
              >
                <ListX size={18} />
                <span>Close</span>
              </button>
            )}
            {!isAddListOpen && (
              <button
                className="board-button"
                onClick={() => setAddListOpen(true)}
              >
                <ListPlus size={18} />
                <span>Add List</span>
              </button>
            )}
            <button
              className="delete-button"
              onClick={handleDeleteBoard}
              aria-label="Delete board"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        {isAddListOpen && (
          <div className="add-list-form-wrapper">
            <AddListForm
              list={newList}
              handleSubmit={(e) => {
                handleSubmit(e);
                setAddListOpen(false);
              }}
              handleChange={handleChange}
            />
          </div>
        )}

        <div className="board-content">{lists}</div>
      </section>
      <DragOverlay>
        {activeTask ? <TaskRow task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardComponent;
