async function quickSort(sp, ep){ // MAIN SORTING ALGORITHM
    if (!_run) return; // IF ANIMATION WAS CANCELLED STOP ALGORITHM
    if (ep <= sp) return; // BASE CASE; ALGORITHM IS DONE
    const pivot = await partition(sp, ep); // PARTITION THE DATASET IN THE MIDDLE
    await quickSort(sp, pivot - 1) // SORT LEFT SIDE
    await quickSort(pivot + 1, ep) // SORT RIGHT SIDE
}

async function partition(sp, ep){
    const pivot = data[ep];
    colorGraph(ep,"black");
    var i = sp - 1;
    for (var j = sp; j < ep; j++){
        if (!_run) return; // IF ANIMATION WAS CANCELLED STOP ALGORITHM
        if (data[j] < pivot){
            i++;
            colorGraph(i,"red");
            colorGraph(j,BLUE);
            await swapData(i,j);
            colorGraph(i);
            colorGraph(j);
        }
    }
    i++;
    colorGraph(i,"green");
    colorGraph(j,BLUE);
    await swapData(i,ep);
    colorGraph(i);
    colorGraph(j);
    colorGraph(ep);
    return i;

}

sort_button.addEventListener("click",async function(){ // HANDLE "SORT" BUTTON
    if (_run) disableSort(); // IF ANIMATION ALREADY _run DISABLE
    else {
        _run = true;
        sort_button.style.backgroundColor = "red";
        await quickSort(0,data.length-1);
        if (_run) await runGraph();
        disableSort();
    }
});