const func = {
  clearHoverStatus() {
    var rows = document.querySelectorAll('.tree-row')
    for(let i=0; i < rows.length; i++) {
      const row = rows[i]
      const hoverBlock: any = row.children[row.children.length - 1]
      hoverBlock.style.display = 'none'
      hoverBlock.children[0].style.opacity = 0.1
      hoverBlock.children[1].style.opacity = 0.1
      hoverBlock.children[2].style.opacity = 0.1
    }
  },
  getElementTop(element:any, tableRef:any) {
    // 固定表头，需要做特殊计算
    let scrollTop = tableRef.querySelector('.drag-tree-table-body').scrollTop
    var actualTop = element.offsetTop - scrollTop;
    var current = element.offsetParent;
    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }
    return actualTop
  },
  getElementLeft(element:any) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null){
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    return actualLeft
  },
  deepClone (aObject:any) {
    if (!aObject) {
      return aObject;
    }
    //date类型
    if (aObject instanceof Date) {
      const copydata = new Date();
      copydata.setTime(aObject.getTime());
      return copydata
    }
    let bObject:any, v, k;
    bObject = Array.isArray(aObject) ? [] : {};
    for (k in aObject) {
      v = aObject[k];
      bObject[k] = (typeof v === "object") ? func.deepClone(v) : v;
    }
    return bObject;
  },
}
export default func;
