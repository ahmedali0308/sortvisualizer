async function bubbleSort(){
    for (var i=1; i<=data.length;i++){
        if (!_run) return;
        for (var j=0; j<data.length;j++){
            if (!_run) return;
            if (data[j] > data[j + 1]) await swapData(j,j+1);
        }
        colorGraph(data.length-i);
    }
}

sort_button.addEventListener("click",async function(){ // HANDLE "SORT" BUTTON
    if (_run) disableSort(); // IF ANIMATION ALREADY _run DISABLE
    if (checkSorted()) return;
    else {
        _run = true;
        sort_button.style.backgroundColor = RED;
        await bubbleSort();
        if (_run) await runGraph();
        disableSort();
    }
});