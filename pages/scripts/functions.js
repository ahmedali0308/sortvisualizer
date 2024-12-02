const slider = document.querySelector(".sliderelement");
const randomize_button = document.querySelector(".randomize");
const sort_button = document.querySelector(".sort");

const dataGraph = document.querySelector(".diagram");
var data = [];
var dataIndex = [];

const NUMBER_THRESHOLD = 150 // THRESHOLD WHEN TO STOP SHOWING THE SIZE NUMBERS

var _run = false // WHEN THIS IS FALSE THE RUN ANIMATION STOPS

const BLUE = "#0800FF";
const GRAY = "#D9D9D9";

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
    dataGraph.style.gap = Math.min(0.5,10/(data.length/2))+"vw";
    for (var i=0; i<data.length; i++){
        // PRESET:
        // <li class="bar"><p class="bold">0.1</p></li>
        
        const newBar = document.createElement("li");
        newBar.className = "bar";
        newBar.style.width = Math.min(10/(data.length/8),10)+"vw";
        newBar.style.height = data[i]/2+"vh";
        newBar.style.order = i;
        newBar.id = i; // FOR DEBUGGING; NOT CODE RELEVANT

        if(slider.value <= NUMBER_THRESHOLD){
            const newP = document.createElement("p");
            newP.className ="bold";
            newP.innerHTML = data[i];
            newP.style.fontSize = Math.min(20,16/(data.length/30))+"px";
            newBar.appendChild(newP);
        }

        dataGraph.appendChild(newBar);
    }
}

function disableSort(){
    _run = false;
    sort_button.style.backgroundColor = BLUE;
    decolorGraph();
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
    await sleep(200);
    const data_i = data[i];
    const dataIndex_i = dataIndex[i];
    data[i] = data[j];
    data[j] = data_i;
    dataIndex[i] = dataIndex[j];
    dataIndex[j] = dataIndex_i;
    updateDataGraph();
}

function colorGraph(i,color){
    const dataGraphChild = dataGraph.children[i];
    if (color) dataGraphChild.style.backgroundColor = color;
    else dataGraphChild.style.backgroundColor = GRAY;
}

function decolorGraph(){
    for (var i=0; i<data.length; i++){
        colorGraph(dataIndex[i]);
    }
}

async function runGraph(){
    if (data.length <= 3) return;
    for (var i=0; i<data.length-2; i++){
        if (!_run) return;
        colorGraph(dataIndex[i],BLUE);
        colorGraph(dataIndex[i+1],BLUE);
        colorGraph(dataIndex[i+2],BLUE);
        await sleep(400);
        colorGraph(dataIndex[i]);
        colorGraph(dataIndex[i+1]);
        colorGraph(dataIndex[i+2]);
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

// INITIALIZE STARTING DATASET
randomizeData(slider.value);
// DRAW STARTING GRAPHIC USING STARTING DATASET
createDataGraph();