import { useContext, useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PopupModalSlide from "../PopupModalSlide";
import {
  IconColumnSettings,
  IconEye,
  IconEyeClosed,
  IconHiddenMobile,
  IconMobile,
} from "../../assets/Icons";
import { setLocalStorageBtoa } from "../../utils/localStorage";
import TranslationText from "../TranslationText";
import { TendersGridContext } from "./TendersGridContext";
import useTranslationText from "../../Hooks/useTranslationText";
import { useSelector } from "react-redux";


// Main component for column customization
const CustomizeColumn = ({ showText }) => {
  const {
    columnState,
    handleColumnSettingsChange,
    GridKey,
    ResourcePage,
    currentLanguage,
   } = useContext(TendersGridContext);
   
  const [localColumns, setLocalColumns] = useState([]); // Local state for column modifications
  const [isOpen, setIsOpen] = useState(false); // Modal visibility state

  // Sync localColumns with parent-provided columnState.all
   useEffect(() => {
    setLocalColumns(columnState.all);
  }, [columnState.all]);

  // Initialize sensors for drag-and-drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Toggle column visibility
  const handleVisibilityChange = (columnKey, props) => {
    const updatedColumns = localColumns.map((col) => {
      if (col.key === columnKey) {
        return { ...col, [props]: !col[props] };
      }
      return col;
    });
    setLocalColumns(updatedColumns); // Update the local column state
  };

  // Save current configuration to local storage and propagate changes
  const saveToLocalStorage = () => {
    setLocalStorageBtoa(`TendersGrid_${GridKey}`, localColumns); // Custom local storage function
    handleColumnSettingsChange(localColumns); // Update parent component's state
    setIsOpen(!isOpen); // Close the modal
  };

  // Handle reordering of columnState.all during drag-and-drop
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!active || !over) return;

    if (active.id !== over.id) {
      setLocalColumns((items) => {
        const oldIndex = items.findIndex((col) => col.key === active.id);
        const newIndex = items.findIndex((col) => col.key === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex); // Reorder the columnState.all
        return newOrder;
      });
    }
  };
  return (
    <>
      {/* Settings button to open the column customization modal */}
      <button
        className={showText ? "btn_text_icon" : "btn_icon_action"}
        type="button"

        onClick={() => setIsOpen(!isOpen)}
      >
        <IconColumnSettings bgCircle="bg-white dark:bg-bgWhiteDark" />
        {showText && <TranslationText title="CustomPicker" page="Grid"/>}
      </button>
      {/* Modal for column customization */}
      <PopupModalSlide
        modalSize="w-96"
        isVisible={isOpen}
        toggleClick={() => setIsOpen(!isOpen)}
        submitClick={() => saveToLocalStorage()}
        CancelClick={() => setIsOpen(!isOpen)}
        icon={
          <IconColumnSettings className="text-titleColor dark:text-titleColorDark " />
        }
        titleSubmitBtn="saveChange"
        title="customizeColumns"
        ResourcePage="Grid"
        ResourceBtns="Grid"
        titleCancel="cancel"
      >
        {/* Drag-and-drop context for column ordering */}
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext
            items={localColumns
              .filter((column) => !column.fixed) // Exclude fixed columnState.all from reordering
              .map((col) => col.key)}
            strategy={rectSortingStrategy}
          >
            {localColumns
              .filter((column) => !column.fixed) // Render non-fixed columnState.all
              .map((col) => (
                <SortableItem
                  key={col.key}
                  column={col}
                  handleVisibilityChange={handleVisibilityChange}
                  ResourcePage={ResourcePage}
                />
              ))}
          </SortableContext>
        </DndContext>
      </PopupModalSlide>
    </>
  );
};

// Individual sortable item for a column
const SortableItem = ({ column, handleVisibilityChange, ResourcePage }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform = { x: 0, y: 0 }, // Handle drag transformations
    transition = "transform 250ms ease", // Smooth animation
    isDragging,
  } = useSortable({ id: column.key });
  const currentLanguage = useSelector(
    (state) => state.themeSlice.currentLanguage
  );
 
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0, // Adjust stacking during dragging
    position: isDragging ? "relative" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`col_SortableItem ${
        isDragging && "bg-bgColor dark:bg-bgColorDark"
      }`}
      role="menuitem"
    >
      {/* Drag handle for reordering */}
      <button
        className="icon_SortableItem "
        {...attributes}
        {...listeners}
        aria-label={`Drag handle for ${column.title} column`}
      >
        ⠿
      </button>

      {/* Column title and visibility toggle */}
      <div className="flex items-center justify-between space-x-2 flex-grow  select-none">
        <p className="text-sm text-titleColor dark:text-titleColorDark">
          <TranslationText
            page={
              column.ResourcePage || ResourcePage
            }
            titleGenerallist={column.generallist ? true : false}
            title={column.generallist ? column.title : column.title}
          />
        </p>
        <div className="flex gap-2">
          <button
            className="show_Col  "
            onClick={() => handleVisibilityChange(column.key, "hiddenMobile")}
            data-tooltip-content={!column.hiddenMobile ? "hiddenMobile" : "showMobile"}
            data-resource-page="Grid"
            data-tooltip-id="global-tooltip"
          >
            {!column.hiddenMobile ? (
              <IconMobile className="text-titleColor dark:text-titleColorDark" />
            ) : (
              <IconHiddenMobile className="text-textColor dark:text-textColorDark" />
            )}
          </button>
          
          <button
            className="show_Col  "
            onClick={() => handleVisibilityChange(column.key, "hidden")}
            data-tooltip-content={!column.hidden ? "hidden" : "show"}
            data-resource-page="Grid"
            data-tooltip-id="global-tooltip"
          >
            {!column.hidden ? (
              <IconEye className="text-titleColor dark:text-titleColorDark" />
            ) : (
              <IconEyeClosed className="text-textColor dark:text-textColorDark" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeColumn;
