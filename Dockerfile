# ----------------------------------------------------------------
# ETAPA 1: BUILDER (USADA PARA INSTALAR Y COMPILAR)
# Usamos una imagen completa de Node.js, pero solo en este paso.
FROM node:22 AS builder

# Crea el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de dependencias
COPY package.json package-lock.json ./

# Instala SOLO las dependencias de producción. Esto es CRUCIAL.
# Usar --only=production evita que se instalen las dependencias de desarrollo.
RUN npm install --only=production

# Copia el código fuente restante
COPY . .

# Comando de compilación (ej. TypeScript a JavaScript)
RUN npm run build 

# ----------------------------------------------------------------
# ETAPA 2: PRODUCTION (USADA SOLO PARA EJECUTAR)
# Usamos 'node:20-alpine', que es una imagen mucho más LIGERA que la estándar.
FROM node:22-alpine 

# Establece la variable de entorno crítica para optimización de RAM
# (Aun así, confírmala en el panel de la nube también)
ENV NODE_ENV=production

WORKDIR /app

# Copiamos solo los archivos NECESARIOS de la etapa 'builder':
# 1. El código compilado (la carpeta 'dist').
# 2. Las dependencias de producción instaladas ('node_modules').
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Puerto que expone tu aplicación
EXPOSE 5000 

# Comando para iniciar la aplicación (debe ser el mismo que tu Start Command)
CMD ["node", "dist/main.js"]