
let displayState={
    displayMode:'binary'
}


let onAssemblyScroll=(e)=>{
    if(displayState.displayMode==='debug')
        setMachinecodeScroll(e.currentTarget.scrollTop);
}

let onDisplayModeChange=(e)=>{
    console.log(e);
    let index=e.target.options.selectedIndex;
    displayState.displayMode=e.target.options[index.toString()].value
    setDisplayOutputs();
}

let setDisplayOutputs=()=>{
    let displayWords=[];
    //check that words are ready
    if(instructions.words.length===0)
        return


    //convert words to correct display mode
    switch(displayState.displayMode){
        case "binary":
            displayWords=display.displayBinary(instructions.words);
            break;

        case "debug":
            displayWords=display.displayDebug(instructions.words);
            break;

        case "hex":
            displayWords=display.displayHex(instructions.words);
            break;
    }

    //display it
    setMachinecodeTextArea(displayWords);

    if(displayState.displayMode==="debug"){
        setMachinecodeScroll(getAssemblyScroll());
    }
        
}   

let loadExample=()=>{
    
    setAssemblyTextArea(example);
}


let display={

    displayBinary(words){
        return words.map(w=>{
            return w.word
        })
    },

    displayDebug(words){
        //get last line number
        let lns=display.getTotalLines();
    
        //create array of empty lines
        let displayArray=display.createArrayWithEmptyLines(lns);
    
        //go through words and replace lines
        words.forEach(w => {
            displayArray[w.linenumber-1]=display.addTabs(w.word);
        });
    
        return displayArray;
    },

    displayHex(words){
        // adr 0 to right, and 16 in one row

        let row='';
        let rows=[];

        for(let i=1; i<=words.length; i++){
            
            let hex=this.wordToHex(words[i-1].word);
            row=hex+row;

            if(i%16===0){
                rows.push(row);
                row=''
            }
        }

        row=this.zeroFillRow(row);
        rows.push(row);
        return rows;
    },

    wordToHex(word){
        let hex=parseInt(word, 2).toString(16).toUpperCase();
        switch(hex.length){
            case 1:
                hex="000"+hex;
                break;
            case 2:
                hex="00"+hex;
                break;
            case 3:
                hex="0"+hex;
                break;
        }
        return hex
    },

    zeroFillRow(row){
        while(row.length<64){
            row='0'+row;
        }
        return row;
    },

    getTotalLines(){
        return getAssemblyTextArea().length
    },

    createArrayWithEmptyLines(indexes){
        let arr=[];

        for(let i=0; i<indexes; i++){
            arr.push(' ');
        }

        return arr;
    },

    addTabs(word){
        let opcode=word.slice(0, 7);
        let r1=word.slice(7, 10);
        let r2=word.slice(10, 13);
        let r3=word.slice(13, 16);

        return `${opcode}\t\t${r1}\t${r2}\t${r3}`

    }
}