document.getElementById("myForm").addEventListener("submit", validationForm);

function bishBosh(bish, bosh, loops) {
    

    let mainString = ""
    for ( i = 1; i <= loops; i++){
        let BishBoshString="";
    
        if (i % bish == 0)
        {
            BishBoshString += "Bish";
        }
        if(i % bosh == 0)
        {
            BishBoshString += "Bosh";
        }
    
        if (BishBoshString =="")
        {
            mainString += i;
        }
        else
        {
            mainString += BishBoshString;
        }

        if(i != loops){
            mainString += ", ";
        }
    }
     
    return mainString;
}

function validationForm(e){
    e.preventDefault();
    let validation = true;
    let elements= e.target.elements
    for(element of elements){
        if(element.value>0){
            element.classList.add("is-valid");
        }else{
            if(element.type != "submit"){
                validation= false;
                element.classList.add("is-invalid");
            }
        }
    };

    if (validation){
        let string = bishBosh(elements.bish.value, elements.bosh.value, elements.lastNumber.value);
        let result = document.getElementById("result");
        result.innerHTML = string;
    }else{
        let result = document.getElementById("result");
        result.innerHTML = "";
    }
}
