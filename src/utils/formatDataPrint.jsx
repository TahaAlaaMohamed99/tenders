import React from "react";
import { useFormatDate } from "./formatDate";
import useFormatTime from "./formatTime";
import useFormatNumber from "./formatNumber";

function useFormateDataPrint({
  column,
  row,
  currentLanguage,
  listGenenralList,
  className,
}) {
  const columnKey = column?.key;
  const value = row[columnKey];

  const matchGeneralLst = (listGenenralList, columnKey) => {
    if (!listGenenralList) return "";
    const matched = Object.keys(listGenenralList).map((list) =>
      list === columnKey ? listGenenralList[list]?.label : ""
    );
    return matched;
  };

  switch (column.type) {
    case "date":
      return (
        <p className={className}>{useFormatDate(value, currentLanguage)}</p>
      );

    case "dateTime":
      return (
        <p className={className}>
          {useFormatDate(value, currentLanguage, true)}
        </p>
      );
    case "generalList":
      return <p>{matchGeneralLst(listGenenralList, column.printKey)}</p>;
    case "salary":
      return <p className={className}>{useFormatNumber(value)}</p>;

    case "email":
    case "tel":
      return (
        <a
          href={column.type === "tel" ? `tel:${value}` : `mailto:${value}`}
          className={`${className} link`}
          onClick={(e) => e.stopPropagation()}
        >
          {value ?? "-"}
        </a>
      );

    case "status": {
      const statusClass =
        column.StatusList?.[row[column.secondKey]] ||
        column.className ||
        "status_Card";

      return (
        <div className={`status_Grid ${statusClass}`}>
          <p className="status_text">{value ?? "-"}</p>
        </div>
      );
    }

    case "color":
      return (
        <div
          className="status_Grid"
          style={{ background: value || "transparent" }}
        />
      );

    case "Merge":
      return (
        <p className={className}>
          {`${value ?? ""} ${row[column.secondKey] ?? ""}`}
        </p>
      );

    case "time":
      return (
        <p className={className}>{useFormatTime(value, currentLanguage)}</p>
      );

    case "boolean":
      return (
        <div className={`status_Grid ${value === true ? "state_Success" : ""}`}>
          <p className="status_text">{value === true ? "true" : "false"}</p>
        </div>
      );

    default:
      return (
        <p className={className}>
          {value ?? ""}
        </p>
      );
  }
}

export default useFormateDataPrint;
