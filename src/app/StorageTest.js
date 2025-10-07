"use client";

import { useState } from "react";

export default function StorageTest() {
  const [name, setName] = useState(""); //input state
  const [savedName, setSavedName] = useState(""); //save name

  const saveName = () => {
    // TODO: save "name" into localStorage 
   localStorage.setItem("username", name); // save 
  };

  const loadName = () => { //load into result field 
    // TODO: load name from localStorage and setSavedName
    const value = localStorage.getItem("username")
    setSavedName(value);
  };

  return (
    <div className="p-6 space-y-4">
      <input
        value={name}  //name = user input name 
        onChange={(e) => setName(e.target.value)} //when every new name 
        placeholder="Type your name"
        className="border px-2 py-1"
      />
      <button onClick={saveName} className="bg-blue-500 text-white px-4 py-2">
        Save
      </button>
      <button onClick={loadName} className="bg-green-500 text-white px-4 py-2">
        Load
      </button>
      <p>Saved Name: {savedName}</p>
    </div>
  );
}
