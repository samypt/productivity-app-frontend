import React from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { ClipboardPlus } from "lucide-react";
import { BoardCreateModal } from "../components/boards/modals/BoardCreateModal";
import Agenda from "../components/events/Agenda";
import BoardComponent from "../components/boards/BoardComponent";
import { useCreateBoard, useFetchBoards } from "../api/boards";
import "./ProjectPage.style.css";

const ProjectPage: React.FC = () => {
  const { projectID } = useParams();

  // -----------------------------
  // Board creation state & handlers
  // -----------------------------
  // Controls the visibility of the "Create Board" modal
  const [isCreateOpen, setIsCreateOpen] = React.useState<boolean>(false);
  const handleOpenCreate = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  // -----------------------------
  // API hook for creating a board
  // -----------------------------
  // This hook performs the API call to create a board
  // and automatically invalidates relevant queries to refresh the list
  const { createBoard: handleCreate } = useCreateBoard(projectID!);

  // -----------------------------
  // Infinite scroll observer
  // -----------------------------
  // `ref` is attached to the bottom of the board list
  // `inView` becomes true when the user scrolls near it
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // -----------------------------
  // Fetch boards for this project
  // -----------------------------
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchBoards(projectID!);

  // Flatten paginated data into a single array of boards
  const allBoards = data?.pages.flatMap((page) => page.boards) ?? [];

  // -----------------------------
  // Render boards
  // -----------------------------
  const boards = allBoards.map((board) => (
    <BoardComponent key={board.id} board={board} />
  ));

  // -----------------------------
  // Fetch next page on scroll
  // -----------------------------
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="boards-page">
      <div className="boards-header">
        <h2 className="boards-title">Boards</h2>
        <ClipboardPlus className="add-board-icon" onClick={handleOpenCreate} />
      </div>

      <div className="boards-grid">
        <Agenda projectID={projectID} showActions={true} />
        {allBoards.length ? (
          boards
        ) : (
          <p className="boards-empty">No boards yet</p>
        )}
      </div>

      <BoardCreateModal
        project_id={projectID!}
        isOpen={isCreateOpen}
        onClose={handleCloseCreate}
        onSave={handleCreate}
      />

      <div ref={ref} />
      {isFetchingNextPage && <p className="loading-message">Loading...</p>}
    </div>
  );
};

export default ProjectPage;
