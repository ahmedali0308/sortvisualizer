async function quickSort(sp, ep){ // MAIN SORTING ALGORITHM
    if (!_run) return; // IF ANIMATION WAS CANCELLED STOP ALGORITHM
    if (ep <= sp) return; // BASE CASE; ALGORITHM IS DONE
    const pivot = await partition(sp, ep); // PARTITION THE DATASET IN THE MIDDLE
    if (_mirror) await Promise.all([quickSort(sp, pivot - 1),quickSort(pivot + 1, ep)]); // SORT BOTH SIDES
    else {
        await quickSort(sp, pivot - 1) // SORT LEFT SIDE
        await quickSort(pivot + 1, ep) // SORT RIGHT SIDE
    }
}

async function partition(sp, ep){
    const pivot = data[ep];
    colorGraph(ep,BLACK);
    var i = sp - 1;
    for (var j = sp; j < ep; j++){
        if (!_run) return; // IF ANIMATION WAS CANCELLED STOP ALGORITHM
        if (data[j] < pivot){
            i++;
            await swapData(i,j);
        }
    }
    i++;
    if (!_run) return;
    colorGraph(ep);
    await swapData(i,ep);
    return i;
}

sort_button.addEventListener("click",async function(){ // HANDLE "SORT" BUTTON
    if (checkSorted()) return;
    if (_run) disableSort(); // IF ANIMATION ALREADY _run DISABLE
    else {
        enableSort();
        await quickSort(0,data.length-1);
        if (_run) await runGraph();
        disableSort();
    }
});