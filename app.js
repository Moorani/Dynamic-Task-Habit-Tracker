
let dataArray = getFromLocalStorage() || [];

const priorityRank = {
  'high': 3,
  'medium': 2,
  'low': 1
};

let currentFilter = 'all';
let currentSort = 'oldest';

const formData = document.querySelector('.js-form-data');
const inputElement = document.querySelector('.js-task-input');
const selectCategories = document.getElementById('categories');
const selectPriorities = document.getElementById('priorities');

renderTaskItems();

document.querySelector('.js-total-tasks').innerHTML = `${totalTasks()}`;
document.querySelector('.js-completed-tasks').innerHTML = `${completedTasks()}`;
document.querySelector('.js-progress').innerHTML = `${calculateProgress()}%`;


formData.addEventListener('submit', (event) => {
    event.preventDefault();
    addToList();
})

function addToList() {

    const inputValue = inputElement.value;
    const categoryValue = selectCategories.value;
    const priorityValue = selectPriorities.value;

    dataArray.push({inputValue, categoryValue, priorityValue, 'is-complete': false, createdAt: Date.now()});
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


function getVisibleTasks() {
    const filteredTasks = dataArray.filter((task) => {
        if (currentFilter === 'active') {
            return task['is-complete'] !== true;
        }
        if (currentFilter === 'completed') {
            return task['is-complete'] === true;
        }

        return true;
    })

    const sortedTasks = filteredTasks.slice().sort((a, b) => {
        if (currentSort === 'oldest') {
            return a.createdAt - b.createdAt;
        }
        if (currentSort === 'newest') {
            return b.createdAt - a.createdAt;
        }
        if (currentSort === 'priority-high') {
            return priorityRank[b.priorityValue] - priorityRank[a.priorityValue];
        }
        return 0;
    })

    return sortedTasks;
}


function renderTaskItems () {
    let taskItemHtml = ``;

    document.querySelector('.js-total-tasks').innerHTML = `${totalTasks()}`;

    const sortedTasks = getVisibleTasks();

    sortedTasks.forEach((input, index) => {

        const completedTask = input['is-complete'] === true ? 'isChecked' : '';
        const isAttributeChecked = input['is-complete'] === true ? 'checked' : '';

        const textDecoration = input['is-complete'] === true ? 'line-through' : 'none';
 
        taskItemHtml += `
            <div class="task-item js-task-item ${completedTask}" data-index="${index}">
                <div class="task-left">
                    <input type="checkbox" name="checkbox" class="js-checkbox" ${isAttributeChecked}>
                    <label for="" class="task-title js-task-title" style="text-decoration: ${textDecoration}">${input.inputValue}</label>
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

        if (e.target.checked) {
            taskTitle.style.textDecoration = "line-through";
            taskItem.classList.add("isChecked");
            dataArray[index]['is-complete'] = true;
            saveToLocalStorage();
            document.querySelector('.js-completed-tasks').innerHTML = `${completedTasks()}`;
            document.querySelector('.js-progress').innerHTML = `${calculateProgress()}%`;
        }
        else {
            taskTitle.style.textDecoration = 'none';
            taskItem.classList.remove("isChecked");
            dataArray[index]['is-complete'] = false;
            saveToLocalStorage();
            document.querySelector('.js-completed-tasks').innerHTML = `${completedTasks()}`;
            document.querySelector('.js-progress').innerHTML = `${calculateProgress()}%`;
        }
    }
    
})


const  filterGroup = document.querySelector('.filter-group');
const filterBtns = document.querySelectorAll('.filter-btn');


filterGroup.addEventListener('click', (e) => {
   const btn = e.target.closest('.filter-btn');

   if (!btn) return;

   filterBtns.forEach((btn) => {
    btn.classList.remove('active');
   })

   btn.classList.add('active');

   currentFilter = btn.dataset.filter;
   
   renderTaskItems();
})

const sortGroup = document.querySelector('.sort-group');

sortGroup.addEventListener('change', (e) => {
    const sortBtn = e.target.closest('.js-sort-select');
    currentSort = sortBtn.value;
    renderTaskItems();
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

function completedTasks() {
    let count = 0;

    dataArray.forEach((task) => {
        if (task['is-complete'] === true) {
            count++;
        }
    })

    return count;
}

function calculateProgress () {
    const total = totalTasks();
    const completed = completedTasks();

    const progress = ((completed/total)*100).toFixed(0);
    return progress;
}
