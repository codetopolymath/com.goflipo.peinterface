# Deployment Guide for PE Interface

## Local Development

```bash
npm start
```

This will start:
- React development server on port 3000
- Backend server on ports 5001 and 5002

## Production Deployment on Remote Server (64.227.156.167)

### 1. Build the React App

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### 2. Deploy to Server

Transfer the following to your server:
- `build/` folder (React production build)
- `server/` folder (Backend server code)
- `package.json`
- `.env.production` (if needed)

### 3. On the Remote Server

#### Install dependencies:
```bash
cd /path/to/app
npm install --production
```

#### Start the server:
```bash
npm run start:prod
```

Or use PM2 for production:
```bash
npm install -g pm2
pm2 start server/server.js --name "pe-interface"
pm2 save
pm2 startup
```

### 4. Important: Firewall Configuration

Make sure ports 5001 and 5002 are open on your server:

```bash
# For UFW (Ubuntu)
sudo ufw allow 5001
sudo ufw allow 5002
sudo ufw reload

# Check status
sudo ufw status
```

### 5. Nginx Configuration (Optional but Recommended)

If using Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name 64.227.156.167 peinterface.goflipo.in;

    # Serve React static files
    location / {
        root /path/to/app/build;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /process-message {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api/ {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Architecture

### How BACKUP_API Works

The application automatically detects the hostname:
- **Local**: Uses `http://localhost:5001/process-message`
- **Remote (64.227.156.167)**: Uses `http://64.227.156.167:5001/process-message`
- **Domain (peinterface.goflipo.in)**: Uses `http://peinterface.goflipo.in:5001/process-message`

This is handled dynamically in `src/constants/index.js`.

### CORS Configuration

The server (server/server.js) allows requests from:
- http://peinterface.goflipo.in
- https://peinterface.goflipo.in
- http://localhost:3000
- http://64.227.156.167 (and ports :3000, :5001, :5002)

## Troubleshooting

### Connection Refused Error
1. Check if server is running: `lsof -i :5001`
2. Check firewall: `sudo ufw status`
3. Check server logs: `pm2 logs pe-interface`

### CORS Error
- Verify the origin is in the CORS whitelist in `server/server.js`
- Check browser console for actual origin being used

### Port Already in Use
```bash
# Find process using port
lsof -i :5001
# Kill process
kill -9 <PID>
```
