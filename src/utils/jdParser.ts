export interface ParsedJD {
  requiredSkills: string[];
  preferredSkills: string[];
  techStack: string[];
  experienceLevel: string;
  responsibilities: string[];
  keywords: string[];
  jobRole?: string;
}

export const parseJobDescription = (jd: string): ParsedJD => {
  const result: ParsedJD = {
    requiredSkills: [],
    preferredSkills: [],
    techStack: [],
    experienceLevel: 'mid',
    responsibilities: [],
    keywords: [],
    jobRole: detectJobRole(jd)
  };

  const techKeywords = [
    'react', 'vue', 'angular', 'node', 'python', 'java', 'javascript', 'typescript',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s', 'sql', 'mongodb', 'postgresql', 'redis',
    'graphql', 'rest', 'api', 'microservices', 'ci/cd', 'git', 'agile', 'scrum',
    'terraform', 'ansible', 'jenkins', 'gitlab', 'github actions', 'circleci',
    'prometheus', 'grafana', 'elasticsearch', 'splunk', 'datadog',
    'linux', 'bash', 'shell scripting', 'nginx', 'apache', 'load balancing',
    'helm', 'istio', 'service mesh', 'kafka', 'rabbitmq', 'consul', 'vault',
    'spark', 'hadoop', 'airflow', 'snowflake', 'databricks', 'tableau', 'power bi'
  ];
  
  techKeywords.forEach(tech => {
    if (jd.toLowerCase().includes(tech)) {
      result.techStack.push(tech.charAt(0).toUpperCase() + tech.slice(1));
    }
  });

  if (jd.match(/senior|lead|principal|staff/i)) result.experienceLevel = 'senior';
  else if (jd.match(/junior|entry|associate/i)) result.experienceLevel = 'entry';
  else if (jd.match(/mid-level|intermediate/i)) result.experienceLevel = 'mid';

  const skillPatterns = [
    /require[sd]?\\s*:?\\s*([^.]+)/gi,
    /must have\\s*:?\\s*([^.]+)/gi,
    /skills?\\s*:?\\s*([^.]+)/gi,
  ];

  skillPatterns.forEach(pattern => {
    const matches = jd.matchAll(pattern);
    for (const match of matches) {
      const skills = match[1].split(',').map(s => s.trim()).filter(s => s.length > 2);
      result.requiredSkills.push(...skills);
    }
  });

  const preferredPatterns = [
    /preferred?\\s*:?\\s*([^.]+)/gi,
    /nice to have\\s*:?\\s*([^.]+)/gi,
    /bonus\\s*:?\\s*([^.]+)/gi,
  ];

  preferredPatterns.forEach(pattern => {
    const matches = jd.matchAll(pattern);
    for (const match of matches) {
      const skills = match[1].split(',').map(s => s.trim()).filter(s => s.length > 2);
      result.preferredSkills.push(...skills);
    }
  });

  const respPatterns = [
    /responsibilit(?:y|ies)\\s*:?\\s*([^.]+)/gi,
    /you will\\s*:?\\s*([^.]+)/gi,
    /duties\\s*:?\\s*([^.]+)/gi,
  ];

  respPatterns.forEach(pattern => {
    const matches = jd.matchAll(pattern);
    for (const match of matches) {
      result.responsibilities.push(match[1].trim());
    }
  });

  result.keywords = [...new Set([
    ...result.techStack,
    ...result.requiredSkills.slice(0, 5),
  ])];

  return result;
};

function detectJobRole(jd: string): string {
  const lowerJD = jd.toLowerCase();
  
  if (lowerJD.includes('business intelligence') || lowerJD.includes('bi engineer') || lowerJD.includes('bi analyst')) {
    return 'bi';
  }
  if (lowerJD.includes('data engineer') || lowerJD.includes('etl') || lowerJD.includes('data pipeline')) {
    return 'data-engineer';
  }
  if (lowerJD.includes('data scientist') || lowerJD.includes('ml engineer') || lowerJD.includes('machine learning')) {
    return 'data-scientist';
  }
  if (lowerJD.includes('devops') || lowerJD.includes('site reliability') || lowerJD.includes('sre')) {
    return 'devops';
  }
  if (lowerJD.includes('security') || lowerJD.includes('infosec') || lowerJD.includes('cybersecurity')) {
    return 'security';
  }
  if (lowerJD.includes('frontend') || lowerJD.includes('front-end')) {
    return 'frontend';
  }
  if (lowerJD.includes('backend') || lowerJD.includes('back-end')) {
    return 'backend';
  }
  if (lowerJD.includes('full stack') || lowerJD.includes('fullstack')) {
    return 'fullstack';
  }
  if (lowerJD.includes('mobile') || lowerJD.includes('ios') || lowerJD.includes('android')) {
    return 'mobile';
  }
  
  return 'general';
}

export const generateQuestionsFromJD = (parsedJD: ParsedJD, type: string, difficulty: string): string[] => {
  const questions: string[] = [];
  const { techStack, requiredSkills, jobRole, keywords } = parsedJD;

  // Role-specific CODING questions
  if (type === 'coding') {
    if (jobRole === 'bi' || jobRole === 'data-engineer' || jobRole === 'data-scientist') {
      // Data/BI focused coding questions
      if (difficulty === 'entry') {
        questions.push(`Write a function to calculate the median of a list of numbers.`);
        questions.push(`Implement a function to find duplicate values in a dataset.`);
        questions.push(`Write a function to group data by a specific key (similar to SQL GROUP BY).`);
      } else if (difficulty === 'mid') {
        questions.push(`Implement a function to perform a LEFT JOIN operation on two datasets.`);
        questions.push(`Write a function to calculate moving average for time-series data.`);
        questions.push(`Implement a function to detect outliers using IQR method.`);
      } else {
        questions.push(`Design an efficient algorithm to find the top K most frequent items in a large dataset.`);
        questions.push(`Implement a sliding window aggregation for streaming data.`);
        questions.push(`Write an algorithm to detect seasonality patterns in time-series data.`);
      }
    } else if (jobRole === 'devops' || jobRole === 'sre') {
      // DevOps/SRE focused coding questions
      if (difficulty === 'entry') {
        questions.push(`Write a bash script to monitor disk usage and alert if it exceeds 80%.`);
        questions.push(`Implement a function to parse log files and extract error messages.`);
        questions.push(`Write a script to check if a service is running and restart it if down.`);
      } else if (difficulty === 'mid') {
        questions.push(`Implement a rate limiter using the sliding window algorithm.`);
        questions.push(`Write a script to automate SSL certificate renewal and validation.`);
        questions.push(`Implement a health check system that monitors multiple endpoints.`);
      } else {
        questions.push(`Design and implement a distributed lock manager for coordinating deployments.`);
        questions.push(`Write an algorithm for optimal container bin packing in Kubernetes.`);
        questions.push(`Implement a circuit breaker pattern for microservices.`);
      }
    } else {
      // General software engineering coding questions
      if (difficulty === 'entry') {
        questions.push(`Write a function to reverse a string without using built-in methods.`);
        questions.push(`Implement a function to check if a number is prime.`);
        questions.push(`Write a function to find the first non-repeating character in a string.`);
      } else if (difficulty === 'mid') {
        questions.push(`Implement a debounce function that delays invoking a function.`);
        questions.push(`Write a function to find the longest substring without repeating characters.`);
        questions.push(`Implement a function to flatten a nested array.`);
      } else {
        questions.push(`Design and implement an LRU cache with O(1) operations.`);
        questions.push(`Implement a rate limiter using the token bucket algorithm.`);
        questions.push(`Write an algorithm to find the longest increasing subsequence.`);
      }
    }
    return questions;
  }

  if (jobRole === 'devops') {
    if (type === 'technical') {
      questions.push(`Explain the difference between continuous integration, continuous delivery, and continuous deployment.`);
      questions.push(`How would you design a CI/CD pipeline for a microservices architecture?`);
      questions.push(`What strategies do you use for monitoring and alerting in a distributed system?`);
      
      if (techStack.some(t => ['Docker', 'Kubernetes', 'K8s'].includes(t))) {
        questions.push(`Explain Kubernetes pod lifecycle and how you would troubleshoot a CrashLoopBackOff?`);
        questions.push(`How do you manage secrets and configurations in Kubernetes?`);
      }
      
      if (techStack.some(t => ['Terraform', 'Ansible'].includes(t))) {
        questions.push(`Explain infrastructure as code and the benefits of using Terraform.`);
        questions.push(`How do you handle state management in Terraform for team collaboration?`);
      }
      
      if (techStack.some(t => ['AWS', 'Azure', 'GCP'].includes(t))) {
        questions.push(`How would you design a highly available and fault-tolerant architecture?`);
        questions.push(`Explain auto-scaling strategies and when you would use horizontal vs vertical scaling.`);
      }
    }
    
    if (type === 'system-design') {
      questions.push(`Design a monitoring and alerting system for a large-scale distributed application.`);
      questions.push(`How would you implement blue-green deployment for a production system with zero downtime?`);
      questions.push(`Design a CI/CD pipeline that handles deployment to multiple environments.`);
    }
  }

  if (jobRole === 'bi' || jobRole === 'data-engineer' || jobRole === 'data-scientist') {
    if (type === 'technical') {
      questions.push(`Explain the difference between OLTP and OLAP systems.`);
      questions.push(`How would you design a data warehouse schema? Star vs Snowflake?`);
      questions.push(`What is data partitioning and when would you use it?`);
      
      if (techStack.some(t => ['Spark', 'Hadoop'].includes(t))) {
        questions.push(`Explain how Spark handles distributed computing and what are transformations vs actions?`);
        questions.push(`How would you optimize a slow Spark job?`);
      }
      
      if (techStack.some(t => ['Airflow'].includes(t))) {
        questions.push(`Explain how to design fault-tolerant data pipelines in Airflow.`);
        questions.push(`How do you handle backfilling and data quality checks in ETL pipelines?`);
      }
    }
    
    if (type === 'system-design') {
      questions.push(`Design a real-time data pipeline for processing millions of events per second.`);
      questions.push(`How would you design a data lake architecture?`);
      questions.push(`Design an ETL system to sync data from multiple sources into a data warehouse.`);
    }
  }

  if (type === 'technical') {
    techStack.forEach(tech => {
      if (tech.toLowerCase().includes('react')) {
        questions.push(`Explain React hooks and when would you use useEffect vs useLayoutEffect?`);
        questions.push(`How do you optimize performance in a large React application?`);
      }
      if (tech.toLowerCase().includes('node')) {
        questions.push(`How does Node.js handle asynchronous operations? Explain the event loop.`);
        questions.push(`What are the differences between process.nextTick() and setImmediate()?`);
      }
      if (tech.toLowerCase().includes('python')) {
        questions.push(`Explain the Global Interpreter Lock (GIL) in Python and its implications.`);
        questions.push(`What are Python decorators and how would you implement one?`);
      }
    });
  }

  if (type === 'system-design' && !questions.length) {
    questions.push(`How would you design a system to handle \${difficulty === 'senior' ? '1 billion' : '1 million'} requests per day?`);
  }

  if (type === 'behavioral') {
    requiredSkills.slice(0, 3).forEach(skill => {
      questions.push(`Tell me about a time when you had to quickly learn \${skill} for a project.`);
    });
  }

  return questions.length > 0 ? questions : [
    `Based on your experience with \${keywords.join(', ')}, can you walk me through a challenging project?`
  ];
};