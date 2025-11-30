# InterviewAI

An AI-powered interview preparation platform that provides realistic technical interview simulations with intelligent feedback and code execution capabilities.

## Features

### 🎯 Role-Based Interview Preparation
- Customizable interviews for different job roles (Software Engineer, Data Scientist, DevOps, etc.)
- Difficulty levels: Easy, Medium, Hard
- Dynamic question generation based on role and experience level
- Experience-based filtering (Entry, Mid, Senior levels)

### 🤖 AI-Powered Interview Assistant
- Real-time AI feedback
- Intelligent follow-up questions based on candidate responses
- Code review and validation with detailed explanations
- Performance analysis and improvement suggestions
- Context-aware conversation management

### 💻 Multi-Language Code Execution
- Support for 15+ programming languages
- Real-time code execution using Piston API
- Integrated Monaco Editor with syntax highlighting
- Code validation and automatic test case generation
- Memory and time limit enforcement
- Syntax error detection and debugging hints

### 🎙️ Voice Interaction
- Speech-to-text for verbal responses
- Text-to-speech for AI interviewer questions
- Natural conversation flow
- Multi-language voice support
- Recording transcription

### 📊 Performance Analytics
- Detailed interview session reports
- Multi-dimensional scoring system:
  - Technical accuracy
  - Communication skills
  - Problem-solving approach
  - Code quality and efficiency
  - Time management
- Progress tracking over multiple sessions
- Strengths and weaknesses identification
- Comparative analysis with industry standards

### 📝 Resume Analysis
- Upload and parse resumes (PDF/DOCX formats)
- Generate role-specific questions from resume content
- Skills gap analysis
- Experience validation
- Custom interview flow based on background

### 📹 Session Recording
- Video recording of interview sessions
- Audio recording with transcription
- Playback for self-review
- Export capabilities (MP4, WebM)
- Timestamp-based navigation

### 🔄 Real-Time Features
- Live code compilation and execution
- Instant AI feedback
- Dynamic difficulty adjustment
- Automatic session saving
- Browser-based - no installation required

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **Code Editor**: Monaco Editor (VS Code engine)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Speech**: Web Speech API
- **State Management**: React Hooks
- **Styling**: Tailwind CSS + CSS Modules

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Code Execution**: Piston API
- **File Processing**: Multer, PDF-parse, DOCX parser
- **Security**: Helmet, CORS, Express Rate Limit
- **Validation**: Input sanitization and validation

## API Endpoints

### Interview Management
- `POST /api/interview/generate` - Generate interview questions
- `POST /api/interview/validate` - Validate candidate answers
- `POST /api/interview/feedback` - Get AI feedback
- `POST /api/interview/start` - Start new interview session
- `GET /api/interview/history` - Retrieve interview history

### Code Execution
- `POST /api/code/execute` - Execute code in selected language
- `POST /api/code/validate` - Validate code solution
- `POST /api/code/test-cases` - Generate test cases
- `GET /api/code/languages` - Get supported languages

### Resume Processing
- `POST /api/interview/upload-resume` - Upload and analyze resume
- `POST /api/interview/parse-resume` - Extract resume data

### Analytics
- `GET /api/analytics/performance` - Get performance metrics
- `GET /api/analytics/sessions` - Get session statistics

## Architecture

### System Design
- **Frontend**: Single Page Application (SPA)
- **Backend**: RESTful API architecture
- **Communication**: HTTP/HTTPS with JSON payloads
- **Real-time Processing**: Event-driven code execution
- **AI Integration**: Streaming responses from Gemini API

### Data Flow
1. User initiates interview → Frontend sends request to backend
2. Backend generates questions using Gemini AI
3. User answers (text/voice) → Processed and validated
4. Code execution handled by Piston API sandbox
5. AI analyzes responses and provides feedback
6. Results stored and analytics generated

## Configuration

### Supported Languages
Python, JavaScript, TypeScript, Java, C++, C, C#, Ruby, Go, Rust, PHP, Swift, Kotlin, Scala, Perl, R, Dart, Haskell, Lua, Bash, PowerShell, SQL, and more

### Rate Limiting
- Interview generation: 10 requests/minute
- Code execution: 20 requests/minute
- File uploads: 5 requests/minute

### File Upload Limits
- Max file size: 10 MB
- Supported formats: PDF, DOCX
- Max resume pages: 15

## Security Features
- CORS protection with whitelist configuration
- Request rate limiting per IP
- Input validation and sanitization
- Secure file upload handling with type verification
- Environment variable protection
- XSS and injection attack prevention
- Secure HTTP headers (Helmet.js)
- API key encryption

## Performance Optimizations
- Code splitting and lazy loading
- API response caching
- Debounced user input handling
- Optimized Monaco Editor loading
- Compressed production builds
- CDN-ready static assets

# Use Cases

- **Job Seekers**: Practice technical interviews before actual job interviews
- **Students**: Prepare for campus placements and internship interviews
- **Career Switchers**: Build confidence in new technical domains
- **Professionals**: Stay sharp with regular practice and skill assessment
- **Recruiters**: Evaluate candidate readiness and technical skills
- **Educators**: Assign practice interviews as coursework

## Key Advantages

✅ **Realistic Interview Experience** - Mimics actual technical interview scenarios
✅ **Instant Feedback** - Get immediate AI-powered insights on your performance
✅ **Flexible Practice** - Practice anytime, anywhere with no scheduling required
✅ **Multi-Domain Support** - Covers various roles and technologies
✅ **Progress Tracking** - Monitor improvement over time with detailed analytics
✅ **Cost-Effective** - Free alternative to expensive interview prep platforms
