FROM node:22 AS builder

# Set working directory
WORKDIR /app

# 1️⃣ Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

COPY . .

# 2️⃣ Copy all TypeScript config files (needed for project references)
COPY tsconfig*.json ./
COPY tsconfig.app.json tsconfig.node.json ./

# 3️⃣ Copy Vite config & source files
COPY vite.config.* ./
COPY public ./public
COPY src ./src

# 4️⃣ Build the project
# This will run tsc -b (project references) + vite build
RUN npm run build