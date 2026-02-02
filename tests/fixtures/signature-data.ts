/**
 * Test Data Fixtures for Signature Generation
 * Provides standardized test data for comprehensive testing scenarios
 */

import type { FormData } from '../../src/types';

/**
 * Standard test data - typical use case
 */
export const standardData: FormData = {
  name: 'Jasmine Frank',
  title: 'Director of Marketing',
  department: 'Zoho One',
  email: 'jasmine.frank@zohocorp.com',
  phone: '+1 (281) 330-8004',
  linkedin: 'https://linkedin.com/in/jasminefrank',
  twitter: 'https://x.com/jasminefrank',
  bookings: 'https://bookings.zohocorp.com/#/jasminefrank',
  website: 'https://www.zoho.com'
};

/**
 * Long name test data - tests text overflow and wrapping
 */
export const longNameData: FormData = {
  name: 'Christopher Alexander Montgomery-Wellington Jr.',
  title: 'Senior Vice President of Strategic Product Development',
  department: 'Enterprise Solutions & Customer Success Division',
  email: 'christopher.montgomery-wellington@zohocorp.com',
  phone: '+1 (555) 123-4567 ext 8901',
  linkedin: 'https://linkedin.com/in/christopher-alexander-montgomery-wellington-jr',
  twitter: 'https://x.com/camontwellington',
  bookings: 'https://bookings.zohocorp.com/#/christopher-montgomery-wellington',
  website: 'https://www.zoho.com'
};

/**
 * All social channels enabled - tests full social media layout
 */
export const allSocialsData: FormData = {
  name: 'Samantha Chen',
  title: 'Social Media Manager',
  department: 'Marketing',
  email: 'samantha.chen@zohocorp.com',
  phone: '+1 (415) 555-0199',
  linkedin: 'https://linkedin.com/in/samanthachen',
  twitter: 'https://x.com/samanthachen',
  bookings: 'https://bookings.zohocorp.com/#/samantha',
  website: 'https://www.zoho.com'
};

/**
 * Minimal data - only required fields
 */
export const minimalData: FormData = {
  name: 'Alex Johnson',
  title: 'Engineer',
  department: '',
  email: 'alex.johnson@zohocorp.com',
  phone: '',
  linkedin: '',
  twitter: '',
  bookings: '',
  website: 'https://www.zoho.com'
};

/**
 * XSS attack test data - ensures HTML escaping works
 * CRITICAL: These should be escaped in the output
 */
export const xssData: FormData = {
  name: '<script>alert("xss")</script>',
  title: '<img src=x onerror=alert(1)>',
  department: '"><script>document.cookie</script>',
  email: 'test@zohocorp.com',
  phone: '<script>alert("phone")</script>',
  linkedin: 'javascript:alert(1)',
  twitter: 'https://x.com/<script>alert(1)</script>',
  bookings: 'data:text/html,<script>alert(1)</script>',
  website: 'https://www.zoho.com'
};

/**
 * Empty data - all fields empty (except website)
 */
export const emptyData: FormData = {
  name: '',
  title: '',
  department: '',
  email: '',
  phone: '',
  linkedin: '',
  twitter: '',
  bookings: '',
  website: 'https://www.zoho.com'
};

/**
 * Special characters test data
 */
export const specialCharsData: FormData = {
  name: "Jean-François O'Brien",
  title: 'VP of R&D',
  department: 'Technology & Innovation',
  email: 'jean.obrien@zohocorp.com',
  phone: '+33 1 23 45 67 89',
  linkedin: 'https://linkedin.com/in/jean-françois-obrien',
  twitter: 'https://x.com/jfobrien',
  bookings: 'https://bookings.zohocorp.com/#/jean-obrien',
  website: 'https://www.zoho.com'
};

/**
 * Unicode test data - emoji and non-Latin characters
 */
export const unicodeData: FormData = {
  name: '田中 太郎 (Taro Tanaka)',
  title: 'シニアエンジニア',
  department: 'Engineering 🚀',
  email: 'taro.tanaka@zohocorp.com',
  phone: '+81 3-1234-5678',
  linkedin: 'https://linkedin.com/in/tarotanaka',
  twitter: 'https://x.com/tarotanaka',
  bookings: 'https://bookings.zohocorp.com/#/taro',
  website: 'https://www.zoho.com'
};
