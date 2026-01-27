#!/bin/bash
# Baseline Screenshot Capture Script
# Purpose: Capture all form states for visual regression testing
# Created: 2026-01-26

set -e  # Exit on error

BASELINE_DIR="baseline-screenshots"
URL="https://tejasgadhia.github.io/zoho-signature-generator/"

echo "Starting baseline screenshot capture..."
echo "URL: $URL"
echo "Output directory: $BASELINE_DIR"
echo ""

# Open browser and wait for page load
echo "[1/8] Opening page..."
agent-browser open "$URL"
agent-browser wait --load networkidle
sleep 2  # Extra wait for animations

# 1. Initial empty form (light mode)
echo "[2/8] Capturing empty form (light mode)..."
agent-browser screenshot --full "$BASELINE_DIR/01-initial-empty-form.png"

# 2. All fields filled with valid data
echo "[3/8] Filling form with valid data..."
agent-browser snapshot -i > "$BASELINE_DIR/snapshot-initial.txt"

# Fill name field
agent-browser fill @e1 "John Doe"

# Fill title field
agent-browser fill @e2 "Senior Product Manager"

# Fill department field
agent-browser fill @e3 "Product Management"

# Fill email field (only prefix part)
agent-browser fill @e4 "john.doe"

# Fill phone field
agent-browser fill @e5 "+1 234 567 8900"

# Fill LinkedIn field
agent-browser fill @e6 "johndoe"

# Fill Twitter field
agent-browser fill @e7 "johndoe"

# Fill Bookings field
agent-browser fill @e8 "johndoe123"

sleep 1  # Wait for validation

echo "[4/8] Capturing filled form (all valid data)..."
agent-browser screenshot --full "$BASELINE_DIR/02-filled-valid-data.png"

# 3. Focus states (tab navigation)
echo "[5/8] Capturing focus state on first field..."
agent-browser click @e1
agent-browser screenshot --full "$BASELINE_DIR/03-focus-name-field.png"

# 4. Open help panel on email field
echo "[6/8] Capturing help panel expanded..."
agent-browser snapshot -i > "$BASELINE_DIR/snapshot-filled.txt"
# Find help icon for email field and click it
agent-browser find role button click --name "?"
sleep 0.5
agent-browser screenshot --full "$BASELINE_DIR/04-help-panel-expanded.png"

# 5. Error states (invalid email)
echo "[7/8] Creating error state (invalid phone)..."
agent-browser fill @e5 "invalid"
agent-browser click @e1  # Blur to trigger validation
sleep 0.5
agent-browser screenshot --full "$BASELINE_DIR/05-validation-error-phone.png"

# 6. Dark mode toggle (signature preview only)
echo "[8/8] Capturing dark mode preview..."
# Find and click theme toggle
agent-browser find role checkbox click --name "Dark Mode"
sleep 0.5
agent-browser screenshot --full "$BASELINE_DIR/06-dark-mode-preview.png"

# Close browser
echo ""
echo "Closing browser..."
agent-browser close

echo ""
echo "✓ Baseline screenshots captured successfully!"
echo "Output: $BASELINE_DIR/"
echo ""
echo "Files created:"
ls -lh "$BASELINE_DIR/" | tail -n +2

echo ""
echo "Next steps:"
echo "  1. Review screenshots to verify current working state"
echo "  2. Use these as baseline for comparison after CSS fixes"
echo "  3. After each fix, capture new screenshots and compare"
