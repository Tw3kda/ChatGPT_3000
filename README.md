# ChatGPT Clone

Un clon de ChatGPT desarrollado en **React Native** con **Expo**, utilizando **Firebase Authentication** y **Firestore** para la gestión de usuarios y almacenamiento de conversaciones.

## Características

- **Autenticación con Firebase**: Inicio de sesión y registro de usuarios.
- **Almacenamiento en Firestore**: Las conversaciones se almacenan en la base de datos en tiempo real.
- **Gestión de chats**: Crear y eliminar conversaciones.

## Tecnologías utilizadas

- **React Native** con **Expo**
- **Firebase Authentication** (Gestión de usuarios)
- **Firestore** (Base de datos en tiempo real)

## Instalación

1. Clonar el repositorio:

   ```sh
   git clone https://github.com/tu_usuario/chatgpt-clone.git
   cd chatgpt-clone
   ```

2. Instalar dependencias:

   ```sh
   npm install
   ```

3. Configurar Firebase:
   - Crear un proyecto en Firebase.
   - Habilitar **Authentication** (correo/contraseña o Google).
   - Crear una base de datos **Firestore** en modo prueba.
   - Descargar el archivo `google-services.json` y colocarlo en `./android/app/` (para Android).
   - Para iOS, seguir la documentación oficial de Firebase y Expo.

4. Ejecutar la aplicación:

   ```sh
   expo start
   ```

## Uso

- **Registro / Inicio de sesión**: Los usuarios pueden registrarse e iniciar sesión mediante Firebase Authentication.
- **Inicio de un nuevo chat**: Se puede iniciar una nueva conversación.
- **Ver conversaciones previas**: Los chats se almacenan en Firestore y se listan en el dashboard.
- **Eliminar chats**: Opción para eliminar todas las conversaciones.
- **Cerrar sesión**: Botón para cerrar sesión y regresar a la pantalla de login.



## Autores

- **Santiago Navarro Cuy** - Desarrollador

