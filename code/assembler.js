


function runAssembler(){
    let fatalError=false;

    //Clear old stuff
    errorHandler.clearErrorList();
    instructions.clearWords();
    clearMachinecodeTextArea();
    
    //Get assembly rows
    let rows=getAssemblyTextArea();


    //scan and remove on nessesary stuff like comments, spaces and empty lines
    let cleanAssembly=textScan.scanRows(rows);
    console.log(cleanAssembly);

    //Now convert each assembly to instructions codes
    for(let i=0; i<cleanAssembly.length; i++){

        if(fatalError)
            break;

        try {
            let parsedInstruction=textParser.parseInstruction(cleanAssembly[i]);
            let word=instructions.convertInstructionToWord(parsedInstruction);
            instructions.addWord(word);
        
        } catch (error) {
            if(errorHandler.addError(error))
                fatalError=true;
        }
    }

    //If fatal error has occured, then return
    if(fatalError){
        setErrorListTextarea(errorHandler.errorlist);
        return
    }else{
        clearErrorListTextarea();
        setDisplayOutputs();
    }
    
}



