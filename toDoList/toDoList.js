
/* let itemslist; */
let allLists= [];

function setUp(){
   createLists();
}

class List {
    items = [];
    listId;
    static count = 1;
    dragStarted=false;
    
    constructor(){
        this.listId = List.count;
        List.count++;
        this.dragStart = this.dragStart.bind(this);
        this.crossItemOut = this.crossItemOut.bind(this);
    };
        
    create = ()=>{
        // Outer container
        const outerDiv = document.createElement('div');
        outerDiv.className = `col-12 col-md-6 border p-3 mt-5 list${this.listId}`;
        outerDiv.id = `list${this.listId}`;

        // Title div
        const tittleDiv = document.createElement('div');
        tittleDiv.className = 'col text-center';
        const tittle = document.createElement('h3');
        tittle.textContent = `List ${this.listId}`;
        tittleDiv.appendChild(tittle);
        outerDiv.appendChild(tittleDiv);

        // list div
        const listDiv = document.createElement('div');
        listDiv.className = 'col text-center pt-5 pb-5';
        listDiv.id = `listUI${this.listId}`;
        outerDiv.appendChild(listDiv);

        // Form container
        const formWrapper = document.createElement('div');
        formWrapper.className = 'col';

        const form = document.createElement('form');
        form.id = `myForm${this.listId}`;
        form.setAttribute('novalidate', '');

        const formGroup = document.createElement('div');
        formGroup.className = 'form-floating mb-3';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.id = `newItem${this.listId}`;
        input.setAttribute('aria-describedby', 'emailHelp');
        input.placeholder = '';
        input.required = true;

        const label = document.createElement('label');
        label.setAttribute('for', `newItem${this.listId}`);
        label.className = 'form-label';
        label.innerText = 'New Item';

        formGroup.appendChild(input);
        formGroup.appendChild(label);
        form.appendChild(formGroup);

        const button = document.createElement('button');
        button.type = 'submit';
        button.className = 'btn btn-primary';
        button.innerText = 'Add';

        form.appendChild(button);
        formWrapper.appendChild(form);
        outerDiv.appendChild(formWrapper);

        return outerDiv;
    };

    addItem = (item)=>{
        this.items.push({item: item.item || item,crossedOut:item.crossedOut || false});
        this.saveLocally();
        this.refresh();
    };

    load = ()=>{
        if (localStorage.getItem(`listUI${this.listId}`) !== null) {
            this.items = JSON.parse(localStorage.getItem(`listUI${this.listId}`));
            return true
          }
          return false
    };

    saveLocally= ()=>{
        if(this.items != null){
            localStorage.setItem(`listUI${this.listId}`, JSON.stringify(this.items));
            return true
        }
        return false
    };

    show= ()=>{
        if(this.items.length != 0){
            let itemsListUI=document.createElement('ul');
            itemsListUI.classList.add("list-group", "rounded-0","list-unstyled");
            itemsListUI.id=`shoppinglist${this.listId}`;
            this.items.forEach((item,index)=>{
                let listItemUI = document.createElement('li');
                listItemUI.classList.add(`shoppinglist${this.listId}Item`, "shoppinglistItem" , "p-2", "list-group-item", "d-flex", "justify-content-between", "align-items-start", "mt-3");
                if(item.crossedOut)listItemUI.classList.add("crossedOut");
                listItemUI.dataset.itemIndex = index;
                listItemUI.dataset.listIndex = this.listId;
                listItemUI.id=`list${this.listId}item${index}`;
                listItemUI.textContent = item.item;
                listItemUI.draggable= "true";
                let button = document.createElement("button");
                button.type = "button";
                button.ariaLabel = "Close";
                button.classList.add("btn-close", "listItemRemove");
                listItemUI.appendChild(button);
                itemsListUI.appendChild(listItemUI);
            })
            document.getElementById(`listUI${this.listId}`).textContent ="";
            document.getElementById(`listUI${this.listId}`).appendChild(itemsListUI);
        }else{
            document.getElementById(`listUI${this.listId}`).textContent ="";
            let itemsListUI=document.createElement('ul');
            itemsListUI.classList.add("list-group", "rounded-0","list-unstyled");
            itemsListUI.id=`shoppinglist${this.listId}`;
            itemsListUI.textContent = ":( There are no items on the list.";
            document.getElementById(`listUI${this.listId}`).appendChild(itemsListUI);
        }   
    };

    crossItemOut= (e)=>{
        console.log(e.target);
        if(this.dragStarted == true){
            this.dragStarted = false;
            return;
        }
        
        let item = e.target;
        let targetIndex = item.dataset.itemIndex;
        this.items[targetIndex].crossedOut = !this.items[targetIndex].crossedOut;
        this.saveLocally();
        this.refresh();
    };

    loadItemsListeners= ()=>{
        // Add event listeners to each list item
        let listItems = document.getElementsByClassName(`shoppinglist${this.listId}Item`);
        if(listItems.length>=1){
            Array.from(listItems).forEach((item)=>{
                item.removeEventListener("click", this.crossItemOut);

                item.removeEventListener("dragstart", this.dragStart);
                /* item.removeEventListener("touchstart", this.dragStart);
 */
                /* item.removeEventListener("dragover", this.dragOver); */
                /* item.removeEventListener("touchmove", this.dragOver); */

                item.addEventListener("click", this.crossItemOut);

                item.addEventListener("dragstart", this.dragStart);
                /* item.addEventListener("touchstart", this.dragStart); */

                /* item.addEventListener("dragover", this.dragOver); */
                /* item.addEventListener("touchmove", this.dragOver); */
            });
        };

        //adds event listener to remove buttons
        let listItemsRemove = document.getElementsByClassName("listItemRemove");
        Array.from(listItemsRemove).forEach((item)=>{
            item.removeEventListener("click", this.removeItem.bind(item));
            item.addEventListener("click", this.removeItem.bind(item));
        });

        //Adds event listeners to the submit button
        let form = document.getElementById(`myForm${this.listId}`);
        form.removeEventListener("submit", this.validateForm);
        form.addEventListener("submit", this.validateForm);
        
        


        
        /* let listDisplay = document.getElementById(`shoppinglist${this.listId}`);
        
        if(listDisplay != null){
            listDisplay.removeEventListener("dragover", this.dragOver);
            listDisplay.removeEventListener("drop", this.dropItem.bind(this));
            listDisplay.removeEventListener("touchend", this.dropItem.bind(this));

            listDisplay.addEventListener("dragover", this.dragOver);
            listDisplay.addEventListener("drop", this.dropItem.bind(this));
            listDisplay.addEventListener("touchend", this.dropItem.bind(this));
        } */
    };

    LoadListListeners(){
        // Adds event listeners to the list for drag and drop
        let listDisplay = document.getElementById(`list${this.listId}`);
        
        if(listDisplay != null){
            listDisplay.removeEventListener("dragover", this.dragOver);
            listDisplay.removeEventListener("drop", this.dropItem.bind(this));
            /* listDisplay.removeEventListener("touchend", this.dropItem.bind(this)); */

            listDisplay.addEventListener("dragover", this.dragOver);
            listDisplay.addEventListener("drop", this.dropItem.bind(this));
            /* listDisplay.addEventListener("touchend", this.dropItem.bind(this)); */
        }
    }

    dropItem(e){
        console.log("drop");
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData("application/json"));
        const { item, fromListId, fromIndex } = data;
        console.log(data);
        // Add to this list
        this.addItem(item);

        // Remove from the source list
        const sourceList = allLists.find(l => l.listId == fromListId);
        if (sourceList) {
            sourceList.items.splice(fromIndex, 1);
            sourceList.saveLocally();
            sourceList.refresh();
        }

    };

    dragStart(e){
        if (!e.target.classList.contains(`shoppinglist${this.listId}Item`)) return;
        this.dragStarted = true;

        const itemIndex = e.target.dataset.itemIndex;
        const item = this.items[itemIndex];

        const data = {
            item,
            fromListId: this.listId,
            fromIndex: itemIndex
        };
        e.dataTransfer.setData("application/json", JSON.stringify(data));
    };

    dragOver(e){
        e.preventDefault();
    }

    removeItem= (item)=>{
        event.stopPropagation();
        let index = item.target.parentElement.dataset.itemIndex;
        this.items.splice(index,1);
        this.saveLocally();
        this.refresh();
    };

    refresh= ()=>{
        this.show();
        this.loadItemsListeners();
    };

    validateForm = (e)=>{
        e.preventDefault();
        let elements= e.target.elements;
        for(let element of elements){
            if(element.value!=""){
                element.classList.remove("is-invalid");
                this.addItem(element.value);
            }else{
                if(element.type != "submit"){
                    validation= false;
                    element.classList.add("is-invalid");
                }
            }
        };
        e.target.reset();
    }
}

setUp();

function createLists(){
    let listRow = document.getElementById("listsRow");

    allLists.push(new List(),new List());
    allLists.forEach((list)=>{
        listRow.append(list.create());
        list.load();
        list.show();
        list.loadItemsListeners();
        list.LoadListListeners()
    });
   
}