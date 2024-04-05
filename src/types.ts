/* eslint-disable @typescript-eslint/ban-types */
import { Dispatch, SetStateAction } from "react";

export type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

export type CardProps = CardType & {
  handleDragStart: Function;
};

export type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

export type ColumnType = "backlog" | "todo" | "doing" | "done";

export type CardType = {
  title: string;
  id?: string;
  column: ColumnType;
};

export type AddCardProps = {
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};
