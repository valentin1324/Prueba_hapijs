const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Verificar si el modelo ya está definido
const UserSchema = mongoose.models.User || new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  rut: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  scope: { type: String, required: true }, // Campo adicional
  status: { type: String, required: true }, // Campo adicional
});

// Virtual para obtener el ID como string
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', { virtuals: true });

// Middleware: cifrar la contraseña antes de guardar
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Exportar el modelo
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
