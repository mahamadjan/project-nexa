#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install 20
nvm use 20

# Create frontend next app
npx -y create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# Create backend express app
mkdir backend
cd backend
npm init -y
npm install express pg prisma @prisma/client cors dotenv bcrypt jsonwebtoken
npm install -D typescript @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken tsx
npx -y prisma init
npx tsc --init
