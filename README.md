# Proyecto final de SYTW

Para realizar este proyecto, hemos seguido utilizando la práctica sobre Gitbook que hemos realizado durante todo el curso, mejorando su funcionamiento, así como añadiendo un perfil de usuario, en el cual el administrador puede gestionar a los usuarios y el resto puede cambiar libremente su correo o contraseña.

A continuación se incluye un tutorial paso a paso, desde crear y construir nuestro Gitbook, hasta desplegarlo en una plataforma.

## Tutorial paso a paso

### 1. Instalación y uso del paquete gitbook-start

Para poder crear nuestro libro, lo primero que tenemos que hacer es instalar el paquete [gitbook-start-github-rafadanipedro](https://www.npmjs.com/package/gitbook-start-github-rafadanipedro) con el siguiente comando:

`npm i -g gitbook-start-github-rafadanipedro`

Para usarlo, solamente tenemos que escribir `gitbook-start <nombre_del_libro>`. Con la opción `-h` podremos ver todos los argumentos que es capaz de procesar.

#### 1.1. Autenticación en Github

Este paquete, además de crearnos la estructura del Gitbook y ser capaz de generar las gh-pages pertinentes, también nos crea un repositorio en Github que contiene el libro. Para ello, solamente tenemos que rellenar el nombre de usuario y la contraseña cuando se nos pida por consola. Esto generará un token para poder operar con nuestra cuenta. Debido a esto, tenemos que comprobar que no contamos con el mismo token en nuestra cuenta, ya que esto producirá un fallo.

### 2. Despliegue

Una vez tengamos creado nuestro libro inicial, tenemos que desplegarlo antes de realizar ninguna modificación sobre él. Para poder colgarlo en nuestro servidor, necesitamos el paquete [plugin-bubook-rafadanipedro](https://www.npmjs.com/package/plugin-bubook-rafadanipedro), que se descargará automáticamente al ejecutar el siguiente comando:

`gitbook-start --deploy="plugin-bubook-rafadanipedro`

Con el comando anterior, se nos descarga dicho paquete y se nos añade la tarea correspondiente en nuestro archivo _gulpfile_. Tras esto, se nos realiza una serie de preguntas, como las que se detallan a continuación:

```
? Cual es tu username del Iaas: rafa
? Cual es la ruta de tu clave privada: ~/.ssh/id_rsa
? Cual es el directorio del Iaas: /home/rafa/miProyecto
? Cual es tu direccion ip: 95.122.54.178
```
Tras estas preguntas relacionadas con la conexión SSH al servidor, veremos otras relacionadas con el modo de autenticación que queremos proveer, en nuestro caso Github o base de datos con sqlite o ambos, así como el tipo de conexión que queremos para nuestro libro. Si se selecciona el modo de autenticación con Github, se nos pedirá en una nueva pregunta que se genere una aplicación en Github, para posteriormente introducir el clientID y el clientSecret correspondiente, así como la organización que vamos a comprobar si el usuario pertenece o no.

```
? ¿De que manera quieres autenticarte?:
- [X] Github
- [X] BaseDatos
? ¿Que tipo de conexion quiere hacer?:
- [X] Segura
- [ ] NoSegura
? Entre en esta direccion para crear una OauthApplication en Github https://github.com/settings/developers y escribe "confirmar" para continuar: confirmar
? Cual es el clientID: 123456789
? Cual es el clientSecret: 123456789
? Cual es la organizacion a la que perteneces: ULL-ESIT-SYTW-1617
```
Una vez tengamos la configuración de Github lista, aparecerán las relacionadas con la base de datos. Primero veremos una pregunta en la que pondremos los correos que estarán registrados en la plataforma. Las contraseñas por defecto son **1234**, obligando al usuario a cambiarla en el primero inicio, y el primero correo de la lista será el administrador del libro.
```
? Escribe los correos separados por comas. El primero de ellos será el administrador de la plataforma: pedro@pedro.com, rafa@rafa.com, daniel@daniel.com
```
Con la plataforma ya configurada, si hemos seleccionado conexión segura, se nos preguntará por el nombre de la certificadora, nombre de la organización de la certificadora, cantidad de días de validez para el certificado, y número de puerto a utilizar, por defecto el 3443.
```
? Escribe el nombre de su certificadora ssl: chuchu
? Escribe el nombre de la organizacion de su certificadora ssl: chuchuorg
? Inserte el numero de dias para utilizar su certificado: 365
? Inserte el puerto a utilizar para la conexión ssl (3443): 443
```
Tras esto, se realizará un despliegue del libro en el servidor, se realizara una instalación de las dependencias y se dejará corriendo una instancia de express con nuestro libro.

**NOTA**: ver apartado 4 de este documento en el que se especifican algunas de las consideraciones previas a tener en cuenta, así como otros anexos relacionados con generar claves SSH o la creación de una aplicación en Github.

### 3. Generar libro

Realizando los pasos anteriores, únicamente nos aseguramos de desplegar el libro inicial de demostración, pero lo que realmente nos interesa es generar nuestro propio libro con nuestro contenido. Todo el contenido que queramos incluir en nuestro libro, debe de estar escrito en formato Markdown en la carpeta _txt_.

Lo primero que tenemos que realizar es un `npm i` en la carpeta de nuestro libro para así instalar todas las dependencias necesarias. Además, también necesitamos realizar un `npm i -g gulp-cli` para poder instalar [Gulp](https://www.npmjs.com/package/gulp) de manera global. Una vez tengamos todo instalado, solamente necesitamos ejecutar `gulp generateGhPages`. Este comando generará en la carpeta _gh-pages_ los archivos HTML necesarios.

#### 3.1. Despliegue del libro generado

Cada vez que realicemos un cambio en el libro, necesitamos generar de nuevo los archivos HTML y desplegar dichos cambios en el servidor. Para ello, bastará con ejecutar el comando `gulp bubookRafadanipedro` , el cuál realizará todo lo necesario para el funcionamiento y visualización de la plataforma y del libro.


### 4. Anexos, consideraciones y requisitos previos

En este apartado se describen aquellos requisitos que se deben cumplir previamente, además de incluir alguna información importante sobre como configurar otros apartados relacionados con la plataforma.

#### 4.1. Requisitos previos

* Tienes que tener los paquetes de `sqlite` en la máquina remota.

  `sudo apt-get install sqlite3 libsqlite3-dev`

* Tienes que tener `node` en el `$PATH`. A veces cuando lo instalamos no se añade al `$PATH`, por ejemplo cuando lo instalamos con `nvm`.

#### 4.2. Consideraciones

* Si no desplegamos ningún libro, al intentar acceder al mismo, nos aparecerá más de un navbar, uno tras otro. En caso de que exista algún libro, solo se mostrará uno.

* Los puertos por defecto son el 8080 para la conexión no segura (no se puede modificar salvo que se cambie el archivo _config.json_ de manera manual), y el 3443 para la segura. Si seleccionamos la opción con SSL, todo lo que entre como HTTP por el 8080 se redirigirá como HTTPS al puerto introducido en las preguntas sobre la conexión segura.

* Debido a que es necesario tener permisos de superusuario para poder utilizar cualquiera de los 1024 primeros puertos, si queremos utilizar para HTTPS el estándar, el 443, al intentar correr express de manera automática no podremos. A pesar de ello, podemos conectarnos por SSH al servidor, y crear una nueva sesión con `screen` para ejecutar el comando `sudo npm start` sobre la carpeta del libro con un usuario que si tenga permisos y así poder utilizar el puerto que queramos.

#### 4.3. Configurar claves ssh

Primero, generaremos un par de claves ssh para poder acceder a nuestro servidor sin necesidad de poner contraseña. Lo haremos con:
- `ssh-keygen -t rsa -b 2048`

Presionamos enter hasta que termine, puesto que no nos interesa cambiar los parámetros por defecto. Ahora copiamos nuestra clave en el servidor con:
- `ssh-copy-id usuario@direccion-servidor-iaas`

#### 4.4. Instalación de paquetes necesarios

Para poder correr nuestro libro correctamente, tenemos que tener instalado en nuestra máquina Node.js y `npm`. En el caso del [IAAS ULL](https://iaas.ull.es), esto ya viene instalado por defecto, pero por si queremos utilizarlo en otro servidor, estos son los pasos a seguir:

1. Instalamos `nvm`, que nos permite instalar la versión que queramos de Node.js. Seguimos los pasos descritos en la sección de `Install script` del README del [repositorio de nvm](https://github.com/creationix/nvm).
2. Una vez instalado `nvm`, ejecutamos el comando `nvm install node` para instalar la última versión disponible de Node.js.

Al instalar Node.js, `npm` ya se encuentra por defecto.

#### 4.5. Tutorial para crear una OauthApplication

Para permitir que una aplicación web pueda acceder a la plataforma Github, hay que darle un permiso de authenticación Oauth. Para conseguirlo se debe ingresar en el siguiente enlace:
[Enlace Oauth](https://github.com/settings/developers).

Para realizar la aplicación, se deben realizar una serie de pasos:

* Registrar la nueva aplicación.

![OauthApplication](https://s16.postimg.org/uho7li4hh/captura_enlace_oauth.png)

![Registrar nueva app](https://s16.postimg.org/d1pg62g51/captura_boton_registrar_app.png)

* Una vez se accede al menú de registro de nueva aplicación, se debe añadir un nombre a a la aplicación.

![Añadir descripcion](https://s16.postimg.org/ofbzh9qnp/captura_creacion_app.png)
* A continuación, se debe añadir el enlace de la aplicación principal. El enlace debe tener el siguiente formato: `http(s)://hostname`
* Finalmente, se añade una pequeña descripción a la aplicación creada y se le añade la authorization callback url que debe tener el siguiente formato: `http(s)://hostname/auth/github_oauth/callback`
* Cuando la aplicación ya ha sido creada, se puede acceder a la misma y utilizar el clientID y el clientSecret para poder realizar la autenticación mediante Oauth.

* * *

## Descripción de la práctica
 * [Gitbook de la práctica](https://crguezl.github.io/ull-esit-1617/proyectos/sytw/)

## Páginas personales

Pinchando sobre las imágenes podrás acceder a nuestras páginas personales.

<a href='https://rafaherrero.github.io' target='_blank'><img src='https://avatars2.githubusercontent.com/u/11819652?v=3&s=400' border='0' alt='postimage' width='100px'/></a> <a href='https://danielramosacosta.github.io/' target='_blank'><img src='https://avatars2.githubusercontent.com/u/11427028?v=3&s=400' border='0' alt='postimage' width='100px'/></a> <a href='https://alu0100505078.github.io/' target='_blank'><img src='https://avatars3.githubusercontent.com/u/14938442?v=3&s=400' border='0' alt='postimage' width='100px'/></a>