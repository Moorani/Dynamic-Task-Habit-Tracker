
const dataArray = getFromLocalStorage() || [];

renderTaskItems();

document.querySelector('.js-total-tasks').innerHTML = `${totalTasks()}`;


const formData = document.querySelector('.js-form-data');
const inputElement = document.querySelector('.js-task-input');
const selectCategories = document.getElementById('categories');
const selectPriorities = document.getElementById('priorities');

formData.addEventListener('submit', (event) => {
    event.preventDefault();
    addToList();
})

function addToList() {

    const inputValue = inputElement.value;
    const categoryValue = selectCategories.value;
    const priorityValue = selectPriorities.value;

    dataArray.push({inputValue, categoryValue, priorityValue});
    saveToLocalStorage();
    inputElement.value = '';
    renderTaskItems();
}


function editList(index) {
    let editPopupHtml = ``;

    editPopupHtml = `
        <h3 id="popupTitle">Edit The Task</h3> 
        <form action="" class="form-data js-popup-form-data">
            <input type="text" name="task-title" class="task-input-title js-popup-task-input" placeholder="Task Title...">
            <select name="categories" id="popup-categories">
                <option value="personal">Personal</option>
                <option value="study">Study</option>
                <option value="routine">Routine</option>
            </select>   
            <select name="priorities" id="popup-priorities">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
            <button type="submit">Save</button>
        </form>
        <button type="button" id="cancelBtn">Cancel</button>
    `

    const popupSection = document.querySelector('.js-popup-section');
    popupSection.innerHTML = editPopupHtml;
    popupSection.classList.add('is-popup');
    
    const popupFormData = document.querySelector('.js-popup-form-data');
    const inputElement = document.querySelector('.js-popup-task-input');
    const selectCategories = document.getElementById('popup-categories');
    const selectPriorities = document.getElementById('popup-priorities');

    inputElement.value = dataArray[index].inputValue;
    selectCategories.value = dataArray[index].categoryValue;
    selectPriorities.value = dataArray[index].priorityValue;

    popupFormData.addEventListener('submit', (event) => {

        const inputValue = inputElement.value;
        const categoryValue = selectCategories.value;
        const priorityValue = selectPriorities.value;

        dataArray[index] = {inputValue, categoryValue, priorityValue};
        saveToLocalStorage();
        popupSection.classList.remove('is-popup');
        renderTaskItems();
    })



    cancelBtn.addEventListener('click', () => {
        popupSection.classList.remove('is-popup');
        inputElement.value = '';
    })


}



function renderTaskItems () {
    let taskItemHtml = ``;

    document.querySelector('.js-total-tasks').innerHTML = `${totalTasks()}`;

    dataArray.forEach((input, index) => {
        
        taskItemHtml += `
            <div class="task-item js-task-item" data-index="${index}">
                <div class="task-left">
                    <input type="checkbox" name="checkbox" class="js-checkbox">
                    <label for="" class="task-title js-task-title">${input.inputValue}</label>
                </div>
                <div class="task-badges">
                    <span>${input.categoryValue}</span>
                    <span>${input.priorityValue}</span>
                </div>
                <div class="task-actions">
                    <button class="js-edit-button">Edit</button>
                    <button class="js-delete-btn">&times;</button>
                </div>
            </div>
        `
    })
    
    document.querySelector('.js-task-list').innerHTML = taskItemHtml;
}


const taskList= document.querySelector('.js-task-list');
taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.js-task-item'); 
    const index = Number(taskItem.dataset.index); 

    if (e.target.matches('.js-delete-btn')) {
        dataArray.splice(index, 1);
        saveToLocalStorage();
        renderTaskItems();
    }

    if (e.target.matches('.js-edit-button')) {
        editList(index);
    }


    if (e.target.matches('.js-checkbox')) {
        const taskTitle = taskItem.querySelector('.js-task-title');
        taskTitle.style.textDecoration = "line-through";
        taskItem.classList.toggle("isChecked");
        
        setTimeout(() => {
            const freshIndex = Number(taskItem.dataset.index);

            dataArray.splice(freshIndex, 1);
            saveToLocalStorage();
            renderTaskItems();
        }, 3000);
    }
    
})
   

function saveToLocalStorage() {
    localStorage.setItem('dataArray', JSON.stringify(dataArray));
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem('dataArray'));
}

function totalTasks() {
    return dataArray.length;
}


// function completedTasks() {
//     let count;
// }
