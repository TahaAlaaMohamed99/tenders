import React, { useContext } from 'react'
import { MegaGridContext } from '../MegaGridContext'

export default function GridScroll({
  gridScrollRef,
  handleScroll,
  totalfixedColumnsWidth,
  totalDefaultColumnsWidthPx
}) {
  const { isTree, rowActionList, isOpenInNewTab, isSelected, isOpenChildGrid, onClickRow } = useContext(MegaGridContext)
const calcMarginStart = () => {
  let margin = totalfixedColumnsWidth;

  if (isSelected) margin += 40;
  if (isOpenInNewTab) margin += 40;
  if (onClickRow) margin += 40;
  if (isTree) margin += 40;
  if (isOpenChildGrid) margin += 40;

  return margin;
};

const marginStart = `${calcMarginStart()}px`;
const marginEnd = rowActionList ? "2.5rem" : "";  return (
    <div
      className=" Scroll_Grid "
      ref={gridScrollRef}
      style={{
        marginInlineStart: marginStart,
        marginInlineEnd: marginEnd
      }}
      onScroll={handleScroll}
    >
      <div
        style={{
          width: totalDefaultColumnsWidthPx,
        }}
      ></div>
    </div>
  )
}
