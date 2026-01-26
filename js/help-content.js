/**
 * Help Content Configuration
 * Centralized location for all help text - easy to update without touching HTML
 */

const HELP_CONTENT = {
    'email-prefix': {
        hint: 'Auto-generated from your name. Use only letters, numbers, and dots.',
        title: 'Email Address Format',
        content: `
            <p>Your email is auto-generated from your full name, but you can edit the part before @zohocorp.com.</p>
            <ul>
                <li><strong>jasmine.frank</strong> - Recommended: firstname.lastname</li>
                <li><strong>jfrank</strong> - Alternative: first initial + last name</li>
                <li><strong>jasmine.frank2</strong> - If name is taken, add a number</li>
            </ul>
            <p><strong>Rules:</strong> Only lowercase letters, numbers, and dots. No dots at start, end, or in a row.</p>
        `
    },
    'phone': {
        hint: 'Format: +1 (555) 123-4567. Include country code for international colleagues.',
        title: 'Phone Number Format',
        content: `
            <p>Enter your phone number in any common format:</p>
            <ul>
                <li><strong>+1 (555) 123-4567</strong> - International (recommended)</li>
                <li><strong>512-555-1234</strong> - Local with area code</li>
                <li><strong>(512) 555-1234</strong> - With parentheses</li>
            </ul>
            <p><strong>Why?</strong> Including the country code helps international colleagues reach you easily.</p>
        `
    },
    'linkedin-username': {
        hint: 'Your username from your profile URL (the part after /in/).',
        title: 'Finding Your LinkedIn Username',
        content: `
            <p>Your LinkedIn username is in your profile URL:</p>
            <ol>
                <li>Visit <strong>LinkedIn</strong> and click your profile picture</li>
                <li>Look at the address bar: <strong>linkedin.com/in/yourname</strong></li>
                <li>Copy the text after <strong>/in/</strong> (just "yourname")</li>
            </ol>
            <p><strong>Example:</strong> If your URL is <code>linkedin.com/in/jasmine-frank-123</code>, enter <strong>jasmine-frank-123</strong></p>
        `
    },
    'twitter-username': {
        hint: 'Your handle without the @ symbol (e.g., zoho).',
        title: 'X (Twitter) Handle Format',
        content: `
            <p>Enter your X handle without the @ symbol:</p>
            <ul>
                <li><strong>zoho</strong> - Correct</li>
                <li><strong>@zoho</strong> - Incorrect (remove the @)</li>
            </ul>
            <p><strong>Why?</strong> The signature automatically adds x.com/ before your handle to create the full profile link.</p>
        `
    },
    'bookings-id': {
        hint: 'Your booking page ID from Zoho Bookings (found in Settings).',
        title: 'Finding Your Zoho Bookings ID',
        content: `
            <p>Your Bookings ID is in your booking page URL:</p>
            <ol>
                <li>Log in to <strong>Zoho Bookings</strong></li>
                <li>Go to <strong>Settings</strong> → <strong>Booking Page URL</strong></li>
                <li>Look for: <code>bookings.zoho.com/portal/<strong>yourname</strong></code></li>
                <li>Copy just the ID part (e.g., <strong>yourname</strong>)</li>
            </ol>
            <p><strong>Why?</strong> This creates a clickable link in your signature where people can book time with you.</p>
        `
    }
};
