import { useContext, useState, Fragment } from "react";
import { formatDataGrid } from "../../../utils/formatDataGrid";
import TranslationText from "../../TranslationText";
import { IconRowActions, IconTreeView } from "../../../assets/Icons";
import { TendersGridContext } from "../TendersGridContext";
export default function MobileGrid() {
  const {
    columnState,
    getData,
    ResourcePage,
    onClickRow,
    rowActionList,
    routeKey,
    openRows,
    isTree,
    toggleRow,
    currentLanguage,
    keyId = "recId",
  } = useContext(TendersGridContext);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const handleOpenSheet = (item) => {
    setSelectedItem(item);
    setIsOpenBottomSheet(true);
  };
  const closeSheet = () => {
    setIsOpenBottomSheet(false);
    setSelectedItem(null);
  };

  const renderCard = (rows, level = 0) => {
    return rows.map((row, rowIndex) => (
      <Fragment key={rowIndex}>
        <div
          className="Card_Grid"
          onClick={() => onClickRow && onClickRow(row)}
        >
          <div
            className={`Container_Card ${
              rowActionList ? "Container_Card_Action" : ""
            }`}
          >
            {columnState?.fixed.map((column, indexCol) => {
               
              return (
                <div
                  key={indexCol}
                  className={`${
                    column.isFullWidthMobile
                      ? "row_Card   w-full"
                      : "row_Card  basis-[calc(50%-0.75rem)]"
                  } `}
                >
                  <h4 className={` flex title_Card text_ellipsis items-center`}>
                    {isTree && indexCol == 0 && (
                      <button
                        type="button"
                        className={
                          "icon_action_row " +
                          (!!openRows[row[keyId]] ? "active" : "")
                        }
                        onClick={(e) => {
                          if (row.children && row.children.length > 0) {
                            e.stopPropagation();
                            toggleRow(row[keyId], row.children);
                          }
                        }}
                      >
                        {row.children && row.children.length > 0 && (
                          <IconTreeView />
                        )}
                      </button>
                    )}
                    <span className={``}>
                      <TranslationText
                        page={
                          column.generallist
                            ? column.generallist
                            : column.ResourcePage || ResourcePage
                        }
                        titleGenerallist={column.generallist ? true : false}
                        title={column.generallist ? column.title : column.title}
                      />
                    </span>
                  </h4>
                  {formatDataGrid(
                    column,
                    row,
                    routeKey,
                    currentLanguage,
                    "text_Card text_ellipsis"
                  )}
                </div>
              );
            })}
            {columnState?.defaultMobile.map((column, indexCol) => {
              return (
                <div
                  key={indexCol}
                  className="row_Card  basis-[calc(50%-0.75rem)]"
                >
                  <h4 className="title_Card text_ellipsis">
                    <TranslationText
                      page={
                        column.generallist
                          ? column.generallist
                          : column.ResourcePage || ResourcePage
                      }
                      titleGenerallist={column.generallist ? true : false}
                      title={column.generallist ? column.title : column.title}
                    />{" "}
                  </h4>
                  {formatDataGrid(
                    column,
                    row,
                    routeKey,
                    currentLanguage,
                    "text_Card text_ellipsis"
                  )}
                </div>
              );
            })}
          </div>
          {rowActionList && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenSheet(row);
              }}
              className="action_Card"
              type="button"
            >
              <span className="icon_action">
                <IconRowActions />
              </span>
            </button>
          )}
        </div>
        {openRows[row[keyId]] &&
          row.children &&
          renderCard(row.children, level + 1)}
      </Fragment>
    ));
  };
  return (
    <div className="Mobile_Grid">
      {renderCard(getData)}
  
    </div>
  );
}
