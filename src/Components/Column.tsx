import { FormEvent, useState } from "react";
import { AddCardProps, CardType, ColumnProps } from "../types";
import Card from "./Card";
import DropIndicator from "./DropIndicator";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    if (e.dataTransfer && card.id) {
      e.dataTransfer.setData("cardId", card.id);
    }
  };
  const handleDragEnd = async (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e.nativeEvent, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      try {
        await fetch(
          `https://kamid.pockethost.io/api/collections/TOdos/records/${cardId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ column: column }),
          }
        );

        let copy = [...cards];

        let cardToTransfer = copy.find((c) => c.id === cardId);
        if (!cardToTransfer) return;
        cardToTransfer = { ...cardToTransfer, column };

        copy = copy.filter((c) => c.id !== cardId);

        const moveToBack = before === "-1";

        if (moveToBack) {
          copy.push(cardToTransfer);
        } else {
          const insertAtIndex = copy.findIndex((el) => el.id === before);
          if (insertAtIndex === undefined) return;

          copy.splice(insertAtIndex, 0, cardToTransfer);
        }

        setCards(copy);
      } catch (error) {
        console.error("Error updating column:", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e.nativeEvent, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${column}"]`
      ) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="text-sm rounded text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}>
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};
export default Column;
const AddCard = ({ column, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
    };
    setCards((prevCards) => [...prevCards, newCard]);
    setAdding(false);
    setText("");

    try {
      const response = await fetch(
        `https://kamid.pockethost.io/api/collections/TOdos/records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCard),
        }
      );
      if (!response.ok) {
        console.log("Failed to add card to the database.");
      }
      const createdCard = await response.json();
      setCards((prevCards) => [...prevCards.slice(0, -1), createdCard]);
    } catch (error) {
      console.error("Error:", error);
      setCards((prevCards) => prevCards.slice(0, -1));
    }
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full p-3 text-sm border rounded border-violet-400 bg-violet-400/20 text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50">
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300">
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50">
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};
