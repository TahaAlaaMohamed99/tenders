import {
  useContext,
  useRef,
} from "react";
import GridScroll from "./GridScroll";
import BodyGrid from "./BodyGrid/BodyGrid";
import HeaderGrid from "./HeaderGrid/HeaderGrid";
import { TendersGridContext } from "../TendersGridContext";
import Footer from "./Footer";

export default function DasktopGrid() {
  const { columnState, rowActionList } = useContext(TendersGridContext);

  const totalfixedColumnsWidth = columnState?.fixed.reduce(
    (total, column) => total + (column.width ? parseFloat(column.width) : 0),
    0
  );
  const totalDefaultColumnsWidth = columnState?.default.reduce(
    (total, column) => total + (column.width ? parseFloat(column.width) : 0),
    0
  );
  const totalDefaultColumnsWidthPx =
    totalDefaultColumnsWidth + (rowActionList ? 36 : "") + "px";

  const scrollableContainerHeaderRef = useRef(null);
  const scrollableContainerDataRef = useRef(null);
  const gridScrollRef = useRef(null);
  const FooterTotalScrollRef = useRef(null);
  const headerScrollRef = useRef(null);

  const synchronizeScroll = (sourceRef, targetRefs) => {
    const source = sourceRef.current;
    if (source) {
      targetRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.scrollLeft = source.scrollLeft;
        }
      });
    }
  };

  const handleScroll = (type) => {
    switch (type) {
      case "header":
        synchronizeScroll(scrollableContainerHeaderRef, [
          scrollableContainerDataRef,
          gridScrollRef,
          FooterTotalScrollRef,
          headerScrollRef,
        ]);
        break;
      case "data":
        synchronizeScroll(scrollableContainerDataRef, [
          scrollableContainerHeaderRef,
          gridScrollRef,
          FooterTotalScrollRef,
        ]);
        break;
      case "virtual":
        synchronizeScroll(gridScrollRef, [
          scrollableContainerHeaderRef,
          scrollableContainerDataRef,
          FooterTotalScrollRef,
          headerScrollRef,
        ]);
        break;
      case "headerScroll":
        synchronizeScroll(headerScrollRef, [
          scrollableContainerHeaderRef,
          scrollableContainerDataRef,
          gridScrollRef,
          FooterTotalScrollRef,
        ]);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <HeaderGrid
        scrollableContainerHeaderRef={scrollableContainerHeaderRef}
        handleScroll={handleScroll}
        totalDefaultColumnsWidthPx={totalDefaultColumnsWidthPx}
      />
      <GridScroll
        gridScrollRef={headerScrollRef}
        totalfixedColumnsWidth={totalfixedColumnsWidth}
        totalDefaultColumnsWidthPx={totalDefaultColumnsWidthPx}
        handleScroll={() => handleScroll("headerScroll")}
      />
      <BodyGrid
        scrollableContainerDataRef={scrollableContainerDataRef}
        totalDefaultColumnsWidthPx={totalDefaultColumnsWidthPx}
        handleScroll={handleScroll}
      />
      <Footer
        scrollableContainerDataRef={FooterTotalScrollRef}
        handleScroll={handleScroll}
        totalDefaultColumnsWidthPx={totalDefaultColumnsWidthPx}
      />
      <GridScroll
        gridScrollRef={gridScrollRef}
        totalfixedColumnsWidth={totalfixedColumnsWidth}
        totalDefaultColumnsWidthPx={totalDefaultColumnsWidthPx}
        handleScroll={() => handleScroll("virtual")}
      />
    </>
  );
}
