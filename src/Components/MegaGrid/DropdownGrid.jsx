import { useContext, useState, useEffect, useRef } from "react";
import { MegaGridContext } from "./MegaGridContext";
import TranslationText from "../TranslationText";
import { IconRowActions } from "../../assets/Icons";

const DropdownGrid = ({
  menuItems,
  className = "",
  title = "",
  classNameMenu,
  icon = (
    <IconRowActions className="text-textColor dark:textColorDark text-opacity-50" />
  ),
  ResourcePage = "",
  row,
  isRowAction = false,
  position = "absolute",
}) => {
  const { selectedRows, isSelectedAll, handleSelectAll, setRowTransaction, currentLanguage } =
    useContext(MegaGridContext);

  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // ✅ Toggle Dropdown
  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyle({
        position: position,
        top: position == "absolute" ? "44px" : rect.bottom + 4 + "px",
        "left": position == "absolute" ? "0px" :
          (currentLanguage === "ar"
            ? rect.left + 15
            : rect.left - 150) + "px",
        zIndex: 9999,
      });

    }
    setIsOpen((prev) => !prev);
    setRowTransaction(row);
  };

  // ✅ Close on outside click or scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => setIsOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  // ✅ Handle click on menu item
  const handleItemClick = (e, item) => {
    e.stopPropagation();
    if (item.onClick) {
      if (isRowAction) item.onClick(row);
      else {
        item.onClick(selectedRows);
        if (isSelectedAll) handleSelectAll();
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="Dropdown_Grid    relative">
      <button
        ref={buttonRef}
        className={`btn_Dropdown_Grid ${className}`}
        onClick={toggleDropdown}
        type="button"
      >
        {!isRowAction && selectedRows.length > 0 && (
          <span className="total">{selectedRows.length}</span>
        )}
        <TranslationText page={ResourcePage} title={title} />
        <span
          className={`icon transition-transform ${isOpen && !isRowAction ? "rotate-180" : ""
            }`}
        >
          {icon}
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          style={menuStyle}
          className={`Menu_Dropdown_Grid ${classNameMenu} z-[9999]`}
        >
          <div className="p-2" role="menu" aria-orientation="vertical">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="MenuItem_Dropdown_Grid"
                role="menuitem"
                type="button"
                disabled={item?.disabled}
                onClick={(e) => handleItemClick(e, item)}
              >
                {item?.icon && <span className="icon">{item?.icon}</span>}
                <span
                  className={`${item.label === "installmentNumber" ? "text-xs w-10" : ""
                    }`}
                >
                  <TranslationText page={ResourcePage} title={item?.label} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownGrid;
