## CLiente gategay

El gateway es el punto de comunicacion entre clientes y servicios
Es el encargado de recibir las peticiones, enviarlas a los servicios
correspondientes y devolver la respuesta al cliente

## DEV

1. Clonar el repo
2. Instalar dependencias
3. crear un archivo `.env` basado en el `.env.template`
4. tener levantados los microservicios que se van a consumir
5. levantar proyecto con `npm run start:dev`
6. levantar docker de Nats

## Nats

```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```
