# PsychoShare Admin Dashboard

Panel administrativo para la red social PsychoShare. Permite gestionar usuarios, reportes, bans y administradores del sistema.

## Tecnologías

- React 19
- React Router DOM
- Bootstrap 5
- JavaScript ES6+

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## Funcionalidades

### Gestión de Usuarios
- Ver lista de usuarios del sistema
- Ver detalles de usuarios específicos
- Estadísticas de usuarios

### Gestión de Reportes  
- Lista de reportes pendientes
- Revisar y resolver reportes
- Historial de reportes procesados

### Gestión de Bans
- Ver usuarios baneados activos
- Banear/desbanear usuarios
- Gestionar duraciones de bans

### Administradores
- Gestión de permisos administrativos
- Alta/baja de administradores

## Estructura del Proyecto

```
src/
├── components/
│   ├── admin/          # Componentes específicos de admin
│   ├── Footer/         # Footer de la aplicación  
│   └── NavBar/         # Barra de navegación
├── pages/              # Páginas principales
├── services/
│   └── admin/          # Servicios API para admin
└── App.js              # Componente principal
```

## API Backend

Este frontend consume las APIs del backend PsychoShare:
- `/Report` - Gestión de reportes
- `/Ban` - Gestión de bans  
- `/api/User` - Gestión de usuarios

## Licencia

MIT License
