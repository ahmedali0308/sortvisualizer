async function bubbleSort(){
    for (var i=1; i<=data.length;i++){
        for (var j=0; j<data.length;j++){
            if (!_run) return;
            if (data[j+1]) colorGraph(dataIndex[j+1], BLUE);
            colorGraph(dataIndex[j], "red");
            if (data[j] > data[j + 1]) await swapData(j,j+1);
            if (data[j+1]) colorGraph(dataIndex[j+1]);
            colorGraph(dataIndex[j]);
        }
        colorGraph(dataIndex[data.length-i], "green");
    }
}

sort_button.addEventListener("click",async function(){ // HANDLE "SORT" BUTTON
    if (checkSorted()) return;
    if (_run) disableSort(); // IF ANIMATION ALREADY _run DISABLE
    else {
        _run = true;
        sort_button.style.backgroundColor = "red";
        await bubbleSort();
        if (_run) await runGraph();
        disableSort();
    }
});