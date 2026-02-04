import React from "react";
import { IconXsl } from "../assets/Icons";
import { useFormatDate } from "../utils/useFormatDate";
import useFormatNumber from "../utils/useFormatNumber";
import useTranslationText from "../Hooks/useTranslationText";
import useDeviceType from "../Hooks/useDeviceType";
import TranslationText from "./TranslationText";
import { Tooltip } from "react-tooltip";

/**
 * ExcelExportButton
 *
 * A button component that exports the given data to an Excel file.
 *
 * @param {object} props
 * @param {array} props.columns - An array of column definitions.
 * @param {array} props.data - An array of data objects to be exported.
 * @param {string} [props.fileName=exported_data.xls] - The file name for the exported Excel file.
 * @param {string} [props.currentLanguage] - The current language setting for formatting dates.
 * @param {string} [props.ResourcePage] - The resource page for translation.
 *
 * @returns {ReactElement}
 */
const ExcelExportButton = ({
  columns,
  data,
  fileName = "exported_data.xls",
  currentLanguage,
   ResourcePage,
   showText, // Added showText
}) => {
  const visibleColumns = columns.filter((column) => !column.hidden);
  const isRTL = currentLanguage == "ar";
  const deviceType = useDeviceType();

  // Format cell data based on column type
  const formatCellData = (value, column, row) => {
    if (!value && value !== 0) return "";

    try {
      switch (column.type) {
        case "date":
          return useFormatDate(value, currentLanguage);

        case "dateTime":
          return useFormatDate(
            value,
            currentLanguage,
            row[column.secondKey] != undefined ? !row[column.secondKey] : true
          );

        case "salary":
          return useFormatNumber(value);

        case "email":
        case "tel":
          return String(value);

        case "status":
          return String(value);

        case "openPage":
          return String(value);

        default:
          return String(value).replace(/[<>&]/g, (c) => {
            switch (c) {
              case "<":
                return "<";
              case ">":
                return ">";
              case "&":
                return "&";
              default:
                return c;
            }
          });
      }
    } catch (error) {
      console.error(
        `Error formatting cell data for column ${column.key}:`,
        error
      );
      return String(value || "");
    }
  };

  const generateRows = (data, level = 0) => {
    let rows = "";
    data.forEach((row) => {
      const styleId = row?.isChildren ? "childRowStyle" : "cellStyle";

      rows += "<Row>";
      visibleColumns.forEach((col) => {
        const cellData = row[col.key];
        const formattedData = formatCellData(cellData, col, row);

        rows += `
          <Cell ss:StyleID="${styleId}">
            <Data ss:Type="String">${formattedData}</Data>
          </Cell>`;
      });
      rows += "</Row>";

      if (row.children?.length > 0) {
        rows += generateRows(row.children, level + 1);
      }
    });
    return rows;
  };

  const exportToExcel = () => {
    const originalTitle = document.title; // Save original title
    const currentDate = new Date();
    const formattedDate = useFormatDate(currentDate, currentLanguage); // Format date based on language
    const baseFileName = ResourcePage || fileName.replace(".xls", "");
    const dynamicFileName = `${baseFileName}-${formattedDate}.xls`; // e.g., SalesReport-24-Apr-2025.xls
    document.title = `${baseFileName}-${formattedDate}`; // Set document.title without extension

    const styles = `
      <Styles>
        <Style ss:ID="headerStyle">
          <Font ss:Bold="1"/>
          <Interior ss:Color="#D9EAD3" ss:Pattern="Solid"/>
          <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
          <Borders>
            <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
          </Borders>
        </Style>
        <Style ss:ID="cellStyle">
          <Borders>
            <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
          </Borders>
          <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
        </Style>
        <Style ss:ID="childRowStyle">
          <Borders>
            <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
          </Borders>
          <Interior ss:Color="#F3F3F3" ss:Pattern="Solid"/>
          <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
        </Style>
        <Style ss:ID="statusStyle">
          <Borders>
            <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
            <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
          </Borders>
          <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
          <Font ss:Bold="1"/>
        </Style>
      </Styles>
    `;

    const header = `<?xml version="1.0" encoding="UTF-8"?>
      <?mso-application progid="Excel.Sheet"?>
      <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
        xmlns:html="http://www.w3.org/TR/REC-html40">
        ${styles}
            <Worksheet ss:Name="Sheet1"${isRTL ? ' ss:RightToLeft="1"' : ""}>
          <Table x:FullColumns="1" x:FullRows="1">`;

    const columnsWidths = visibleColumns
      .map((col) =>
        col.width
          ? `<Column ss:Width="${Math.min(
            Math.max(col.width / 1.5, 50),
            300
          )}"/>`
          : '<Column ss:AutoFitWidth="1"/>'
      )
      .join("");

    const headerRow = `<Row>${visibleColumns
      .map(
        (col) => `
          <Cell ss:StyleID="headerStyle">
            <Data ss:Type="String">${useTranslationText({
          page: col?.generallist
            ? col?.generallist
            : col?.ResourcePage || ResourcePage,
          title: col?.title,
          titleGenerallist: col?.generallist ? true : false,
          lang: currentLanguage,
         })}</Data>
          </Cell>
        `
      )
      .join("")}</Row>`;

    const dataRows = generateRows(data);
    const footer = `
          </Table>
        </Worksheet>
      </Workbook>
    `;

    const xml = `${header}${columnsWidths}${headerRow}${dataRows}${footer}`;

    try {
      const blob = new Blob([xml], {
        type: "application/vnd.ms-excel;charset=utf-8",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = dynamicFileName; // Use dynamic file name with date
      link.click();
      URL.revokeObjectURL(link.href);
      document.title = originalTitle; // Restore original title
    } catch (error) {
      console.error("Export failed:", error);
      document.title = originalTitle; // Restore title even on error
    }
  };
  return (
    <>
      <button
        type="button"
        className={showText ? "btn_text_icon" : (deviceType !== "mobile" ? " btn_icon_action" : "btn_action")}

        onClick={exportToExcel}
        data-tooltip-content="exportToExcel"
        data-resource-page="Grid"
        data-tooltip-id="global-tooltip"
        data-tooltip-place="bottom"

      >
        <IconXsl />
        {(deviceType == "mobile" || showText) && (
          <span className="title_action">
            <TranslationText title="Export" page="Grid" />
          </span>
        )}
      </button>

    </>

  );
};

export default ExcelExportButton;
