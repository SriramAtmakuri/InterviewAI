// Comprehensive coding problems database organized by role and difficulty

export interface CodingProblem {
  title: string;
  description: string;
  examples: string;
  constraints: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  initialCode: {
    javascript: string;
    python: string;
    java: string;
  };
  difficulty: 'entry' | 'mid' | 'senior';
  category: string[];
}

const CODING_PROBLEMS: Record<string, CodingProblem[]> = {
  // ============================================
  // GENERAL SOFTWARE ENGINEERING PROBLEMS
  // ============================================
  general: [
    // Entry Level
    {
      title: "Two Sum",
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      examples: `Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]`,
      constraints: `• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists`,
      approach: `You can solve this problem using:
- Brute Force: Check all pairs (O(n²) time)
- Hash Map: Store complements for O(n) lookup`,
      timeComplexity: "O(n) using hash map",
      spaceComplexity: "O(n) for hash map storage",
      initialCode: {
        javascript: "function twoSum(nums, target) {\n  // Write your solution here\n  \n}",
        python: "def two_sum(nums, target):\n    # Write your solution here\n    pass",
        java: "public int[] twoSum(int[] nums, int target) {\n    // Write your solution here\n    \n}"
      },
      difficulty: 'entry',
      category: ['arrays', 'hash-table', 'general']
    },
    {
      title: "Valid Palindrome",
      description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string s, return true if it is a palindrome, or false otherwise.`,
      examples: `Example 1:
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.

Example 2:
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.

Example 3:
Input: s = " "
Output: true
Explanation: After removing non-alphanumeric characters, s is an empty string "" which is a palindrome.`,
      constraints: `• 1 <= s.length <= 2 * 10^5
• s consists only of printable ASCII characters`,
      approach: `You can solve this using:
- Two Pointers: Compare characters from both ends
- String Processing: Clean string then compare with reverse`,
      timeComplexity: "O(n) where n is string length",
      spaceComplexity: "O(1) using two pointers",
      initialCode: {
        javascript: "function isPalindrome(s) {\n  // Write your solution here\n  \n}",
        python: "def is_palindrome(s):\n    # Write your solution here\n    pass",
        java: "public boolean isPalindrome(String s) {\n    // Write your solution here\n    \n}"
      },
      difficulty: 'entry',
      category: ['string', 'two-pointers', 'general']
    },
    // Mid Level
    {
      title: "Longest Palindromic Substring",
      description: `Given a string s, return the longest palindromic substring in s.

A palindrome is a string that reads the same forward and backward. For example, "racecar" and "noon" are palindromes.`,
      examples: `Example 1:
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.

Example 2:
Input: s = "cbbd"
Output: "bb"

Example 3:
Input: s = "a"
Output: "a"

Example 4:
Input: s = "ac"
Output: "a"
Explanation: Both "a" and "c" are palindromic substrings of length 1.`,
      constraints: `• 1 <= s.length <= 1000
• s consists of only digits and English letters`,
      approach: `You can solve this problem using various techniques:
- Expand Around Center: For each character, expand outward to find palindromes
- Dynamic Programming: Build a table to track palindromic substrings
- Manacher's Algorithm: Optimal O(n) solution for advanced implementation`,
      timeComplexity: "O(n²) or better",
      spaceComplexity: "O(1) preferred",
      initialCode: {
        javascript: "function longestPalindrome(s) {\n  // Write your solution here\n  \n}",
        python: "def longest_palindrome(s):\n    # Write your solution here\n    pass",
        java: "public String longestPalindrome(String s) {\n    // Write your solution here\n    \n}"
      },
      difficulty: 'mid',
      category: ['string', 'dynamic-programming', 'general']
    },
    {
      title: "Product of Array Except Self",
      description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.`,
      examples: `Example 1:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]

Example 2:
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]`,
      constraints: `• 2 <= nums.length <= 10^5
• -30 <= nums[i] <= 30
• The product of any prefix or suffix of nums fits in a 32-bit integer`,
      approach: `You can solve this using:
- Prefix and Suffix Products: Calculate products from left and right
- Single Pass Optimization: Combine prefix/suffix in one iteration`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1) excluding output array",
      initialCode: {
        javascript: "function productExceptSelf(nums) {\n  // Write your solution here\n  \n}",
        python: "def product_except_self(nums):\n    # Write your solution here\n    pass",
        java: "public int[] productExceptSelf(int[] nums) {\n    // Write your solution here\n    \n}"
      },
      difficulty: 'mid',
      category: ['arrays', 'prefix-sum', 'general']
    },
    // Senior Level
    {
      title: "LRU Cache",
      description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
- LRUCache(int capacity): Initialize the LRU cache with positive size capacity.
- int get(int key): Return the value of the key if exists, otherwise return -1.
- void put(int key, int value): Update the value of the key if exists. Otherwise, add the key-value pair. If the number of keys exceeds the capacity, evict the least recently used key.

The functions get and put must each run in O(1) average time complexity.`,
      examples: `Example 1:
Input:
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
Output:
[null, null, null, 1, null, -1, null, -1, 3, 4]

Explanation:
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4`,
      constraints: `• 1 <= capacity <= 3000
• 0 <= key <= 10^4
• 0 <= value <= 10^5
• At most 2 * 10^5 calls will be made to get and put`,
      approach: `Optimal solution requires:
- Hash Map: For O(1) key lookup
- Doubly Linked List: For O(1) insertion/deletion and tracking order
- Combined approach ensures both operations run in O(1)`,
      timeComplexity: "O(1) for both get and put operations",
      spaceComplexity: "O(capacity) for storing cache entries",
      initialCode: {
        javascript: "class LRUCache {\n  constructor(capacity) {\n    // Initialize your data structure here\n  }\n  \n  get(key) {\n    // Write your solution here\n  }\n  \n  put(key, value) {\n    // Write your solution here\n  }\n}",
        python: "class LRUCache:\n    def __init__(self, capacity):\n        # Initialize your data structure here\n        pass\n    \n    def get(self, key):\n        # Write your solution here\n        pass\n    \n    def put(self, key, value):\n        # Write your solution here\n        pass",
        java: "class LRUCache {\n    public LRUCache(int capacity) {\n        // Initialize your data structure here\n    }\n    \n    public int get(int key) {\n        // Write your solution here\n    }\n    \n    public void put(int key, int value) {\n        // Write your solution here\n    }\n}"
      },
      difficulty: 'senior',
      category: ['design', 'hash-table', 'linked-list', 'general']
    }
  ],

  // ============================================
  // DATA ENGINEER / BI / DATA SCIENTIST PROBLEMS
  // ============================================
  'data-engineer': [
    {
      title: "Calculate Median of Dataset",
      description: `Given an array of numbers representing a dataset, write a function to calculate and return the median value.

The median is the middle value in a sorted list. If the list has an even number of elements, the median is the average of the two middle values.`,
      examples: `Example 1:
Input: data = [3, 1, 4, 1, 5, 9, 2, 6]
Output: 3.5
Explanation: Sorted: [1, 1, 2, 3, 4, 5, 6, 9]. Middle values: 3 and 4. Median = (3 + 4) / 2 = 3.5

Example 2:
Input: data = [1, 2, 3, 4, 5]
Output: 3
Explanation: Sorted: [1, 2, 3, 4, 5]. Middle value: 3

Example 3:
Input: data = [10]
Output: 10`,
      constraints: `• 1 <= data.length <= 10^5
• -10^9 <= data[i] <= 10^9`,
      approach: `You can solve this using:
- Sorting: Sort array and find middle element(s)
- QuickSelect: Find median in O(n) average time
- Heaps: Maintain two heaps for streaming data`,
      timeComplexity: "O(n log n) with sorting, O(n) average with QuickSelect",
      spaceComplexity: "O(1) to O(n) depending on approach",
      initialCode: {
        javascript: "function calculateMedian(data) {\n  // Write your solution here\n  \n}",
        python: "def calculate_median(data):\n    # Write your solution here\n    pass",
        java: "public double calculateMedian(int[] data) {\n    // Write your solution here\n    \n}"
      },
      difficulty: 'entry',
      category: ['data-analysis', 'statistics', 'sorting']
    },
    {
      title: "Moving Average for Time Series",
      description: `Given a time series of data points and a window size k, calculate the moving average for each position.

A moving average is the average of the current value and the (k-1) previous values. For positions where there aren't enough previous values, use all available values.`,
      examples: `Example 1:
Input: data = [1, 3, 5, 7, 9, 11], k = 3
Output: [1, 2, 3, 5, 7, 9]
Explanation:
Position 0: avg([1]) = 1
Position 1: avg([1, 3]) = 2
Position 2: avg([1, 3, 5]) = 3
Position 3: avg([3, 5, 7]) = 5
Position 4: avg([5, 7, 9]) = 7
Position 5: avg([7, 9, 11]) = 9

Example 2:
Input: data = [10, 20, 30, 40, 50], k = 2
Output: [10, 15, 25, 35, 45]`,
      constraints: `• 1 <= data.length <= 10^5
• 1 <= k <= data.length
• -10^9 <= data[i] <= 10^9`,
      approach: `Efficient approaches:
- Sliding Window: Maintain sum of k elements
- Deque: For weighted moving averages
- Cumulative Sum: Precompute for faster queries`,
      timeComplexity: "O(n) with sliding window",
      spaceComplexity: "O(1) excluding output array",
      initialCode: {
        javascript: "function movingAverage(data, k) {\n  // Write your solution here\n  \n}",
        python: "def moving_average(data, k):\n    # Write your solution here\n    pass",
        java: "public double[] movingAverage(int[] data, int k) {\n    // Write your solution here\n    \n}"
      },
      difficulty: 'mid',
      category: ['time-series', 'sliding-window', 'data-analysis']
    },
    {
      title: "Top K Frequent Items",
      description: `Given a large dataset represented as an array of items, find the k most frequent items.

Return the result in descending order of frequency. If two items have the same frequency, order by their value.`,
      examples: `Example 1:
Input: items = [1,1,1,2,2,3,3,3,3,4], k = 2
Output: [3, 1]
Explanation: 3 appears 4 times, 1 appears 3 times

Example 2:
Input: items = ["apple","banana","apple","orange","banana","apple"], k = 2
Output: ["apple", "banana"]

Example 3:
Input: items = [1,2,3,4,5], k = 3
Output: [1, 2, 3]
Explanation: All have frequency 1, return first k by value`,
      constraints: `• 1 <= items.length <= 10^6
• 1 <= k <= number of unique items
• Items can be integers or strings`,
      approach: `Optimal solutions:
- Hash Map + Heap: Count frequencies, then use min-heap for top k
- Bucket Sort: Group by frequency for O(n) solution
- QuickSelect: Partition by frequency for O(n) average case`,
      timeComplexity: "O(n log k) with heap, O(n) with bucket sort",
      spaceComplexity: "O(n) for frequency map",
      initialCode: {
        javascript: "function topKFrequent(items, k) {\n  // Write your solution here\n  \n}",
        python: "def top_k_frequent(items, k):\n    # Write your solution here\n    pass",
        java: "public List<Object> topKFrequent(Object[] items, int k) {\n    // Write your solution here\n    \n}"
      },
      difficulty: 'senior',
      category: ['hash-table', 'heap', 'frequency-analysis', 'data-analysis']
    }
  ],

  // ============================================
  // DEVOPS / SRE PROBLEMS
  // ============================================
  'devops': [
    {
      title: "Log Parser - Extract Error Messages",
      description: `Given a log file represented as an array of log lines, write a function to extract all error messages.

Each log line follows the format: "[TIMESTAMP] LEVEL: Message"
- Extract lines where LEVEL is "ERROR"
- Return an array of objects with timestamp and error message`,
      examples: `Example 1:
Input: logs = [
  "[2024-01-15 10:30:45] INFO: Application started",
  "[2024-01-15 10:31:12] ERROR: Database connection failed",
  "[2024-01-15 10:31:15] WARN: Retrying connection",
  "[2024-01-15 10:31:20] ERROR: Authentication timeout"
]
Output: [
  { timestamp: "2024-01-15 10:31:12", message: "Database connection failed" },
  { timestamp: "2024-01-15 10:31:20", message: "Authentication timeout" }
]

Example 2:
Input: logs = [
  "[2024-01-15 09:00:00] INFO: Server healthy",
  "[2024-01-15 09:05:00] INFO: Request processed"
]
Output: []`,
      constraints: `• 1 <= logs.length <= 10^5
• Each log line follows the specified format
• Timestamps are in YYYY-MM-DD HH:MM:SS format`,
      approach: `You can solve this using:
- Regular Expressions: Parse log format efficiently
- String Splitting: Extract components manually
- Consider edge cases like malformed logs`,
      timeComplexity: "O(n * m) where n is number of logs, m is average log length",
      spaceComplexity: "O(k) where k is number of error logs",
      initialCode: {
        javascript: "function extractErrors(logs) {\n  // Write your solution here\n  \n}",
        python: "def extract_errors(logs):\n    # Write your solution here\n    pass",
        java: "public List<Map<String, String>> extractErrors(String[] logs) {\n    // Write your solution here\n    \n}"
      },
      difficulty: 'entry',
      category: ['string-parsing', 'regex', 'logging', 'devops']
    },
    {
      title: "Rate Limiter - Sliding Window",
      description: `Implement a rate limiter using the sliding window algorithm.

The rate limiter should:
- Allow maximum 'limit' requests within a 'windowMs' millisecond window
- Track requests per user/client ID
- Return true if request is allowed, false if rate limit exceeded

Use the sliding window log algorithm for accuracy.`,
      examples: `Example 1:
RateLimiter limiter = new RateLimiter(3, 1000); // 3 requests per second

limiter.allowRequest("user1", 0);    // true (1st request)
limiter.allowRequest("user1", 100);  // true (2nd request)
limiter.allowRequest("user1", 200);  // true (3rd request)
limiter.allowRequest("user1", 300);  // false (limit reached)
limiter.allowRequest("user1", 1100); // true (window slid, old requests expired)

Example 2:
RateLimiter limiter = new RateLimiter(5, 60000); // 5 requests per minute

limiter.allowRequest("user2", 0);     // true
limiter.allowRequest("user2", 1000);  // true
limiter.allowRequest("user3", 2000);  // true (different user)`,
      constraints: `• 1 <= limit <= 1000
• 100 <= windowMs <= 3600000 (1 hour)
• 1 <= number of users <= 10^5
• Timestamps are in milliseconds`,
      approach: `Efficient implementation strategies:
- Sliding Window Log: Store timestamps, remove expired ones
- Sliding Window Counter: More memory efficient, slightly less accurate
- Token Bucket: Alternative algorithm for burst handling`,
      timeComplexity: "O(n) per request where n is requests in window",
      spaceComplexity: "O(u * n) where u is users, n is requests per window",
      initialCode: {
        javascript: "class RateLimiter {\n  constructor(limit, windowMs) {\n    // Initialize your data structure\n  }\n  \n  allowRequest(userId, timestamp) {\n    // Write your solution here\n  }\n}",
        python: "class RateLimiter:\n    def __init__(self, limit, window_ms):\n        # Initialize your data structure\n        pass\n    \n    def allow_request(self, user_id, timestamp):\n        # Write your solution here\n        pass",
        java: "class RateLimiter {\n    public RateLimiter(int limit, int windowMs) {\n        // Initialize your data structure\n    }\n    \n    public boolean allowRequest(String userId, long timestamp) {\n        // Write your solution here\n    }\n}"
      },
      difficulty: 'mid',
      category: ['rate-limiting', 'sliding-window', 'system-design', 'devops']
    },
    {
      title: "Distributed Lock Manager",
      description: `Design and implement a distributed lock manager for coordinating deployment across multiple servers.

Your lock manager should support:
- acquireLock(resourceId, clientId, ttl): Acquire lock with time-to-live
- releaseLock(resourceId, clientId): Release lock if owned by client
- renewLock(resourceId, clientId, ttl): Extend lock duration
- isLocked(resourceId): Check if resource is currently locked

Handle edge cases:
- Lock expiration (TTL)
- Client crashes (stale locks)
- Lock reentrance
- Prevent deadlocks`,
      examples: `Example 1:
LockManager lm = new LockManager();

lm.acquireLock("deploy-prod", "server1", 5000);  // true (acquired)
lm.acquireLock("deploy-prod", "server2", 5000);  // false (already locked)
lm.isLocked("deploy-prod");                      // true
lm.releaseLock("deploy-prod", "server1");        // true (released)
lm.acquireLock("deploy-prod", "server2", 5000);  // true (now available)

Example 2 (TTL expiration):
lm.acquireLock("deploy-staging", "server1", 1000); // true
// Wait 1500ms
lm.isLocked("deploy-staging");                     // false (expired)
lm.acquireLock("deploy-staging", "server2", 1000); // true (can acquire)

Example 3 (Wrong owner):
lm.acquireLock("resource1", "client1", 5000);  // true
lm.releaseLock("resource1", "client2");        // false (not owner)`,
      constraints: `• 1 <= resourceId.length <= 100
• 1 <= clientId.length <= 100
• 100 <= ttl <= 300000 (5 minutes)
• Support up to 10^4 concurrent locks`,
      approach: `Implementation considerations:
- Hash Map: Track lock ownership and expiration
- Cleanup Strategy: Remove expired locks efficiently
- Thread Safety: Handle concurrent access (if needed)
- Fencing Tokens: Prevent stale lock usage
- Redlock Algorithm: For true distributed consensus (advanced)`,
      timeComplexity: "O(1) for all operations with proper cleanup",
      spaceComplexity: "O(n) where n is number of active locks",
      initialCode: {
        javascript: "class LockManager {\n  constructor() {\n    // Initialize your data structure\n  }\n  \n  acquireLock(resourceId, clientId, ttl) {\n    // Write your solution here\n  }\n  \n  releaseLock(resourceId, clientId) {\n    // Write your solution here\n  }\n  \n  renewLock(resourceId, clientId, ttl) {\n    // Write your solution here\n  }\n  \n  isLocked(resourceId) {\n    // Write your solution here\n  }\n}",
        python: "class LockManager:\n    def __init__(self):\n        # Initialize your data structure\n        pass\n    \n    def acquire_lock(self, resource_id, client_id, ttl):\n        # Write your solution here\n        pass\n    \n    def release_lock(self, resource_id, client_id):\n        # Write your solution here\n        pass\n    \n    def renew_lock(self, resource_id, client_id, ttl):\n        # Write your solution here\n        pass\n    \n    def is_locked(self, resource_id):\n        # Write your solution here\n        pass",
        java: "class LockManager {\n    public LockManager() {\n        // Initialize your data structure\n    }\n    \n    public boolean acquireLock(String resourceId, String clientId, int ttl) {\n        // Write your solution here\n    }\n    \n    public boolean releaseLock(String resourceId, String clientId) {\n        // Write your solution here\n    }\n    \n    public boolean renewLock(String resourceId, String clientId, int ttl) {\n        // Write your solution here\n    }\n    \n    public boolean isLocked(String resourceId) {\n        // Write your solution here\n    }\n}"
      },
      difficulty: 'senior',
      category: ['distributed-systems', 'locking', 'concurrency', 'devops']
    }
  ]
};

// Function to get a random problem based on role and difficulty
export function getRandomProblem(jobRole: string, difficulty: 'entry' | 'mid' | 'senior'): CodingProblem {
  // Map job roles to problem categories
  const roleMapping: Record<string, string> = {
    'bi': 'data-engineer',
    'data-engineer': 'data-engineer',
    'data-scientist': 'data-engineer',
    'devops': 'devops',
    'sre': 'devops',
    'security': 'devops',
    'frontend': 'general',
    'backend': 'general',
    'fullstack': 'general',
    'mobile': 'general',
    'general': 'general'
  };

  const category = roleMapping[jobRole] || 'general';
  const problems = CODING_PROBLEMS[category] || CODING_PROBLEMS.general;

  // Filter by difficulty
  const filteredProblems = problems.filter(p => p.difficulty === difficulty);

  // If no problems match the difficulty, use any from the category
  const availableProblems = filteredProblems.length > 0 ? filteredProblems : problems;

  // Return random problem
  return availableProblems[Math.floor(Math.random() * availableProblems.length)];
}

// Format problem for display in CodeEditor
export function formatProblemDescription(problem: CodingProblem): string {
  return `${problem.title}

${problem.description}


Examples:

${problem.examples}


Constraints:

${problem.constraints}


Expected Approach:

${problem.approach}

Time Complexity: ${problem.timeComplexity}
Space Complexity: ${problem.spaceComplexity}`;
}

// Get initial code for selected language
export function getInitialCode(problem: CodingProblem, language: string): string {
  const langMap: Record<string, keyof typeof problem.initialCode> = {
    'javascript': 'javascript',
    'typescript': 'javascript', // Use JS template for TS
    'python': 'python',
    'java': 'java'
  };

  const mappedLang = langMap[language.toLowerCase()] || 'javascript';
  return problem.initialCode[mappedLang];
}
