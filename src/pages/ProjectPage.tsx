import React from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useFetchWithPagination, useMutationFetch } from "../hooks";
import { components } from "../types/api";
import BoardComponent from "../components/boards/BoardComponent";
import { ClipboardPlus } from "lucide-react";
import { BoardCreateModal } from "../components/boards/modals/BoardCreateModal";
import "./ProjectPage.style.css";

type Boards = components["schemas"]["AllBoardsLists"];
type BoardCreate = components["schemas"]["BoardCreate"];
type BoardRead = components["schemas"]["BoardListRead"];

const ProjectPage: React.FC = () => {
  const { projectID } = useParams();
  // Board create
  const [isCreateOpen, setIsCreateOpen] = React.useState<boolean>(false);
  const handleOpenCreate = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);
  const createBoard = useMutationFetch<BoardRead, BoardCreate>({
    method: "POST",
    url: "boards/create",
    queryKey: `boards${projectID}`,
  });

  const handleCreate = async (boardData: BoardCreate) => {
    createBoard.mutate(boardData);
  };

  // Get all boards

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  const LIMIT: number = 4;
  const OFFSET: number = 0;
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFetchWithPagination<Boards>(
    {
      url: `project/${projectID}/boards`,
      method: "GET",
      queryKey: `boards${projectID}`,
    },
    { limit: LIMIT, offset: OFFSET }
  );
  const allBoards = data?.pages.flatMap((page) => page.boards) ?? [];

  const boards = allBoards.map((board) => (
    <BoardComponent key={board.id} board={board} />
  ));

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="boards-page">
      <div className="boards-header">
        <h2 className="boards-title">Boards</h2>
        <ClipboardPlus className="add-board-icon" onClick={handleOpenCreate} />
      </div>

      <div className="boards-grid">
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
