
let errorlist=[]

let addError=(err)=>{
    errorlist.push(err);
}

let clearErrorList=()=>{
    errorlist=[];
}


function runAssembler(){
    clearErrorList();

    addError("Error 1");
    addError("Error 2");
    setErrorListTextarea(errorlist);



    let rows=getAssemblyTextArea();
    setMachinecodeTextArea(rows);
}

function decideInstruction(row){


    // switch(instrction){

    //     case "ADI"


    // }



}