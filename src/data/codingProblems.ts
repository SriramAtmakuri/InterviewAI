import { CodingProblem } from '@/types/codingProblem';

export const codingProblems: CodingProblem[] = [
  // Easy Problems
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: ['Array', 'Hash Table'],
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] == 6',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] == 6',
      },
    ],
    constraints: [
      { description: '2 <= nums.length <= 10⁴' },
      { description: '-10⁹ <= nums[i] <= 10⁹' },
      { description: '-10⁹ <= target <= 10⁹' },
      { description: 'Only one valid answer exists.' },
    ],
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
      { input: '[3,3], 6', expectedOutput: '[0,1]' },
      { input: '[1,5,3,7,9], 10', expectedOutput: '[1,3]', hidden: true },
    ],
    hints: [
      'A brute force approach would be to check every pair. Can you do better?',
      'Think about using a hash table to store complements.',
      'For each number, check if (target - number) exists in the hash table.',
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function twoSum(nums, target) {
  // Write your solution here

}`,
      },
      {
        language: 'python',
        code: `def twoSum(nums, target):
    # Write your solution here
    pass`,
      },
      {
        language: 'java',
        code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here

    }
}`,
      },
    ],
    solution: {
      approach: 'Use a hash table to store values and their indices. For each number, check if (target - number) exists in the hash table.',
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
      },
      code: [
        {
          language: 'javascript',
          code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        },
      ],
    },
    companies: ['Amazon', 'Google', 'Microsoft', 'Apple', 'Facebook'],
    acceptanceRate: 49.2,
    relatedTopics: ['Hash Table', 'Array'],
    relatedProblems: ['3sum', '4sum', 'two-sum-ii'],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: ['Stack', 'String'],
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'The string contains valid parentheses.',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'All brackets are properly closed.',
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Brackets are not properly matched.',
      },
    ],
    constraints: [
      { description: '1 <= s.length <= 10⁴' },
      { description: 's consists of parentheses only \'()[]{}\'.' },
    ],
    testCases: [
      { input: '()', expectedOutput: 'true' },
      { input: '()[]{}', expectedOutput: 'true' },
      { input: '(]', expectedOutput: 'false' },
      { input: '([)]', expectedOutput: 'false' },
      { input: '{[]}', expectedOutput: 'true' },
      { input: '((', expectedOutput: 'false', hidden: true },
    ],
    hints: [
      'Use a stack data structure.',
      'When you see an opening bracket, push it to the stack.',
      'When you see a closing bracket, check if it matches the top of the stack.',
      'At the end, the stack should be empty.',
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function isValid(s) {
  // Write your solution here

}`,
      },
      {
        language: 'python',
        code: `def isValid(s):
    # Write your solution here
    pass`,
      },
    ],
    companies: ['Amazon', 'Microsoft', 'Bloomberg', 'Facebook'],
    acceptanceRate: 40.8,
    relatedTopics: ['Stack', 'String'],
    relatedProblems: ['generate-parentheses', 'longest-valid-parentheses'],
  },

  // Medium Problems
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: ['String', 'Sliding Window', 'Hash Table'],
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      { description: '0 <= s.length <= 5 * 10⁴' },
      { description: 's consists of English letters, digits, symbols and spaces.' },
    ],
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3' },
      { input: 'bbbbb', expectedOutput: '1' },
      { input: 'pwwkew', expectedOutput: '3' },
      { input: '', expectedOutput: '0', hidden: true },
      { input: 'dvdf', expectedOutput: '3', hidden: true },
    ],
    hints: [
      'Use a sliding window approach.',
      'Maintain a hash set of characters in the current window.',
      'When you find a duplicate, shrink the window from the left.',
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function lengthOfLongestSubstring(s) {
  // Write your solution here

}`,
      },
      {
        language: 'python',
        code: `def lengthOfLongestSubstring(s):
    # Write your solution here
    pass`,
      },
    ],
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple'],
    acceptanceRate: 33.5,
    relatedTopics: ['Sliding Window', 'Hash Table', 'String'],
  },
  {
    id: 'add-two-numbers',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    category: ['Linked List', 'Math', 'Recursion'],
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.',
      },
      {
        input: 'l1 = [0], l2 = [0]',
        output: '[0]',
        explanation: '0 + 0 = 0',
      },
      {
        input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
        output: '[8,9,9,9,0,0,0,1]',
        explanation: '9999999 + 9999 = 10009998',
      },
    ],
    constraints: [
      { description: 'The number of nodes in each linked list is in the range [1, 100].' },
      { description: '0 <= Node.val <= 9' },
      { description: 'It is guaranteed that the list represents a number that does not have leading zeros.' },
    ],
    testCases: [
      { input: '[2,4,3], [5,6,4]', expectedOutput: '[7,0,8]' },
      { input: '[0], [0]', expectedOutput: '[0]' },
      { input: '[9,9,9,9,9,9,9], [9,9,9,9]', expectedOutput: '[8,9,9,9,0,0,0,1]' },
    ],
    hints: [
      'Remember to handle the carry.',
      'Create a dummy head node to simplify code.',
      'Be careful when one list is longer than the other.',
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function ListNode(val, next) {
  this.val = (val===undefined ? 0 : val)
  this.next = (next===undefined ? null : next)
}

function addTwoNumbers(l1, l2) {
  // Write your solution here

}`,
      },
    ],
    companies: ['Amazon', 'Microsoft', 'Facebook', 'Apple'],
    acceptanceRate: 40.1,
    relatedTopics: ['Linked List', 'Math', 'Recursion'],
  },

  // Hard Problems
  {
    id: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: ['Array', 'Binary Search', 'Divide and Conquer'],
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.',
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.',
      },
    ],
    constraints: [
      { description: 'nums1.length == m' },
      { description: 'nums2.length == n' },
      { description: '0 <= m <= 1000' },
      { description: '0 <= n <= 1000' },
      { description: '1 <= m + n <= 2000' },
      { description: '-10⁶ <= nums1[i], nums2[i] <= 10⁶' },
    ],
    testCases: [
      { input: '[1,3], [2]', expectedOutput: '2.0' },
      { input: '[1,2], [3,4]', expectedOutput: '2.5' },
      { input: '[0,0], [0,0]', expectedOutput: '0.0', hidden: true },
    ],
    hints: [
      'Think about using binary search on the smaller array.',
      'The median divides the array into two equal halves.',
      'Use binary search to find the partition point.',
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here

}`,
      },
      {
        language: 'python',
        code: `def findMedianSortedArrays(nums1, nums2):
    # Write your solution here
    pass`,
      },
    ],
    companies: ['Google', 'Amazon', 'Microsoft', 'Facebook'],
    acceptanceRate: 36.8,
    relatedTopics: ['Array', 'Binary Search', 'Divide and Conquer'],
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.',
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
        explanation: '9 units of water can be trapped.',
      },
    ],
    constraints: [
      { description: 'n == height.length' },
      { description: '1 <= n <= 2 * 10⁴' },
      { description: '0 <= height[i] <= 10⁵' },
    ],
    testCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
      { input: '[4,2,0,3,2,5]', expectedOutput: '9' },
      { input: '[3,0,2,0,4]', expectedOutput: '7', hidden: true },
    ],
    hints: [
      'For each position, the water level is determined by the minimum of max height on left and right.',
      'Use two pointers from both ends.',
      'Move the pointer pointing to the lower height.',
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function trap(height) {
  // Write your solution here

}`,
      },
      {
        language: 'python',
        code: `def trap(height):
    # Write your solution here
    pass`,
      },
    ],
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple'],
    acceptanceRate: 59.8,
    relatedTopics: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
  },
];

export const getProblemById = (id: string): CodingProblem | undefined => {
  return codingProblems.find(p => p.id === id);
};

export const getProblemsByDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard'): CodingProblem[] => {
  return codingProblems.filter(p => p.difficulty === difficulty);
};

export const getProblemsByCategory = (category: string): CodingProblem[] => {
  return codingProblems.filter(p => p.category.includes(category));
};

export const getRandomProblem = (difficulty?: 'Easy' | 'Medium' | 'Hard'): CodingProblem => {
  const problems = difficulty ? getProblemsByDifficulty(difficulty) : codingProblems;
  return problems[Math.floor(Math.random() * problems.length)];
};
