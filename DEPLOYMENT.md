# Strategic Call Planner - Deployment Guide

## 🚀 Deploy to Netlify

### Prerequisites
1. **Netlify Account**: Create account at [netlify.com](https://netlify.com)
2. **Git Repository**: Push your code to GitHub/GitLab/Bitbucket
3. **Environment Variables**: Set up required environment variables

### 📋 Environment Variables

Set these in your Netlify dashboard under **Site settings > Build & deploy > Environment**:

```bash
DATABASE_URL="file:./db/custom.db"
ZAI_API_KEY="your_zai_api_key_here"
```

### 🛠️ Build Settings

In Netlify dashboard:
- **Build command**: `npm run build`
- **Publish directory**: `.next/standalone`
- **Node version**: `18`

### 🚀 Deployment Methods

#### Method 1: Git Integration (Recommended)
1. Connect your repository to Netlify
2. Set environment variables
3. Push changes to trigger auto-deploy

#### Method 2: Manual Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
npm run deploy
```

### 🔧 Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
nano .env

# Setup database
npm run db:push

# Start development server
npm run dev
```

### 📱 Features After Deploy

- ✅ **Responsive Design**: Works on all devices
- ✅ **File Export**: TXT and PDF download
- ✅ **Data Persistence**: Save/load call plans
- ✅ **Real-time Preview**: Live form updates
- ✅ **Professional UI**: Modern shadcn/ui components

### 🐛 Troubleshooting

**Build Issues**:
```bash
# Clear build cache
rm -rf .next

# Rebuild
npm run build
```

**Database Issues**:
```bash
# Reset database
npm run db:reset

# Push schema
npm run db:push
```

**Environment Issues**:
- Check Netlify environment variables
- Verify API keys are correct
- Check build logs in Netlify dashboard

### 📞 Support

For deployment issues:
1. Check Netlify build logs
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check Node.js version compatibility

### 🎯 Success Indicators

✅ **Deploy Success**: Site loads without errors
✅ **Database**: Can save/load call plans
✅ **Export**: File downloads work correctly
✅ **Forms**: All inputs and submissions work