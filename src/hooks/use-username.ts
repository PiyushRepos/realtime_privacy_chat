"use client";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

export const STORAGE_KEY = "chat-username";

export const ANIMALS = [
  "Lion",
  "Tiger",
  "Bear",
  "Wolf",
  "Eagle",
  "Shark",
  "Panther",
  "Leopard",
  "Cheetah",
  "Falcon",
];

const generateUsername = () => {
  const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `anonymous-${word}-${nanoid(5)}`;
};

export const useUsername = (): { username: string } => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const main = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUsername(stored);
        return;
      }

      const newUsername = generateUsername();
      localStorage.setItem(STORAGE_KEY, newUsername);
      setUsername(newUsername);
    };

    main();
  }, []);

  return { username };
};
