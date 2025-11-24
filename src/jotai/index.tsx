import React, { Suspense } from "react";
import { useAtom, useAtomValue, useSetAtom, Provider } from "jotai";
import {
  countAtom,
  doubleAtom,
  countSquaredAtom,
  userAtom,
  nameAtom,
  summaryAtom,
} from "./atoms";

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const double = useAtomValue(doubleAtom);
  const setSquared = useSetAtom(countSquaredAtom);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <p>Double: {double}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setSquared(count * count)}>Set Squared</button>
    </div>
  );
}

function User() {
  const user = useAtomValue(userAtom); // async atom
  return (
    <div>
      <h2>User</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

function NameInput() {
  const [name, setName] = useAtom(nameAtom);
  return (
    <div>
      <h2>Name</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  );
}

function Summary() {
  const summary = useAtomValue(summaryAtom);
  return (
    <div>
      <h2>Summary</h2>
      <p>{summary}</p>
    </div>
  );
}

export function Jotai() {
  return (
    <Provider>
      <h1>Jotai Complete Demo</h1>
      <Counter />
      <Suspense fallback={<div>Loading user...</div>}>
        <User />
      </Suspense>
      <NameInput />
      <Summary />
    </Provider>
  );
}
