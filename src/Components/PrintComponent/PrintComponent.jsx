import React from "react";
import { IconPrint } from "../../assets/Icons";
import "../../Styles/Components/Print/layoutPrint.css";
import TranslationText from "../TranslationText";
import useTranslationText from "../../Hooks/useTranslationText";
import useDeviceType from "../../Hooks/useDeviceType";
import { Tooltip } from "react-tooltip";
import useFormateDataPrint from "../../utils/useFormateDataPrint";

const PrintComponent = ({
  Columns,
  data,
  ResourcePage,
  currentLanguage,
  footer,
  header,
 }) => {
  const deviceType = useDeviceType();

  const handlePrint = () => {
    const originalTitle = document.title;
    const timestamp = new Date().toISOString().split("T")[0];
    const pageId = ResourcePage || "GridReport";
    document.title = `${pageId}-${timestamp}`;

    const body = document.body;
    body.classList.add('printing');

    const printArea = document.getElementById(pageId);
    if (printArea) {
      printArea.classList.add('active-print');
    }

    window.print();

    body.classList.remove('printing');
    if (printArea) {
      printArea.classList.remove('active-print');
    }
    document.title = originalTitle;
  };

  const filteredColumns = Columns?.filter((col) => !col?.hidden);

  const renderRows = (data, level = 0) => {
    const opacityLevel = Math.max(100 - level * 20, 10);
    return (
      data.length > 0 &&
      data?.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <tr>
            {filteredColumns?.map((col, colIndex) => (
              <td
                key={colIndex}
                className={
                  "border text-center border-gray-300 py-2 px-4 " +
                  (row?.isChildren
                    ? `bg-gray-200 bg-opacity-[${opacityLevel}]`
                    : "")
                }
              >
                {useFormateDataPrint({
                  column: col,
                  row,
                  currentLanguage,
                  listGenenralList: null
                })}
              </td>
            ))}
          </tr>
          {row?.children &&
            row.children.length > 0 &&
            renderRows(row.children, level + 1)}
        </React.Fragment>
      ))
    );
  };

  return (
    <>
      <button
        className={
          deviceType !== "mobile" ? " btn_icon_action" : "btn_action"
        }
        data-tooltip-id={deviceType !== "mobile" ? "global-tooltip" : ""}
        data-resource-page="Grid"
        data-tooltip-content="Print"
        data-tooltip-place="bottom"
        type="button"
        onClick={handlePrint}
      >
        <IconPrint />
        {deviceType == "mobile" && (
          <span className="title_action">
            <TranslationText title="Print" page="Grid" />
          </span>
        )}
      </button>


      <div
        className="print-area h-svh "
        id={ResourcePage || "GridReport"}
      >
        {header && (
          <div className="report-header">
            <div className="bg-white flex items-center">
              <img className="h-full" src={header} alt="header" />
            </div>
          </div>
        )}
        <table className="print-component w-full">
          <thead className={`bg-white ${header ? "h-20" : "h-2"}`}>
            <tr>
              <th></th>
            </tr>
          </thead>
          <tbody className="report-content">
            <tr>
              <td className="p-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-white">
                      {filteredColumns?.map((col, index) => (
                        <th
                          key={index}
                          className="border border-gray-300 py-2 px-4 text-center font-semibold"
                        >
                          <p className="bg-transparent">
                            <TranslationText
                              page={
                                col?.generallist
                                  ? col?.generallist
                                  : col?.ResourcePage || ResourcePage
                              }
                              titleGenerallist={col?.generallist ? true : false}
                              title={col?.generallist ? col.title : col.title}
                            />
                          </p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{renderRows(data)}</tbody>
                </table>
              </td>
            </tr>
          </tbody>
          <tfoot className={`${footer ? "h-16" : "h-2"}`}>
            <tr>
              <td></td>
            </tr>
          </tfoot>
        </table>
        {footer && (
          <div className="report-footer flex justify-center items-center">
            <div className="bg-white flex items-center">
              <img className="h-full" src={footer} alt="header" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PrintComponent;