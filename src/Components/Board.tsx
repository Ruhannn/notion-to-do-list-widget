import { motion } from "framer-motion";
import { useCards } from "../Service";
import { BurnBarrel } from "./BurnBarrel";
import { Column } from "./Column";
import Loading from "./Loading";
import Error from "./Error";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState } from "react";

const Board = () => {
  const [cre, setCre] = useState<boolean>(
    localStorage.getItem("cre") === "false" ? false : true
  );
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
      {/* contact */}
      <div
        className={`absolute bottom-0 right-0 flex items-center justify-center gap-2 !p-4 m-4 bg-neutral-800 text-[#c5c5c5] rounded-lg shadow-lg transition-opacity duration-300 ease-in-out [&_>_*]:transition-colors [&_>_*]:duration-200 [&_>_*]:cursor-pointer hover:opacity-100 ${
          cre ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      >
        <IoIosCloseCircleOutline
          title="hide"
          className="text-2xl hover:text-red-500"
          onClick={() => {
            setCre(false);
            localStorage.setItem("cre", "false");
          }}
        />
        <a
          href="https://github.com/Ruhannn"
          target="_blank"
          className="text-sm hover:text-blue-400"
        >
          Made by Ruhan
        </a>
      </div>
    </motion.div>
  );
};
export default Board;
