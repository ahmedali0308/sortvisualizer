async function heapSort(){
    var ep; // REFERS TO END POINT; PAST THIS POINT ARRAY IS ALREADY SORTED
    for (var i=1; i<=data.length; i++){
        if (!_run) return;
        ep = data.length-i;
        await heapify(ep); // MOVE BIGGEST DATA TO HEAD OF BINARY TREE
        await swapData(0,ep); // SWAP HEAD AND END OF TREE (FIRST AND LAST ARRAY DATA)
        colorGraph(ep,GREEN);
    }
}

async function heapify(ep){
    if (ep == 0) return data; // ARRAY IS ALREADY A BINARY TREE
    var parent;
    var child;
    for (var i=ep; i>0; i--){
        if (!_run) return;
        parent = Math.floor((i-1)/2);
        child = i;
        if (data[child]>data[parent]) await swapData(parent,child);
    }
}

sort_button.addEventListener("click",async function(){ // HANDLE "SORT" BUTTON
    if (checkSorted()) return;
    if (_run) disableSort(); // IF ANIMATION ALREADY _run DISABLE
    else {
        _run = true;
        sort_button.style.backgroundColor = RED;
        await heapSort();
        if (_run) await runGraph();
        disableSort();
    }
});