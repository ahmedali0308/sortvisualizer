async function mergeSort(arr, arrIndex, sp){
    var n = arr.length;
    if (!_run) return;
    if (n == 1) return [arr,arrIndex, sp]; // BASE CASE
    var lData = [];
    var rData = [];
    var lIndex = [];
    var rIndex = [];

    var h = Math.floor(n/2);
    for (var i=0; i<h; i++){ // SPLIT DATASET INTO TWO ARRAYS -> LEFT
        lData[i] = arr[i];
        lIndex[i] = arrIndex[i];
    }
    for (var i=h; i<n; i++){ // SPLIT DATASET INTO TWO ARRAYS -> RIGHT
        rData[i-h] = arr[i];
        rIndex[i-h] = arrIndex[i];
    }
    
    //var lr = await Promise.all([mergeSort(lData,lIndex, sp),mergeSort(rData,rIndex, sp + lData.length)]);
    var l = await mergeSort(lData,lIndex,sp);
    var r = await mergeSort(rData,rIndex,sp+lData.length);
    if (!_run) return;
    //var l = lr[0];
    //var r = lr[1];
    return await merge(l,r, sp);
}

async function render(){
    updateDataGraph();
    await sleep(speed);
}

async function merge(l,r,sp){ // TURNS 2 ARRAYS INTO 1 SORTED ARRAY
    var lData = l[0];
    var rData = r[0];
    var lIndex = l[1];
    var rIndex = r[1];

    var merged = [];
    var mergedIndex = [];
    while(lData[0] && rData[0]){ // SORT UNTIL EITHER L OR R IS EMPTY
        if (!_run) return;
        if (lData[0] <= rData[0]){
            merged[merged.length] = lData.shift();
            mergedIndex[mergedIndex.length] = lIndex.shift();
        } else {
            merged[merged.length] = rData.shift();
            mergedIndex[mergedIndex.length] = rIndex.shift();
        }
    };
    // NOW L OR R ARE EMPTY; PUT THE REST IN MERGED BECAUSE THEY INDIVIDUALLY ARE ALREADY SORTED ANYWAY
    while(lData[0]){
        if (!_run) return;
        merged[merged.length] = lData.shift();
        mergedIndex[mergedIndex.length] = lIndex.shift();
    }
    while(rData[0]){
        if (!_run) return;
        merged[merged.length] = rData.shift();
        mergedIndex[mergedIndex.length] = rIndex.shift();
    }

    var tempData = [];
    var tempDataIndex = [];

    for (var i=sp; i<=sp+merged.length-1;i++){ // PUT MERGED INTO TEMPDATA
        tempData[i] = merged[i-sp];
        tempDataIndex[i] = mergedIndex[i-sp];
    }
    for (var i=sp; i<sp+merged.length-1;i++){ // VISUALIZE TEMPDATA INTO DATA
        // GO THROUGH AGAIN BUT FROM YOUR POSITION SO IGNORE YOURSELF AND EVERYONE BEFORE YOU
        // FIND SMALLEST DATA
        // SWAP YOURSELF WITH THAT DATA
        if (!_run) return;
        var smallestData = [tempData[sp+merged.length-1],tempDataIndex.indexOf(sp+merged.length-1)]; // VALUE, POS
        for (var j=i; j<=sp+merged.length-1;j++){
            if (smallestData[0]>=data[j]){
                smallestData = [data[j],j];
            }
        }
        if (!(i==smallestData[i])) await swapData(i,smallestData[1]);
    }
    if (!_run) return;
    return [merged,mergedIndex];
}

async function mergeGraph(){
    await mergeSort(data,dataIndex, 0);
}

sort_button.addEventListener("click",async function(){ // HANDLE "SORT" BUTTON
    if (_run) disableSort(); // IF ANIMATION ALREADY _run DISABLE
    if (checkSorted()) return;
    else {
        _run = true;
        sort_button.style.backgroundColor = RED;
        await mergeGraph();
        if (_run) await runGraph();
        disableSort();
    }
});