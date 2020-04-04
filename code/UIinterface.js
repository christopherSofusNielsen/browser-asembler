
function onload(){
    clearErrorListTextarea();
}

function getAssemblyTextArea() {
    let value=document.getElementById("assembly-code").value
    return value.split('\n');
}

function setMachinecodeTextArea(rows){

    document.getElementById("machine-code").value = rows.join('\n')
}

function clearMachinecodeTextArea(rows){

    document.getElementById("machine-code").value ='';
}

function compileEvent(e){
    if(e.ctrlKey && e.keyCode == 13)
        runAssembler();
}

function setErrorListTextarea(rows){

    let errors=[];

    rows.forEach(row => {
        errors.push(row.msg);
    });

    document.getElementById("error-box").value = errors.join('\n')
}

function clearErrorListTextarea(){
    document.getElementById("error-box").value="No errors";
}

function getDisplayMode(){
    let e=document.getElementById("display-modes");
    return e.options[e.selectedIndex].value;
}

/**
 * Scroll functions
 */


function setAssemblyScroll(pos){
    document.getElementById("assembly-code").scrollTop=pos;
}

function getAssemblyScroll(){
    return document.getElementById("assembly-code").scrollTop;
}

function setMachinecodeScroll(pos){
    document.getElementById("machine-code").scrollTop=pos;
}
