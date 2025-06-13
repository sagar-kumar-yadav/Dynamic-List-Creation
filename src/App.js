import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import Loader from "./components/Loader";
import ErrorView from "./components/ErrorView";
import ListContainer from "./components/ListContainer";
import ListCreationView from "./components/ListCreationView";

const API_URL = "https://apis.ccbp.in/list-creation/lists";

function App() {
  const [listsData, setListsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedLists, setSelectedLists] = useState([]);
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  const [newListItems, setNewListItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // fetch data from api --------------------------------------
  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      // console.log(data.lists[0]);

      const groupedLists = {};
      data.lists.forEach((item) => {
        const listNum = item.list_number;
        if (!groupedLists[listNum]) {
          groupedLists[listNum] = {
            list_number: listNum,
            id: listNum, // can be UUID or list number
            name: `List ${listNum}`,
            items: [],
          };
        }
        groupedLists[listNum].items.push({
          id: item.id,
          name: item.name,
          description: item.description,
        });
      });
      const finalLists = Object.values(groupedLists);
      setListsData(finalLists);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // use effect -----------------------------------------------
  useEffect(() => {
    fetchData();
  }, []);

  // Toggle list selection -----------------------------------------------------------------------
  const toggleListSelection = (listNumber) => {
    // console.log("list number " + listNumber);
    // console.log(isCreatingNewList);
    if (isCreatingNewList) return;
    setSelectedLists((prev) =>
      prev.includes(listNumber)
        ? prev.filter((num) => num !== listNumber)
        : prev.length < 2
        ? [...prev, listNumber]
        : prev
    );
  };

  //  When exactly two list containers are not checked and the Create a new list button is clicked, then the error message You should select exactly 2 lists to create a new list should be displayed -----------------------------
  const handleCreateList = () => {
    // console.log("Selected lists on create:", selectedLists); // (2) [1, 2]

    if (selectedLists.length !== 2) {
      // alert("You should select exactly 2 lists to create a new list.");
      setErrorMessage(
        "You should select exactly 2 lists to create a new list."
      );
      return;
    }

    setErrorMessage("");
    setIsCreatingNewList(true);
    setNewListItems([]);
  };

  // Log the value after the state update using useEffect
  useEffect(() => {
    // console.log("Updated newListItems:", newListItems);
  }, [newListItems]);

  // Move items between lists
  const moveToNewList = (item, fromList) => {
    setListsData((prev) =>
      prev.map((list) =>
        list.list_number === fromList
          ? { ...list, items: list.items.filter((i) => i.id !== item.id) }
          : list
      )
    );
    // setNewListItems((prev) => [...prev, item]);
    setNewListItems((prev) => [...prev, { ...item, sourceList: fromList }]);
  };

  // const moveFromNewList = (item, toList) => {
  //   setListsData((prev) =>
  //     prev.map((list) =>
  //       list.list_number === toList
  //         ? { ...list, items: [...list.items, item] }
  //         : list
  //     )
  //   );
  //   setNewListItems((prev) => prev.filter((i) => i.id !== item.id));
  // };

  const moveFromNewList = (item) => {
    setListsData((prev) =>
      prev.map((list) =>
        list.list_number === item.sourceList
          ? { ...list, items: [...list.items, { ...item }] }
          : list
      )
    );
    setNewListItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  // Cancel & Update actions
  const handleCancel = () => {
    fetchData();
    setIsCreatingNewList(false);
    setSelectedLists([]);
  };

  // if two list is checked then we create a new list in middle of the two list
  const handleUpdate = () => {
    const newListNumber = Math.max(...listsData.map((l) => l.list_number)) + 1;

    // Find indices of selected lists
    const firstIndex = listsData.findIndex(
      (list) => list.list_number === selectedLists[0]
    );
    const secondIndex = listsData.findIndex(
      (list) => list.list_number === selectedLists[1]
    );
    const insertIndex = Math.min(firstIndex, secondIndex) + 1;

    const newList = {
      list_number: newListNumber,
      id: newListNumber,
      name: `List ${newListNumber}`,
      items: newListItems,
    };

    const updatedLists = [
      ...listsData.slice(0, insertIndex),
      newList,
      ...listsData.slice(insertIndex),
    ];
    setListsData(updatedLists);
    setIsCreatingNewList(false);
    setSelectedLists([]);
    setNewListItems([]);
  };

  return (
    <>
      <div className="center-button-container">
        <h1 style={{}}>List Creation</h1>
        {isLoading && <Loader />}
        {isError && <ErrorView onRetry={fetchData} />}
        <button
          className="button"
          onClick={handleCreateList}
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            cursor: "pointer",
            padding: "9px",
            // borderRadius: "6px",
            borderRadius: "10px",
            marginTop: "10px",
          }}
        >
          Create a new list
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <div className="lists-wrapper">
        {!isCreatingNewList &&
          listsData.map((list) => {
            const isSelected = selectedLists.includes(list.list_number);

            const firstSelectedIndex = listsData.findIndex(
              (l) => l.list_number === selectedLists[0]
            );
            const secondSelectedIndex = listsData.findIndex(
              (l) => l.list_number === selectedLists[1]
            );

            const isFirstSelected =
              selectedLists.length === 2 &&
              list.list_number ===
                (firstSelectedIndex < secondSelectedIndex
                  ? selectedLists[0]
                  : selectedLists[1]);

            const isSecondSelected =
              selectedLists.length === 2 &&
              list.list_number ===
                (firstSelectedIndex < secondSelectedIndex
                  ? selectedLists[1]
                  : selectedLists[0]);

            return (
              <ListContainer
                key={list.id}
                list={list}
                onSelect={() => {
                  if (!isCreatingNewList) toggleListSelection(list.list_number);
                }}
                isSelected={isSelected}
                isActive={isSelected}
                position={
                  isFirstSelected ? "first" : isSecondSelected ? "second" : null
                }
                onItemClick={(item) => {
                  if (isCreatingNewList && isSelected) {
                    moveToNewList(item, list.list_number);
                  }
                }}
              />
            );
          })}

        {isCreatingNewList && selectedLists.length === 2 && (
          <ListCreationView
            key="new-list-view"
            firstList={listsData.find(
              (l) => l.list_number === selectedLists[0]
            )}
            secondList={listsData.find(
              (l) => l.list_number === selectedLists[1]
            )}
            newListItems={newListItems}
            onLeftClick={moveToNewList}
            onRightClick={moveFromNewList}
            onCancel={handleCancel}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </>
  );
}

export default App;
