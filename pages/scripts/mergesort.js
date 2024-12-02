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
    
    //var lr = await Promise.all([mergeSort(lData,lIndex, sp),mergeSort(rData,rIndex, sp + rData.length)]);
    var l = await mergeSort(lData,lIndex,sp);
    var r = await mergeSort(rData,rIndex,sp+rData.length);
    if (!_run) return;
    //var l = lr[0];
    //var r = lr[1];
    return await merge(l,r, sp);
}

async function render(){
    updateDataGraph();
    await sleep(100);
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

    for (var i=sp+merged.length-1; i>=sp;i--){
        if (!_run) return;
        data[i] = merged[i-sp];
        dataIndex[i] = mergedIndex[i-sp];
        colorGraph(dataIndex[i],BLUE);
        await render();
        colorGraph(dataIndex[i]);
    }
    return [merged,mergedIndex];
}

async function mergeGraph(){
    await mergeSort(data,dataIndex, 0);
}

sort_button.addEventListener("click",async function(){ // HANDLE "SORT" BUTTON
    if (_run) disableSort(); // IF ANIMATION ALREADY _run DISABLE
    else {
        _run = true;
        sort_button.style.backgroundColor = "red";
        await mergeGraph();
        if (_run) await runGraph();
        disableSort();
    }
});