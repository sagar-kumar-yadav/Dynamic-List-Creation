import React from "react";
import ListContainer from "./ListContainer";

const ListCreationView = ({
  firstList,
  secondList,
  newListItems,
  onLeftClick,
  onRightClick,
  onCancel,
  onUpdate,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        width: "100%",
      }}
    >
      {/* Lists Row */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "center", width: "100%" }}>
        {/* First List */}
        <ListContainer
          list={firstList}
          isActive={true}
          position="first"
          onSelect={() => {}}
          isSelected={false}
          hideCheckbox={true}
          showCount={true}
          onItemClick={(item) => onLeftClick(item, firstList.list_number)}
        />

        {/* New Middle List */}
        <ListContainer
          list={{ name: "New List", items: newListItems }}
          isActive={false}
          position={null}
          onSelect={() => {}}
          isSelected={false}
          hideCheckbox={true}
          showCount={true}
          onItemClick={(item) => {
            const originalListNumber = firstList.items.some(
              (i) => i.id === item.id
            )
              ? firstList.list_number
              : secondList.list_number;

            onRightClick(item, originalListNumber);
          }}
        />

        {/* Second List */}
        <ListContainer
          list={secondList}
          isActive={true}
          position="second"
          onSelect={() => {}}
          isSelected={false}
          hideCheckbox={true}
          showCount={true}
          onItemClick={(item) => onLeftClick(item, secondList.list_number)}
        />
      </div>

      {/* Action Buttons at Bottom */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onUpdate}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ListCreationView;
