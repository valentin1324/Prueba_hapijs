const User = require('../models/user'); // Modelo User con Mongoose
const bcrypt = require('bcryptjs');

// Función para listar todos los usuarios
exports.listUsers = async (request, h) => {
  try {
    const users = await User.find(); // Obtener todos los usuarios de la base de datos
    return h.view('./users/index', { users }); // Renderiza la plantilla con los usuarios
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return h.response('Error al obtener los usuarios').code(401); // Manejo de errores con código 401
  }
};

// Mostrar formulario para crear un nuevo usuario
exports.newUserForm = (request, h) => {
  return h.view('users/new', { title: 'Crear Usuario' }); // Renderiza la vista del formulario
};

// Crear un nuevo usuario
exports.createUser = async (request, h) => {
  const { name, lastname, rut, email, password } = request.payload; // Obtener datos del formulario

  // Validar que todos los campos sean proporcionados
  if (!name || !lastname || !rut || !email || !password) {
    return h.view('users/new', {
      error: 'Todos los campos son obligatorios.',
      title: 'Crear Usuario',
    }).code(402); // Retornar error si falta algún campo con código 402
  }

  try {
    // Verificar si el correo electrónico o RUT ya existe
    const existingUser = await User.findOne({ $or: [{ email }, { rut }] });
    if (existingUser) {
      return h.view('users/new', {
        error: 'El correo electrónico o RUT ya están en uso.',
        title: 'Crear Usuario',
      }).code(403); // Si ya existe el usuario, retornar con código 403
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const user = new User({ name, lastname, rut, email, password: hashedPassword });
    await user.save();

    return h.redirect('/users'); // Redirigir a la lista de usuarios
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    return h.view('users/new', {
      error: 'Error al crear el usuario.',
      title: 'Crear Usuario',
    }).code(402); // Manejo de errores con código 402
  }
};

// Mostrar formulario para editar un usuario existente
exports.editUserForm = async (request, h) => {
  try {
    const user = await User.findById(request.params.id); // Buscar al usuario por ID

    if (!user) {
      return h.response('Usuario no encontrado.').code(403); // Usuario no encontrado, código 403
    }

    return h.view('users/edit', { user, title: 'Editar Usuario' }); // Renderizar el formulario con los datos del usuario
  } catch (error) {
    console.error('Error al cargar el formulario de edición:', error);
    return h.response('Error al cargar el formulario de edición.').code(401); // Manejo de errores con código 401
  }
};

// Actualizar un usuario existente
exports.updateUser = async (request, h) => {
  const { name, lastname, rut, email, password } = request.payload;
  const updatedData = { name, lastname, rut, email };

  // Si se proporciona una nueva contraseña, encriptarla
  if (password) {
    updatedData.password = await bcrypt.hash(password, 10);
  }

  try {
    // Actualizar el usuario con los nuevos datos
    const user = await User.findByIdAndUpdate(request.params.id, updatedData, { new: true });

    if (!user) {
      return h.response('Usuario no encontrado.').code(403); // Usuario no encontrado, código 403
    }

    return h.redirect('/users'); // Redirigir a la lista de usuarios
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return h.view('users/edit', {
      error: 'Error al actualizar el usuario.',
      user: request.payload, // Mantener los datos del formulario
      title: 'Editar Usuario',
    }).code(402); // Manejo de errores con código 402
  }
};

// Eliminar un usuario
exports.deleteUser = async (request, h) => {
  try {
    const user = await User.findByIdAndDelete(request.params.id); // Eliminar el usuario por ID

    if (!user) {
      return h.response('Usuario no encontrado.').code(403); // Usuario no encontrado, código 403
    }

    return h.redirect('/users'); // Redirigir a la lista de usuarios
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return h.response('Error al eliminar el usuario.').code(401); // Manejo de errores con código 401
  }
};
