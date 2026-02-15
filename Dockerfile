# ETAPA 1: Construcción (Node)
FROM node:20-alpine as build

WORKDIR /app

# Copiamos package.json primero (Caché)
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# --- AQUÍ ESTÁ EL TRUCO ---
# Declaramos que aceptamos un argumento llamado VITE_API_URL
ARG VITE_API_URL
# Lo convertimos en variable de entorno para que Vite lo vea durante el build
ENV VITE_API_URL=$VITE_API_URL

# Construimos la app (genera la carpeta dist)
RUN npm run build

# ETAPA 2: Servidor Web (Nginx)
FROM nginx:alpine

# Copiamos nuestra config de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados desde la etapa 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]