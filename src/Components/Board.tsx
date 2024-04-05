import { Dispatch, SetStateAction, useState } from "react";
import { CardType } from "../types";
import Column from "./Column";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import axios from "axios";

const Board = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  axios.get(import.meta.env.VITE_API).then((response) => {
    const data = response.data.items;
    setCards(data);
  });

  return (
    <div className="flex w-full h-full gap-3 p-12 overflow-x-scroll">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        column="doing"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-emerald-200"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} cards={cards} />
    </div>
  );
};
export default Board;
const BurnBarrel = ({
  setCards,
  cards,
}: {
  setCards: Dispatch<SetStateAction<CardType[]>>;
  cards: CardType[];
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    const updatedCards = cards.filter((c) => c.id !== cardId); 

    try {
      await axios.delete(`${import.meta.env.VITE_API}/${cardId}`);
      setCards(updatedCards);
    } catch (error) {
      console.error("Error deleting card:", error);
      setCards((prevCards) => [...prevCards]);
    }

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}>
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};
