
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


formData.addEventListener('submit', (event) => {
    event.preventDefault();
    addToList();
})

function addToList() {
    const title = inputElement.value.trim();
    if(!title) {
        inputElement.focus();
        return;
    }

    const task = {
        id: crypto.randomUUID(),
        title: title,
        category: selectCategories.value,
        priority: selectPriorities.value,
        isComplete: false,
        createdAt: Date.now()
    }

    dataArray.push(task);
    saveToLocalStorage();
    inputElement.value = '';
    renderTaskItems();
}


function editList(id) {
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
    const cancelBtn = document.getElementById('cancelBtn');

    const task = dataArray.find(task => task.id === id);

    inputElement.value = task.title;
    selectCategories.value = task.category;
    selectPriorities.value = task.priority;

    function closePopup() {
        popupSection.classList.remove('is-popup');
        inputElement.value = '';
        document.removeEventListener('keydown', handleEscape);
    }

    function handleEscape(e) {
    if (e.key === 'Escape') {
        closePopup();
    }
}

    popupFormData.addEventListener('submit', (event) => {
        event.preventDefault();

        task.title = inputElement.value;
        task.category = selectCategories.value;
        task.priority = selectPriorities.value;

        saveToLocalStorage();
        closePopup();
        renderTaskItems();
    })



    cancelBtn.addEventListener('click', () => {
        closePopup();
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    })

    popupSection.addEventListener('click', (e) => {
        if (e.target === popupSection) {
            closePopup();
        }
    });

    document.addEventListener('keydown', handleEscape);

}


function getVisibleTasks() {
    const filteredTasks = dataArray.filter((task) => {
        if (currentFilter === 'active') {
            return task.isComplete !== true;
        }
        if (currentFilter === 'completed') {
            return task.isComplete === true;
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
            return priorityRank[b.priority] - priorityRank[a.priority];
        }
        return 0;
    })

    return sortedTasks;
}


function renderTaskItems () {

    const sortedTasks = getVisibleTasks();

    const taskItemHtml = sortedTasks.map((task) => {
        const completedTask = task.isComplete === true ? 'isChecked' : '';
        const isAttributeChecked = task.isComplete === true ? 'checked' : '';
        
        return `
            <div class="task-item js-task-item ${completedTask}" data-id = "${task.id}">
                <div class="task-left">
                    <input type="checkbox" name="checkbox" class="js-checkbox" ${isAttributeChecked}>
                    <label for="" class="task-title js-task-title">${task.title}</label>
                </div>
                <div class="task-badges">
                    <span>${task.category}</span>
                    <span>${task.priority}</span>
                </div>
                <div class="task-actions">
                    <button class="js-edit-button">Edit</button>
                    <button class="js-delete-btn" aria-label="Delete task">&times;</button>
                </div>
            </div>
        `
    }).join('');

    
    document.querySelector('.js-task-list').innerHTML = taskItemHtml;
    updateStats();
}


const taskList= document.querySelector('.js-task-list');

taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.js-task-item');
    if (!taskItem) return;

    const id = taskItem.dataset.id; 

    if (e.target.matches('.js-delete-btn')) {
        dataArray = dataArray.filter(task => task.id !== id);
        saveToLocalStorage();
        renderTaskItems();
        return;
    }

    if (e.target.matches('.js-edit-button')) {
        editList(id);
        return;
    }


    if (e.target.matches('.js-checkbox')) {
        const task = dataArray.find(task => task.id === id);

        task.isComplete = e.target.checked;
        taskItem.classList.toggle('isChecked', e.target.checked);

        saveToLocalStorage();
        updateStats();

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
        if (task.isComplete === true) {
            count++;
        }
    })

    return count;
}

function calculateProgress () {
    const total = totalTasks();
    if (total === 0) return 0;
    
    return Math.round((completedTasks() / total) * 100);;
}


function updateStats() {
    document.querySelector('.js-total-tasks').textContent = totalTasks();
    document.querySelector('.js-completed-tasks').textContent = completedTasks();
    document.querySelector('.js-progress').textContent = `${calculateProgress()}%`;
}
