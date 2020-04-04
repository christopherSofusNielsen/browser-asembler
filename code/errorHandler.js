


let errorHandler={
    errorlist:[],

    clearErrorList(){
        this.errorlist=[];
    },

    addError(error){
       
        switch(error.type){

            case 'I':
                this.errorlist.push({
                    msg:`INFO:   Line ${error.linenumber}, ${error.msg}`,
                    type:'I'
                })
                return false;
                
            case 'W':
                this.errorlist.push({
                    msg:`WARNING:   Line ${error.linenumber}, ${error.msg}`,
                    type:'W'
                })
                return false;
              

            case 'E':
                this.errorlist.push({
                    msg:`ERROR:   Line ${error.linenumber}, ${error.msg}`,
                    type:'E'
                })
                return true;
               
            default:
                console.log(error);
                alert("System error, see console");
                return true;

        }

    }
}