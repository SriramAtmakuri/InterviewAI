# InterviewAI Backend

AI-powered interview platform backend with Google Gemini integration, Firebase, and comprehensive features.

## Features

- 🤖 **Real AI Interview**: Gemini AI for intelligent interview questions and feedback
- 💻 **Code Execution**: Sandboxed code execution for multiple languages
- 🎥 **Video Recording**: Upload and manage interview recordings
- 📄 **Resume Analysis**: AI-powered resume parsing and job matching
- 🔐 **Firebase Auth**: Secure authentication with Firebase
- 📊 **Analytics**: Track interview performance and progress
- ☁️ **Firebase Storage**: Cloud storage for videos and resumes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI**: Google Gemini API
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Auth**: Firebase Authentication
- **Deployment**: Render

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Firebase project created
- Google Gemini API key

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable Firestore Database
4. Enable Firebase Storage
5. Enable Firebase Authentication
6. Go to Project Settings > Service Accounts
7. Generate new private key
8. Download the JSON file

### 3. Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Save the key securely

### 4. Environment Variables

Create a `.env` file in the backend directory:

```bash
# Server
PORT=5000
NODE_ENV=development

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_STORAGE_BUCKET=your_bucket_name.appspot.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Code Execution
CODE_EXECUTION_TIMEOUT=10000
MAX_CODE_LENGTH=10000

# Video Recording
MAX_VIDEO_SIZE_MB=100
```

### 5. Install Dependencies

```bash
cd backend
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
All routes except `/health` require Firebase ID token in Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

### Interview Routes (`/api/interviews`)

- `POST /api/interviews/start` - Start new interview
- `POST /api/interviews/:id/message` - Send message in interview
- `POST /api/interviews/:id/end` - End interview and get feedback
- `GET /api/interviews/:id` - Get interview details
- `GET /api/interviews` - Get interview history

### Code Routes (`/api/code`)

- `GET /api/code/languages` - Get supported languages
- `POST /api/code/execute` - Execute code
- `POST /api/code/submit/:interviewId` - Submit code for interview
- `POST /api/code/validate` - Validate syntax
- `POST /api/code/analyze` - Analyze code with AI

### Resume Routes (`/api/resume`)

- `POST /api/resume/upload` - Upload and parse resume (multipart/form-data)
- `POST /api/resume/analyze` - Analyze resume against JD
- `POST /api/resume/questions` - Generate interview questions
- `POST /api/resume/skills` - Extract skills from resume
- `POST /api/resume/suggestions` - Get improvement suggestions
- `POST /api/resume/benchmark` - Benchmark resume
- `GET /api/resume` - Get uploaded resumes

### Video Routes (`/api/video`)

- `POST /api/video/upload` - Upload complete video
- `POST /api/video/chunk` - Upload video chunk
- `POST /api/video/finalize` - Finalize recording (merge chunks)
- `GET /api/video/interview/:id` - Get recordings for interview
- `DELETE /api/video/:id` - Delete recording

### User Routes (`/api/user`)

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user statistics

## Deployment to Render

### 1. Push to GitHub

```bash
git add .
git commit -m "Add backend"
git push origin main
```

### 2. Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Select the repository
5. Configure:
   - **Name**: interviewai-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or paid

### 3. Add Environment Variables

In Render dashboard, add all environment variables from `.env`:

- `GEMINI_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_STORAGE_BUCKET`
- `FRONTEND_URL` (your frontend domain)
- Other optional variables

### 4. Deploy

Click "Create Web Service" and wait for deployment.

## Firestore Database Structure

```
users/
  {userId}/
    email: string
    createdAt: timestamp
    updatedAt: timestamp

interviews/
  {interviewId}/
    userId: string
    jobTitle: string
    company: string
    type: string
    difficulty: string
    status: string
    messages: array
    startTime: timestamp
    endTime: timestamp
    feedbackId: string

feedback/
  {feedbackId}/
    interviewId: string
    overallScore: number
    technicalScore: number
    communicationScore: number
    strengths: array
    improvements: array
    detailedAnalysis: string

codeSubmissions/
  {submissionId}/
    interviewId: string
    code: string
    language: string
    analysis: object
    submittedAt: timestamp

videoRecordings/
  {recordingId}/
    userId: string
    interviewId: string
    url: string
    fileName: string
    uploadedAt: timestamp

resumes/
  {resumeId}/
    userId: string
    fileName: string
    url: string
    text: string
    uploadedAt: timestamp
```

## Supported Programming Languages

- JavaScript (Node.js)
- Python
- Java
- C
- C++

## Security Features

- Firebase Authentication
- Rate limiting on all endpoints
- Helmet.js for security headers
- Code execution sandboxing
- File upload validation
- CORS configuration

## Rate Limits

- General API: 100 requests per 15 minutes
- Code Execution: 10 requests per minute
- Video Upload: 5 uploads per hour
- AI Requests: 30 requests per minute

## Error Handling

All errors return JSON format:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server with auto-reload
npm run dev

# Run production server
npm start

# Run tests (if configured)
npm test
```

## Troubleshooting

### Firebase Connection Issues
- Verify `FIREBASE_PRIVATE_KEY` has proper newlines (`\n`)
- Check Firebase project ID matches
- Ensure service account has proper permissions

### Gemini API Errors
- Verify API key is valid
- Check quota limits in Google AI Studio
- Ensure billing is enabled if required

### Code Execution Failures
- Check if required compilers are installed (gcc, g++, python3, java, node)
- Verify temp directory permissions
- Check timeout settings

## License

MIT
