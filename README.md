# ReUSO

Backend del grupo 4 ReUSO, realizado en [Prisma y Express](https://reactjs.org/).

## Tecnologias Usada

Express + Prisma

## Levantar Servicio Localmente

- Clonar el repositorio

```bash
  git clone https://github.com/facuft2/Proyecto-Integrador-2022-Equipo-4-Backend
```

- Ir al directorio del proyecto

```bash
  cd Proyecto-Integrador-2022-Equipo-4-Backend
```

- Instalar las dependencias, utilizando npm

```bash
  npm install
```

- Levantar el servidor

```bash
  npm run
```

## Variables de Entorno

Para correr este proyecto, necesitaras las siguientes variables de entorno

(TODAS LAS VARIABLES DE ENTORNO SE ENCUENTRAN EN EL ARCHIVO `.env`)

- `PUERTO` - Puerto en el que se ejecuta la api

```bash
  PORT= (Puerto de tu preferencia)
```

- `CONEXION CON LA BASE DE DATOS` - URL de la base de datos

  ```bash
    DATABASE_URL= (ManejadorDeBaseDeDatos://nombreDeUsuario:Contraseña@ip:puerto/ReUSO)
  ```

- `SECRET_KEY` - Clave secreta para encriptar el token

```bash
  SECRET_KEY= (Clave secreta)
```

- `CREDENCIALES DE DIGITAL OCEAN` - Credenciales de Digital Ocean para el almacenamiento de imagenes

:warning: **IMPORTANTE** :warning: - Para poder utilizar el servicio de almacenamiento de imagenes, es necesario tener una cuenta en Digital Ocean y crear un bucket en Spaces.

```bash
SPACES_NAME=**********
SPACES_ENDPOINT=************
SPACES_KEY=************
SPACES_SECRET=*********
```

- `CREDENCIALES DE TWILIO` - Credenciales de Twilio para el envio de codigos de verificacion

:warning: **IMPORTANTE** :warning: - Para poder utilizar el servicio de envio de codigos de verificacion, es necesario tener una cuenta en Twilio y crear un servicio de SMS.

```bash
TWILIO_ACCOUNT_SID=**********
TWILIO_AUTH_TOKEN=************
TWILIO_VERIFY_SID=***********
```

## Autores

- [Facundo Perez](https://www.github.com/facuft2)
- [Mathias Sellanes](https://github.com/mathiassellanes)
- [Arianna Ametrano](...)
- [Camilo Danielli](...)
