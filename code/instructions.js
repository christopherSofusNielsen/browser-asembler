let instructions={
    words:[],

    clearWords(){
        this.words=[]
    },

    addWord(word){
        this.words.push(word);
    },

    convertInstructionToWord(parsedInst){
        const {mnemonic, operands, linenumber}=parsedInst;

        let word="";

        //parse based on mnemonic
        switch(mnemonic){
            //2 operands, source A
            case 'MOVA':
            case 'INC':
            case 'DEC':
            case 'NOT':
                word=this.twoOpsSourceA(mnemonic, operands, linenumber)
                break;

            //2 operands, source B
            case 'MOVB':
            case 'SHR':
            case 'SHL':
                word=this.twoOpsSourceB(mnemonic, operands, linenumber)
                break;

            //3 operands
            case 'ADD':
            case 'SUB':
            case 'AND':
            case 'OR':
            case 'XOR':
                word=this.threeOps(mnemonic, operands, linenumber)
                break;

            //immediate
            case 'LDI':
                word=this.immediateLoad(mnemonic, operands, linenumber)
                break;
            case 'ADI':
                word=this.immediateAdd(mnemonic, operands, linenumber)
                break;

            //memory
            case 'LD':
                word=this.memoryLoad(mnemonic, operands, linenumber)
                break;
            case 'ST':
                word=this.memoryStore(mnemonic, operands, linenumber)
                break;

            //branch and jump
            case 'BRZ':
            case 'BRN':
                word=this.branchs(mnemonic, operands, linenumber)
                break;

            //jump
            case 'JMP':
                word=this.jump(mnemonic, operands, linenumber)
                break;

            default:
                throw {type: 'E', msg:`Unknown instruction: ${mnemonic}`, linenumber}
        }
        return {word, linenumber};
    },

    checkOperands(operands, number, linenumber){
        let n=operands.length;

        if(n>number){
            throw {type: 'E', msg:`Too many operands, expect ${number}`, linenumber}
        }
        if(n<number){
            throw {type: 'E', msg:`Too few operands, expect ${number}`, linenumber}
        }
    },

    getOpcode(mnemonic){
        let isa=getISA();
        let index=isa.asemcode.indexOf(mnemonic);
        return isa.machcode[index];
    },

    getBinaryReg(reg, linenumber){
        let isa=getISA();
        let index=isa.reg.indexOf(reg);
        if(index===-1)
            throw {type: 'E', msg:`Unknoen register reference: ${reg}`, linenumber}

        return isa.regcode[index];
    },

    getImmediate(immediate, minValue, maxValue, linenumber){
        let val=parseInt(immediate);

        if(isNaN(val)){
            throw {type: 'E', msg:`Immediate must be an integer`, linenumber}
        }
        if(val<minValue){
            throw {type: 'E', msg:`Immediate must bigger than or equal to ${minValue}`, linenumber}
        }
        if(val>maxValue){
            throw {type: 'E', msg:`Immediate must smaller than or equal to ${maxValue}`, linenumber}
        }

        let binary=val.toString(2);

        if(binary.length===1){
            binary="00"+binary;
        }else if(binary.length===2){
            binary="0"+binary;
        }

        return binary;
    },

    twoOpsSourceA(mnemonic, operands, linenumber){
        //check operands
        this.checkOperands(operands, 2, linenumber);

        //get opcode
        let opcode=this.getOpcode(mnemonic);

        //operands to binary
        let op0=this.getBinaryReg(operands[0], linenumber);
        let op1=this.getBinaryReg(operands[1], linenumber);
        
        return `${opcode}${op0}${op1}000`;
    },

    twoOpsSourceB(mnemonic, operands, linenumber){
        //check operands
        this.checkOperands(operands, 2, linenumber);

        //get opcode
        let opcode=this.getOpcode(mnemonic);

        //operands to binary
        let op0=this.getBinaryReg(operands[0], linenumber);
        let op1=this.getBinaryReg(operands[1], linenumber);
        

        return `${opcode}${op0}000${op1}`;
    },

    threeOps(mnemonic, operands, linenumber){
        //check operands
        this.checkOperands(operands, 3, linenumber);

        //get opcode
        let opcode=this.getOpcode(mnemonic);

        //operands to binary
        let op0=this.getBinaryReg(operands[0], linenumber);
        let op1=this.getBinaryReg(operands[1], linenumber);
        let op2=this.getBinaryReg(operands[1], linenumber);
        

        return `${opcode}${op0}${op1}${op2}`;

    },

    immediateLoad(mnemonic, operands, linenumber){
        //check operands
        this.checkOperands(operands, 2, linenumber);

        //get opcode
        let opcode=this.getOpcode(mnemonic);

        //operands to binary
        let op0=this.getBinaryReg(operands[0], linenumber);
        let immediate=this.getImmediate(operands[1], 0, 7, linenumber);
    
        return `${opcode}${op0}000${immediate}`;
    },

    immediateAdd(mnemonic, operands, linenumber){
         //check operands
         this.checkOperands(operands, 3, linenumber);

         //get opcode
         let opcode=this.getOpcode(mnemonic);
 
         //operands to binary
         let op0=this.getBinaryReg(operands[0], linenumber);
         let op1=this.getBinaryReg(operands[1], linenumber);
         let immediate=this.getImmediate(operands[2], 0, 7, linenumber);
     
         return `${opcode}${op0}${op1}${immediate}`;
    },

    memoryLoad(mnemonic, operands, linenumber){
        //check operands
        this.checkOperands(operands, 2, linenumber);

        //get opcode
        let opcode=this.getOpcode(mnemonic);

        //operands to binary
        let op0=this.getBinaryReg(operands[0], linenumber);
        let op1=this.getBinaryReg(operands[1], linenumber);
    
        return `${opcode}${op0}${op1}000`;
    },

    memoryStore(mnemonic, operands, linenumber){
        //check operands
        this.checkOperands(operands, 2, linenumber);

        //get opcode
        let opcode=this.getOpcode(mnemonic);

        //operands to binary
        let op0=this.getBinaryReg(operands[0], linenumber);
        let op1=this.getBinaryReg(operands[1], linenumber);
    
        return `${opcode}000${op0}${op1}`;
    },

    branchs(mnemonic, operands, linenumber){

    },

    jump(mnemonic, operands, linenumber){
        //check operands
        this.checkOperands(operands, 1, linenumber);

        //get opcode
        let opcode=this.getOpcode(mnemonic);

        //operands to binary
        let op0=this.getBinaryReg(operands[0], linenumber);
    
        return `${opcode}000${op0}000`;
    },



}