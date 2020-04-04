function getAssemblyTextArea() {
    let value=document.getElementById("assembly-code").value
    return value.split('\n');
}

function setMachinecodeTextArea(rows){

    document.getElementById("machine-code").value = rows.join('\n')
}

function compileEvent(e){
    if(e.ctrlKey && e.keyCode == 13)
        runAssembler();
}

function setErrorListTextarea(rows){
    document.getElementById("error-box").value = rows.join('\n')
}

function clearErrorListTextarea(){
    document.getElementById("error-box").value="Error list";
}