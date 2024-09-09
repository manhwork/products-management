function phanCap(arr, parentId = "") {
    const tree = [];
    arr.forEach((item) => {
        if (item.parent_id === parentId) {
            const newItem = item;
            const childrent = phanCap(arr, item.id);
            if (childrent.length > 0) {
                newItem.childrent = childrent;
            }
            tree.push(newItem);
        }
    });

    return tree;
}

module.exports = phanCap;
