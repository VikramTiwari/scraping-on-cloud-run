# PW docker image is maintained with all the binaries required to run the browsers
FROM mcr.microsoft.com/playwright:v1.11.0-focal
WORKDIR /usr/src/app

# Install deps before copying code
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy all the code
COPY ./ ./

# Expose port for web server
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
