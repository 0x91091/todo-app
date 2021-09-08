// getting all required elements
const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");

// Global Variable
let listArray, userEnteredValue
// onkeyup event
inputBox.onkeyup = (e) => {
  let userEnteredValue = inputBox.value; //getting user entered value
  if (userEnteredValue.trim() != 0) { //if the user value isn't only spaces
    addBtn.classList.add("active"); //active the add button
  } else {
    addBtn.classList.remove("active"); //unactive the add button
  }
  if (e.keyCode == 13 && userEnteredValue.trim() != 0) {
    addBtn.classList.remove("active");
    userEnteredValue = inputBox.value
    addTask()
    inputBox.value = ''
  }
}


showTasks(); //calling showTask function


addBtn.onclick = () => {
  addTask()
} //when user click on plus icon button

function addTask() {
  // NProgress.start()
  let user = localStorage.getItem('User')

  userEnteredValue = inputBox.value //getting input field value

  if (user) {
    fetch('/create', {
      method: 'POST',
      body: JSON.stringify({
        task: userEnteredValue,
        user: user
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => r.json()).then(res => {
      showTasks(); //calling showTask function
      addBtn.classList.remove("active"); //unactive the add button once the task added
      showAlert(res.message)
      // NProgress.done()
    })
  } else {
    fetch('/create', {
      method: 'POST',
      body: JSON.stringify({
        task: userEnteredValue
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => r.json()).then(res => {
      localStorage.setItem('User', res.user)
      showTasks(); //calling showTask function
      addBtn.classList.remove("active"); //unactive the add button once the task added
      showAlert(res.message)
      // NProgress.done()
    })
  }

  inputBox.value = ''
  addBtn.classList.remove("active");
}


function showTasks() {
  // NProgress.start()
  const pendingTasksNumb = document.querySelector(".pendingTasks");
  let user = localStorage.getItem('User')
  if (user) {
    fetch('/get?id=' + user, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => r.json()).then(res => {
      if (res && res.record) {
        listArray = res.record
      } else {
        listArray = []
      }


      pendingTasksNumb.textContent = listArray.length; //passing the array length in pendingtask
      if (listArray.length > 0) { //if array length is greater than 0
        deleteAllBtn.classList.add("active"); //active the delete button
      } else {
        deleteAllBtn.classList.remove("active"); //unactive the delete button
      }
      let newLiTag = "";
      listArray.forEach((element, index) => {
        newLiTag += `<li><input data-id="${element._id}" data-value="${element.task}" name="todo" class"todo" disabled value="${element.task}"><span class="icon deleteButton"><i class="fas fa-trash"></i></span></li>`;
      });
      todoList.innerHTML = newLiTag; //adding new li tag inside ul tag
      inputBox.value = ""; //once task added leave the input field blank
      const todoLi = document.querySelectorAll(".todoList li");
      todoLi.forEach(e => {
        const todoInput = e.querySelector('input')
        e.onclick = () => {
          todoInput.removeAttribute('disabled')
          todoInput.focus()
        }
        const editTask = () => {
          if (!todoInput.value.trim() != 0) {
            showAlert('Input something')
            todoInput.focus()
          } else if (todoInput.getAttribute('data-value') == todoInput.value) {
            todoInput.setAttribute('disabled', null)
          } else {
            // NProgress.start()
            todoInput.setAttribute('disabled', null)

            fetch('/edit', {
              method: 'PUT',
              body: JSON.stringify({
                user: todoInput.getAttribute('data-id'),
                task: todoInput.value
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(r => r.json()).then(res => {
              // showAlert(res.message)
              showAlert(res.message)
              showTasks(); //call the showTasks function
              // NProgress.done()
            }).catch(err => {
              showAlert('something went wrong')
            })
          }
        }
        todoInput.onblur = () => {
          editTask()
        }

        todoInput.addEventListener('keyup', e => {
          if(e.keyCode == 13) {
            editTask()
          }
        })
        

        e.querySelector('.deleteButton').onclick = (e) => {
          // NProgress.start()
          e.stopPropagation()
          fetch('/delete', {
            method: 'DELETE',
            body: JSON.stringify({
              _id: todoInput.getAttribute('data-id')
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(r => r.json()).then(res => {
            // showAlert(res.message)
            showAlert(res.message)
            showTasks(); //call the showTasks function
            // NProgress.done()
          }).catch(err => {
            showAlert('something went wrong')
          })
        }

      })

      // NProgress.done()
    })
  } else {
    // NProgress.done()
    pendingTasksNumb.textContent = 0
  }
}
// delete task function
// delete all tasks function
deleteAllBtn.onclick = () => {
  // NProgress.start()
  let localStorageData = localStorage.getItem('User')
  if (localStorageData) {
    fetch('/delete-all', {
      method: 'DELETE',
      body: JSON.stringify({
        _id: localStorageData
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => r.json()).then(res => {
      // showAlert(res.message)
      showAlert(res.message)
      showTasks(); //call the showTasks function
      // NProgress.done()
    }).catch(err => {
      showAlert('something went wrong')
    })
  }

}

function showAlert(message, err) {
  const alertEl = document.querySelector('.showAlert')

  if (message) {
    alertEl.innerHTML = message

    alertEl.style.top = '30px'
    alertEl.style.opacity = '1'

    setTimeout(() => {
      alertEl.style.top = '0px'
      alertEl.style.opacity = '0'
    }, 1500)
  } else {
    alertEl.innerHTML = err

    alertEl.style.top = '30px'
    alertEl.style.opacity = '1'

    setTimeout(() => {
      alertEl.style.top = '0px'
      alertEl.style.opacity = '0'
    }, 1500)
  }
}