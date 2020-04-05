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
            case 'LRI':
                word=this.twoOpsSourceA(mnemonic, operands, linenumber)
                break;

            //2 operands, source B
            case 'MOVB':
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

            //Not used
            case 'SHR':
            case 'SHL':
                throw {type: 'E', msg:`SHR and SHL are not supported, use SRM and SLM`, linenumber}

            case 'SRM':
            case 'SLM':
                throw {type: 'E', msg:`SRM and SLM are not supported`, linenumber}

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

    getAddress(immediate, minValue, maxValue, linenumber){

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

        if(val===0){
            return{
                RD: "000",
                SB: "000"
            }
        }else if(val>0){
            let valBinary=val.toString(2);
            let valExtendedBinary=this.extendBinary(valBinary, '0', 6);
            return{
                RD: valExtendedBinary.slice(0,3),
                SB: valExtendedBinary.slice(3,6)
            }
        }else{
            val=-1*val-1;
            let valBinary=val.toString(2);
            valInverted=this.invertBinary(valBinary);
            let valExtendedBinary=this.extendBinary(valInverted, '1', 6);
            return{
                RD: valExtendedBinary.slice(0,3),
                SB: valExtendedBinary.slice(3,6)
            }
        }
    },

    extendBinary(val, sign, totalLength){
        let nExtend=totalLength-val.length;
        for(let i=0; i<nExtend; i++){
            val=sign+val;
        }
        return val;
    },

    invertBinary(val){
        val=val.replace(/0/g, 'N');
        val=val.replace(/1/g, '0');
        val=val.replace(/N/g, '1');
        return val;
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
        let op2=this.getBinaryReg(operands[2], linenumber);
        

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
        //check operands
        this.checkOperands(operands, 2, linenumber);

        //get opcode
        let opcode=this.getOpcode(mnemonic);

        //operands to binary
        let op0=this.getBinaryReg(operands[0], linenumber);
        let immediate=this.getAddress(operands[1], -32, 31, linenumber)
    
        return `${opcode}${immediate.RD}${op0}${immediate.SB}`;
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