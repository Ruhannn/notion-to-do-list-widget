import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card } from "./../types";
import { toast } from "sonner";

const getCard = async () => {
  const { data } = await axios.get(import.meta.env.VITE_API);
  return data.items;
};

const addCard = async (card: Card) => {
  const response = await axios.post(import.meta.env.VITE_API, card);
  return response.data;
};

const deleteCard = async (cardId: string) => {
  const response = await axios.delete(`${import.meta.env.VITE_API}/${cardId}`);
  return response.data;
};

const patchCard = async ({ cardId, column }: Card) => {
  const response = await axios.patch(`${import.meta.env.VITE_API}/${cardId}`, {
    column,
  });
  return response.data;
};

export const useCards = () => {
  const qc = useQueryClient();
  // for get data
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["cards"],
    queryFn: getCard,
    refetchInterval: 600000,
  });
  // for add data
  const { mutate: addNewCard } = useMutation({
    mutationFn: addCard,
    onMutate: async (newCard: Card) => {
      await qc.cancelQueries({ queryKey: ["cards"] });
      const previousCards = qc.getQueryData(["cards"]);
      qc.setQueryData(["cards"], (oldCards: Card[] | undefined) => [
        ...(oldCards || []),
        newCard,
      ]);
      return { previousCards };
    },
    onError: (err, __, context) => {
      qc.setQueryData(["cards"], context?.previousCards);
      toast.error(`${err.message} :C`);
    },
    onSuccess: () => {
      console.log("added");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
    },
  });
  // for delete a card
  const { mutate: removeCard } = useMutation({
    mutationFn: deleteCard,
    onMutate: async (cardId: string) => {
      await qc.cancelQueries({ queryKey: ["cards"] });
      const previousCards = qc.getQueryData<Card[]>(["cards"]);
      qc.setQueryData(["cards"], (oldCards: Card[] | undefined) =>
        oldCards ? oldCards.filter((card) => card.id !== cardId) : []
      );
      return { previousCards };
    },
    onError: (err, __, context) => {
      qc.setQueryData(["cards"], context?.previousCards);
      toast.error(`${err.message} :C`);
    },
    onSuccess: () => {
      console.log("dlt");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
    },
  });
  // for update a card
  const { mutate: updateCard } = useMutation({
    mutationFn: patchCard,
    onMutate: async ({ cardId, column }) => {
      await qc.cancelQueries({ queryKey: ["cards"] });
      const previousCards = qc.getQueryData<Card[]>(["cards"]);
      qc.setQueryData(["cards"], (oldCards: Card[] | undefined) =>
        oldCards
          ? oldCards.map((oldCard) =>
              oldCard.id === cardId ? { ...oldCard, column } : oldCard
            )
          : []
      );

      return { previousCards };
    },
    onError: (err, __, context) => {
      qc.setQueryData(["cards"], context?.previousCards);
      toast.error(`${err.message} :C`);
    },
    onSuccess: () => {
      console.log("card updateded");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  return {
    data,
    error,
    isLoading,
    refetch,
    addNewCard,
    removeCard,
    updateCard,
  };
};
