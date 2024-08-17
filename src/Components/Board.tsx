import { motion } from "framer-motion";
import { useCards } from "../Service";
import { BurnBarrel } from "./BurnBarrel";
import { Column } from "./Column";
import Loading from "./Loading";
import Error from "./Error";

const Board = () => {
  // TODO: loacstoge + api
  const { data, error, isLoading } = useCards();
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error err={error.message} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex w-full h-full gap-3 p-12 overflow-x-scroll"
    >
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
    </motion.div>
  );
};
export default Board;
