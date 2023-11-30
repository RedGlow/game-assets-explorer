"use client";

import { Button } from 'flowbite-react';
import { useCallback, useState } from 'react';
import { HiArrowSmDown, HiArrowSmUp } from 'react-icons/hi';

export type SortBy = "name" | "extension";
export type SortOrders = {
  name: boolean;
  extension: boolean;
};

function SortButton({
  label,
  value,
  currentSortBy,
  setSortBy,
  ascending,
  setAscending,
}: {
  label: string;
  value: SortBy;
  currentSortBy: SortBy;
  setSortBy(newValue: SortBy): void;
  ascending: boolean;
  setAscending(newValue: boolean): void;
}) {
  const onClick = useCallback(() => {
    if (currentSortBy === value) {
      setAscending(!ascending);
    } else {
      setSortBy(value);
    }
  }, [ascending, currentSortBy, setAscending, setSortBy, value]);
  return (
    <Button
      size="xs"
      color={value == currentSortBy ? "dark" : "gray"}
      onClick={onClick}
    >
      {label}
      {ascending ? <HiArrowSmDown /> : <HiArrowSmUp />}
    </Button>
  );
}

export interface IEntriesSorting {
  nameAscending: boolean;
  setNameAscending(newValue: boolean): void;
  extensionAscending: boolean;
  setExtensionAscending(newValue: boolean): void;
  sortBy: SortBy;
  setSortBy(newValue: SortBy): void;
}

export function EntriesSorting({
  nameAscending,
  setNameAscending,
  extensionAscending,
  setExtensionAscending,
  sortBy,
  setSortBy,
}: IEntriesSorting) {
  return (
    <div className="flex gap-4 items-center py-4">
      <span>Sort by:</span>
      <SortButton
        label="Name"
        value="name"
        currentSortBy={sortBy}
        setSortBy={setSortBy}
        ascending={nameAscending}
        setAscending={setNameAscending}
      />
      <SortButton
        label="Extension"
        value="extension"
        currentSortBy={sortBy}
        setSortBy={setSortBy}
        ascending={extensionAscending}
        setAscending={setExtensionAscending}
      />
    </div>
  );
}
