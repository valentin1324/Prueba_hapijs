const userController = require('../controllers/userController');

module.exports = [
  // Redirige al usuario desde la raíz del sitio
  { 
    method: 'GET', 
    path: '/', 
    handler: (request, h) => h.redirect('/users')  // Redirige a /users en lugar de 'que '
  },
  // Muestra la lista de todos los usuarios
  { 
    method: 'GET', 
    path: '/users', 
    handler: userController.listUsers 
  },
  // Muestra el formulario para crear un nuevo usuario
  { 
    method: 'GET', 
    path: '/users/new', 
    handler: userController.newUserForm 
  },
  // Recibe los datos del formulario para crear un nuevo usuario
  { 
    method: 'POST', 
    path: '/users', 
    handler: userController.createUser 
  },
  // Muestra el formulario para editar un usuario existente
  { 
    method: 'GET', 
    path: '/users/{id}/edit', 
    handler: userController.editUserForm 
  },
  // Procesa la actualización de un usuario
  { 
    method: 'POST', 
    path: '/users/{id}', 
    handler: userController.updateUser 
  },
  // Elimina un usuario existente
  { 
    method: 'GET', 
    path: '/users/{id}/delete', 
    handler: userController.deleteUser 
  },
];
