/* eslint-disable @typescript-eslint/no-unsafe-function-type */

export type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
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
};
export type Card = {
  column: string;
  title?: string;
  cardId?: string;
  id?: string;
};
