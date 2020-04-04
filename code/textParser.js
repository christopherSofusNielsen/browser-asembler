// let textParser={
//     data:"DATA",

//     send(msg){
//         alert(this.data);
//     },

// }

let textParser={
    
    getBaseObject(linenumber){
        return{
            mnemonic:"",
            operands:[],
            linenumber
        }
    },

    parseInstruction(instruction){
        let pi=this.getBaseObject(instruction.linenumber);

        // get mnemonic
        pi.mnemonic=this.getMnemonic(instruction.instruction, instruction.linenumber)

        //get operands
        pi.operands=this.getOperands(instruction.instruction, instruction.linenumber)

        return pi;
    },

    getMnemonic(instruction, linenumber){
        let spaceIndex=instruction.indexOf(' ');
        if(spaceIndex<0){
            throw {type: 'E', msg:`You must have one instruction and at least one operand: ${inst}`, linenumber}
        }

        return instruction.substring(0, spaceIndex);
    },

    getOperands(instruction, linenumber){
        //remove mnemonic
        let spaceIndex=instruction.indexOf(' ');
        let opsStr=instruction.substring(spaceIndex, instruction.length);

        //Convert to operands to array
        opsStr=opsStr.replace(/ /g,'');

        ops=opsStr.split(',');

        return ops
    },
}


let textScan={
    

    scanRows(rows){
    
        let cleanAss=[];

        
        rows.forEach((row, linenumber) => {
            let str="";
            //Remove comment
            str=this.removeComment(row);

            //remove spaces in the beginning and end
            str=str.trim();

            //if no length, then no data
            if(str.length===0)
                return

            //make sure there are no doubble spaces
            str=str.replace(/\s{2,}/g, ' ');

            cleanAss.push({
                instruction:str,
                linenumber:linenumber+1
            })
            
        });

        return cleanAss;
    },

    removeComment(row){
        let _row=row.split(';');
        return _row[0];
    },

    


}