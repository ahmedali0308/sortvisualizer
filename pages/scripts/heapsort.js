const slider = document.querySelector(".sliderelement");
const randomize_button = document.querySelector(".randomize");
const step_button = document.querySelector(".step");
const sort_button = document.querySelector(".sort");

const dataGraph = document.querySelector(".diagram");
var data = [];

function clearDataGraph(){
    while (dataGraph.firstChild) dataGraph.removeChild(dataGraph.lastChild);
}

function randomizeData(input){
    for (var i=0; i<input; i++){
        data[i] = Math.floor(Math.random()*100+1);
    }
}

function createDataGraph(){
    clearDataGraph();
    dataGraph.style.gap = Math.min(0.5,10/(data.length/2))+"vw";
    for (var i=0; i<data.length; i++){
        // <li class="bar"><p class="bold">0.1</p></li>
        const newBar = document.createElement("li");
        const newP = document.createElement("p");

        newBar.className = "bar";
        newBar.style.width = Math.min(10/(data.length/8),10)+"vw";
        newBar.style.height = data[i]/2+"vh";
        newBar.id = i;
        newP.className ="bold";
        newP.innerHTML = data[i];
        newP.style.fontSize = Math.min(20,16/(data.length/30))+"px";

        newBar.appendChild(newP);
        dataGraph.appendChild(newBar);
    }
}

slider.addEventListener("input", function(){
    data = [];
    randomizeData(this.value);
    createDataGraph();
});

randomize_button.addEventListener("click",function(){
    randomizeData(data.length);
    createDataGraph();
});



// MAIN SORTING ALGORITHM PART
sort_button.addEventListener("click",function(){
    data.sort();
    console.log(data);
    createDataGraph();
});

randomizeData(slider.value);
createDataGraph();