window.addEventListener('load', ()=>{
    todos = JSON.parse(localStorage.getItem('todos')) || []; //operador ternario - si existe lista de tareas la carga, sino genera un array vacio.
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form'); //elementos del DOM con los ID 'name' y 'new-todo-form' 
    
    const username = localStorage.getItem('username') || ''; //operador ternario - recupera el nombre de usuario y sino existe, asigna un string vacio.

    nameInput.value = username; // asigna el valor recogido en el input al la vble username

    nameInput.addEventListener('change', e =>{
        localStorage.setItem('username', e.target.value); //disparador, actualiza el valor del nombre de usuario en el LocalStorage
    })

    newTodoForm.addEventListener('submit', e => {  //evita que se recargue la página de forma que se pueden almacenar los datos en localstorage
		e.preventDefault();

		const todo = { // crea un objeto para agregar los elementos de la todo list
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime()
		}

		todos.push(todo); // agrega al array

		localStorage.setItem('todos', JSON.stringify(todos)); // guarda la lista actualizada convertida en cadena de texto (JSON.stringify)

		e.target.reset(); //resetea el formulario

		DisplayTodos();

	})	
}) 
	function DisplayTodos (){  // maneja el dom para crear los elementos  del array todolist (añade al contenedor)
		const todolist = document.querySelector('#todo-list');

		todolist.innerHTML = ''; //vacia el string

		todos.sort((a, b) => a.createdAt - b.createdAt).forEach(todo =>{ // itera sobre el array todos // nos aseguramos que independientemente del navegador los elementos se ordenen cronológicamente.g
			const todoItem = document.createElement('div'); //crea un div donde añade los elementos que permiten manejar cada tarea del todolist
			todoItem.classList.add('todo-item')

			const label = document.createElement('label');
			const input = document.createElement('input');
			const span = document.createElement('span');
			const content = document.createElement('div');
			const actions = document.createElement('div');
			const edit = document.createElement('button');
			const deleteButton = document.createElement('button');

			input.type = 'checkbox'; //input checbox business/personal
			input.checked = todo.done;
			span.classList.add('bubble'); //clase bubble

			if (todo.category == 'personal'){ //comprueba la categoría y añade la clase correspondiente
				span.classList.add('personal');
			}
			else{
				span.classList.add('business');
			}

			content.classList.add('todo-content'); // añade las clases a los elementos html
			actions.classList.add('actions');
			edit.classList.add('edit');
			deleteButton.classList.add('delete');

			content.innerHTML = `<input type="text" value="${todo.content}" readonly>`; //contenido elementos html
			edit.innerHTML = 'Edit';
			deleteButton.innerHTML = 'Delete'; 

			label.appendChild(input); //construye los elementos
			label.appendChild(span);
			actions.appendChild(edit);
			actions.appendChild(deleteButton);
			todoItem.appendChild(label);
			todoItem.appendChild(content);
			todoItem.appendChild(actions);

			todolist.appendChild(todoItem); // añade la tarea al contenedor de todo list

			if (todo.done) {
				todoItem.classList.add('done');
			}
			
			input.addEventListener('change', (e) => { //disparador en el evento "change"
				todo.done = e.target.checked; // actualiza la propiedad done de la tarea, si es checked establece todo.done como true sino como false
				localStorage.setItem('todos', JSON.stringify(todos)); // actualiza la nueva lista de tareas
	
				if (todo.done) { //verificia el estado añadiendo el estilo pertinente
					todoItem.classList.add('done');
				} else {
					todoItem.classList.remove('done');
				}
	
				DisplayTodos(); //llama al display para mostrar la lista de tareas actualizada
	
			})

			edit.addEventListener('click', (e) => { //disparador evento "click"
				const input = content.querySelector('input'); //accdemos campo de texto - tarea
				input.removeAttribute('readonly'); //permite que el campo sea editable eliminando la característica readonly
				input.focus(); // podemos editar el contenido
				input.addEventListener('blur', (e) => { // disparador cuando pierde el foco - usuario deja de editar y hace click fuera del campo
					input.setAttribute('readonly', true); // devolvemos el atributo readonly
					todo.content = e.target.value; // actualiza la propiedad content (editada por el usuario)
					localStorage.setItem('todos', JSON.stringify(todos)); //actualiza la lista de tareas en localstorage
					DisplayTodos() // llama de nuevo al display
	
				})
			})
	
			deleteButton.addEventListener('click', (e) => { // disparador evento "click"
				todos = todos.filter(t => t != todo); // crea una nueva lista de tareas filtrando todas salvo la actual
				localStorage.setItem('todos', JSON.stringify(todos)); // actualiza en localstorage
				DisplayTodos() // llama al display
			})
	
		})
	}