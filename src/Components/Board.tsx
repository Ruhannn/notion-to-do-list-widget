import { useCards } from "../Service";
import { BurnBarrel } from "./BurnBarrel";
import { Column } from "./Column";

const Board = () => {
  // TODO: add loading loacstoge + api
  const { data, error, isLoading } = useCards();
  if (isLoading) {
    return <>loading</>;
  }
  if (error) {
    return <>errr</>;
  }
  return (
    <div className="flex w-full h-full gap-3 p-12 overflow-x-scroll">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-neutral-500"
        cards={data}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-200"
        cards={data}
      />
      <Column
        title="In progress"
        column="doing"
        headingColor="text-blue-200"
        cards={data}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-emerald-200"
        cards={data}
      />
      <BurnBarrel />
    </div>
  );
};
export default Board;
