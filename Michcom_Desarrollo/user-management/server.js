  require('dotenv').config();
  const Hapi = require('@hapi/hapi');
  const mongoose = require('mongoose');
  const path = require('path');

  const Handlebars = require('handlebars'); // Aquí usas Handlebars correctamente

  const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
  const routes = require('./routes/userRoutes');

  // Registrar el helper 'helperMissing' globalmente
  Handlebars.registerHelper('helperMissing', function () {
    if (arguments.length === 1) {
      return undefined;
    } else {
      throw new Error('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });

  const init = async () => {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/miBaseDeDatos';
    try {
      await mongoose.connect(mongoUri);
      console.log('✅ Conectado a MongoDB');
    } catch (err) {
      console.error('❌ Error al conectar a MongoDB:', err.message);
      process.exit(1); // Finaliza la aplicación si no puede conectar a MongoDB
    }

    try {
      // Configurar servidor Hapi.js
      const server = Hapi.server({
        port: process.env.PORT || 3001,
        host: process.env.HOST || 'localhost',
        routes: {
          files: { relativeTo: path.join(__dirname, 'public') },
        },
      });

      // Registrar Hapi Vision para plantillas
      await server.register(require('@hapi/vision'));

      // Configuración del motor de plantillas
      server.views({
        engines: {
          hbs: allowInsecurePrototypeAccess(Handlebars), // Usar Handlebars correctamente
        },
        path: path.join(__dirname, 'views'),
        layoutPath: path.join(__dirname, 'views/layouts'),
        layout: 'default',
      });

      // Registrar rutas
      server.route(routes);
      console.log('✅ Rutas registradas correctamente');

      // Iniciar servidor
      await server.start();
      console.log(`🚀 Servidor corriendo en ${server.info.uri}`);
    } catch (err) {
      console.error('❌ Error al iniciar el servidor:', err.message);
      process.exit(1); // Finaliza la aplicación si no puede iniciar el servidor
    }
  };

  Handlebars.registerHelper('block', function(name, options) {
    // Retorna el contenido del bloque
    if (!this._blocks) {
      this._blocks = {};
    }
    this._blocks[name] = options.fn(this);
    return '';
  });

  Handlebars.registerHelper('contentFor', function(name) {
    // Retorna el contenido del bloque cuando se solicita
    if (this._blocks && this._blocks[name]) {
      return this._blocks[name];
    }
    return '';
  });


  // Inicializar aplicación
  init().catch((err) => {
    console.error('❌ Error inesperado al inicializar la aplicación:', err.message);
    process.exit(1); // Finaliza la aplicación ante errores imprevistos
  });
