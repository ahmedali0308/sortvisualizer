const slider = document.querySelector("#dataslider");
const randomize_button = document.querySelector(".randomize");
const sort_button = document.querySelector(".sort");
const mirror_button = document.querySelector(".mirror");

const dataGraph = document.querySelector(".diagram");
var data = [];
var dataIndex = [];

var _run = false // WHEN THIS IS FALSE THE RUN ANIMATION STOPS

var _mirror = false;

var speed = 150; // DELAY OF ANIMATION IN MS

const BLUE = "#0800FF";
const RED = "red";
const GREEN = "green";
const BLACK = "black";

function scale (number, inMin, inMax, outMin, outMax) { // FUNCTION TO MAP RANGE ONTO OTHER RANGE
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function clearDataGraph(){ // REMOVES ALL THE BARS IN THE GRAPHIC
    while (dataGraph.firstChild) dataGraph.removeChild(dataGraph.lastChild);
}

async function randomizeData(input){ // RE-INITIALIZES DATASET WITH RANDOM VALUES AND A LENGTH OF 'INPUT'
    disableSort();
    for (var i=0; i<input; i++){
        data[i] = Math.floor(Math.random()*100+1);
        dataIndex[i] = i;
    }
}

function createDataGraph(){ // DRAWS THE CURRENTLY SAVED DATASET ONTO THE GRAPHIC
    clearDataGraph();
    //dataGraph.style.gap = Math.min(0.5,10/(data.length/2))+"vw";
    for (var i=0; i<data.length; i++){
        // PRESET:
        // <li class="bar"><p class="bold">0.1</p></li>
        
        const newBar = document.createElement("li");
        newBar.className = "bar";
        newBar.style.width = Math.min(10/(data.length/10),10)+"vw";
        newBar.style.height = data[i]/2+"vh";
        newBar.style.order = i;
        newBar.style.backgroundColor = getColorAtIndex(i);
        newBar.id = i; // FOR DEBUGGING; NOT CODE RELEVANT

        dataGraph.appendChild(newBar);
    }
}

function getColorAtIndex(i){
    var color = scale(data[i],1,100,10,255);
    return "rgb("+8+","+0+","+color+")";
}

function disableSort(){
    _run = false;
    mirror_button.disabled = false;
    sort_button.style.backgroundColor = BLUE;
    sort_button.innerHTML = "Sort";
    decolorGraph();
}

function enableSort(){
    _run = true;
    mirror_button.disabled = true;
    sort_button.style.backgroundColor = RED;
    sort_button.innerHTML = "Stop";
}

function checkSorted(){
    for (var i=1; i<data.length; i++){
        if (data[i]<data[i-1])
            return false;
    }
    return true;
}

function updateDataGraph(){ // UPDATES THE GRAPHIC BASED ON THE CURRENT DATASET
    const dataGraphChildren = dataGraph.children;
    for (var i=0; i<dataGraphChildren.length; i++){
        dataGraphChildren[dataIndex[i]].style.order = i;
    }
}

function sleep(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay/(data.length/8));
    });
}

async function swapData(i,j){ // SWAPS INDICIES i AND j IN THE DATASET
    colorGraph(i,GREEN);
    colorGraph(j,RED);
    await sleep(speed);
    const data_i = data[i];
    const dataIndex_i = dataIndex[i];
    data[i] = data[j];
    data[j] = data_i;
    dataIndex[i] = dataIndex[j];
    dataIndex[j] = dataIndex_i;
    updateDataGraph();
    await sleep(speed);
    colorGraph(i);
    colorGraph(j);
}

function colorGraph(i,color){
    const dataGraphChild = dataGraph.children[dataIndex[i]];
    if (color) dataGraphChild.style.backgroundColor = color;
    else dataGraphChild.style.backgroundColor = getColorAtIndex(i);
}

function decolorGraph(){
    for (var i=0; i<data.length; i++){
        colorGraph(i);
    }
}

async function runGraph(){
    var drawSize = Math.floor(Math.max(3,data.length/10));
    if (data.length <= 3) return;
    for (var i=1-drawSize; i<data.length; i++){
        if (!_run) return;
        for (var j=0;j<drawSize;j++){
            if (data[i+j]) colorGraph(i+j, GREEN);
        }
        await sleep(speed*2);
        for (var j=0;j<drawSize;j++){
            if (data[i+j]) colorGraph(i+j);
        }
    };
    decolorGraph();
};

slider.addEventListener("input", function(){ // HANDLE SLIDER FOR "# of Data"
    data = [];
    dataIndex = [];
    randomizeData(this.value);
    createDataGraph();
});

randomize_button.addEventListener("click",function(){ // HANDLE "RANDOMIZE" BUTTON
    randomizeData(data.length);
    createDataGraph();
});

mirror_button.style.backgroundColor = _mirror ? GREEN : RED;
mirror_button.addEventListener("click",function(){
    if (_run) return;
    _mirror = !_mirror;
    mirror_button.style.backgroundColor = _mirror ? GREEN : RED;
})

// INITIALIZE STARTING DATASET
randomizeData(slider.value);
// DRAW STARTING GRAPHIC USING STARTING DATASET
createDataGraph();