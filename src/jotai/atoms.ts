import { atom } from "jotai";
import { atomWithDefault } from "jotai/utils";

// 基础 atom
export const countAtom = atom(0);

// 派生 atom（read-only）
export const doubleAtom = atom((get) => get(countAtom) * 2);

// 派生 atom（read-write）
export const countSquaredAtom = atom(
  (get) => get(countAtom) ** 2,
  (get, set, update: number) => {
    set(countAtom, update);
  }
);

// 异步 atom
export const userAtom = atom(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await res.json();
  return data;
});

// atomWithDefault（带默认值，可延迟初始化）
export const nameAtom = atomWithDefault("Guest");

// 组合 atom（读多个 atom 的值）
export const summaryAtom = atom((get) => {
  const count = get(countAtom);
  const double = get(doubleAtom);
  const name = get(nameAtom);
  return `${name}: count=${count}, double=${double}`;
});
