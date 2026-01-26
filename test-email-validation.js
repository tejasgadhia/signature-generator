// Automated test cases for email validation
console.log('🧪 Testing Email Auto-Lowercase and Validation\n');

const testCases = [
    // Auto-lowercase tests
    { input: 'JOHN.DOE', expected: 'john.doe', shouldPass: true, description: 'All uppercase' },
    { input: 'John.Doe', expected: 'john.doe', shouldPass: true, description: 'Mixed case' },
    { input: 'john.doe', expected: 'john.doe', shouldPass: true, description: 'Already lowercase' },

    // Special character rejections
    { input: 'john-doe', expected: 'john-doe', shouldPass: false, description: 'Hyphen (disallowed)' },
    { input: 'john_doe', expected: 'john_doe', shouldPass: false, description: 'Underscore (disallowed)' },
    { input: 'john+tag', expected: 'john+tag', shouldPass: false, description: 'Plus sign (disallowed)' },
    { input: 'john!doe', expected: 'john!doe', shouldPass: false, description: 'Exclamation (disallowed)' },
    { input: 'john#doe', expected: 'john#doe', shouldPass: false, description: 'Hash (disallowed)' },
    { input: 'john$doe', expected: 'john$doe', shouldPass: false, description: 'Dollar sign (disallowed)' },
    { input: 'john%doe', expected: 'john%doe', shouldPass: false, description: 'Percent (disallowed)' },
    { input: 'john&doe', expected: 'john&doe', shouldPass: false, description: 'Ampersand (disallowed)' },
    { input: 'john*doe', expected: 'john*doe', shouldPass: false, description: 'Asterisk (disallowed)' },
    { input: 'john@doe', expected: 'john@doe', shouldPass: false, description: 'At sign (disallowed)' },

    // Dot placement validation
    { input: '.john', expected: '.john', shouldPass: false, description: 'Leading dot' },
    { input: 'john.', expected: 'john.', shouldPass: false, description: 'Trailing dot' },
    { input: 'john..doe', expected: 'john..doe', shouldPass: false, description: 'Consecutive dots' },

    // Length validation
    { input: 'j', expected: 'j', shouldPass: false, description: 'Single character (too short)' },
    { input: 'a.', expected: 'a.', shouldPass: false, description: 'Too short + trailing dot' },

    // Valid cases
    { input: 'john.doe', expected: 'john.doe', shouldPass: true, description: 'Standard format' },
    { input: 'j.smith', expected: 'j.smith', shouldPass: true, description: 'Single initial' },
    { input: 'john123', expected: 'john123', shouldPass: true, description: 'With numbers' },
    { input: 'john.middle.doe', expected: 'john.middle.doe', shouldPass: true, description: 'Multiple dots' },
    { input: 'jasmine.frank', expected: 'jasmine.frank', shouldPass: true, description: 'Auto-generated format' },
];

let passedTests = 0;
let failedTests = 0;

// Run tests
testCases.forEach((test, index) => {
    const input = document.getElementById('email-prefix');
    if (!input) {
        console.error('❌ Email prefix input not found!');
        return;
    }

    // Set value and trigger blur
    input.value = test.input;
    input.dispatchEvent(new Event('blur', { bubbles: true }));

    // Wait a moment for async processing
    setTimeout(() => {
        const finalValue = input.value;
        const hasError = input.getAttribute('aria-invalid') === 'true';
        const valueMatches = finalValue === test.expected;
        const errorStateCorrect = hasError !== test.shouldPass;
        const passed = valueMatches && errorStateCorrect;

        if (passed) {
            passedTests++;
            console.log(`✅ Test ${index + 1}: ${test.description}`);
        } else {
            failedTests++;
            console.log(`❌ Test ${index + 1}: ${test.description}`, {
                input: test.input,
                expected: test.expected,
                actual: finalValue,
                shouldPass: test.shouldPass,
                hasError: hasError,
                valueMatches: valueMatches,
                errorStateCorrect: errorStateCorrect
            });
        }

        // Print summary after last test
        if (index === testCases.length - 1) {
            setTimeout(() => {
                console.log(`\n📊 Test Summary: ${passedTests}/${testCases.length} passed, ${failedTests} failed`);
                if (failedTests === 0) {
                    console.log('🎉 All tests passed!');
                } else {
                    console.log('⚠️  Some tests failed. Review output above.');
                }
            }, 100);
        }
    }, 10);
});
