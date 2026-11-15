import React, { useState, useEffect } from "react";
import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  // GET: Fetch all toys on page load
  useEffect(() => {
    fetch("http://localhost:3000/toys")
      .then((res) => res.json())
      .then((data) => setToys(data))
      .catch((error) => console.error("Error fetching toys:", error));
  }, []);

  // POST: Add a new toy
  function handleAddToy(newToyObj) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...newToyObj,
        likes: 0,
      }),
    })
      .then((res) => res.json())
      .then((createdToy) => {
        setToys([...toys, createdToy]);
      });
  }

  // DELETE: Donate / delete a toy
  function handleDeleteToy(idToDelete) {
    fetch(`http://localhost:3000/toys/${idToDelete}`, {
      method: "DELETE",
    }).then(() => {
      setToys(toys.filter((toy) => toy.id !== idToDelete));
    });
  }

  // PATCH: Increase likes for a toy
  function handleUpdateToy(updatedToyObj) {
    fetch(`http://localhost:3000/toys/${updatedToyObj.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: updatedToyObj.likes + 1,
      }),
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        setToys(toys.map((toy) => (toy.id === updatedToy.id ? updatedToy : toy)));
      });
  }

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer
        toys={toys}
        onDeleteToy={handleDeleteToy}
        onUpdateToy={handleUpdateToy}
      />
    </>
  );
}

export default App;