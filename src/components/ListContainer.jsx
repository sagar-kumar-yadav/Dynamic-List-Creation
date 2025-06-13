import React from "react";
import { MdArrowForward, MdArrowBack } from "react-icons/md";

const ListContainer = ({
  list,
  onSelect,
  position,
  isActive,
  isSelected,
  onItemClick,
  hideCheckbox = false,
  showCount = false,
}) => {
  // console.log(list.items);
  if (!list || !Array.isArray(list.items)) {
    return <p>No items found for this list.</p>;
  }

  // Determine icon based on position
  // console.log(position);
  const renderIcon = () => {
    if (position === "first") return <MdArrowForward size={24} />;
    if (position === "second") return <MdArrowBack size={24} />;
    return null;
  };

  return (
    <div
      style={{
        padding: "10px",
        margin: "10px",
        background: "#EFF6FF",
        width: "300px",
        height: "500px",
        fontFamily: "sans-serif",
        overflowY: "auto",
        // overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          // alignItems: "center",
          padding: "0 16px",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {!hideCheckbox && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              style={{ marginRight: "8px" }}
            />
          )}
          <h3 style={{ fontFamily: "sans-serif", padding: "16px 0" }}>
            {list.name || "Unnamed List"}
            {/* {list.name === "New List" && ` (${list.items?.length || 0})`} */}
            {showCount && list.items && (
              <span style={{ fontWeight: "normal", color: "#555" }}>
                {" "}
                ({list.items.length})
              </span>
            )}
          </h3>
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {list.items.map((item) => (
            <li
              key={item.id}
              style={{
                marginBottom: "10px",
                padding: "17px",
                border: "1px solid #dbd5d5",
                borderRadius: "20px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
              onClick={() => onItemClick?.(item)}
            >
              <strong>{item.name}</strong>
              <div>{item.description}</div>
              {isActive && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    style={{
                      background: "none",
                      color: "inherit",
                      border: "none",
                      font: "inherit",
                      cursor: "pointer",
                      outline: "inherit",
                    }}
                  >
                    {renderIcon()}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListContainer;
