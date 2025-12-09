#!/bin/bash

# Script to set up git hooks for the repository

# Create the pre-commit hook
HOOK_FILE=".git/hooks/pre-commit"

cat > "$HOOK_FILE" << 'EOF'
#!/bin/sh

# Pre-commit hook to prevent committing secrets

# Pattern matching for common secrets
SECRET_PATTERNS=(
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
    "PRIVATE_KEY"
    "SECRET_KEY"
    "API_KEY"
    "BEARER_TOKEN"
    "PASSWORD"
    "PASSPHRASE"
)

# Check for common secret patterns in staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR)
for file in $STAGED_FILES; do
    # Skip if file does not exist
    [ -f "$file" ] || continue
    
    for pattern in "${SECRET_PATTERNS[@]}"; do
        if grep -i "$pattern" "$file" >/dev/null 2>&1; then
            echo "WARNING: Potential secret ($pattern) found in $file"
            echo "Please remove or properly secure before committing."
        fi
    done
done

echo "Pre-commit checks passed."
exit 0
EOF

# Make the hook executable
chmod +x "$HOOK_FILE"

echo "Git pre-commit hook installed successfully!"
echo "This hook will warn you about potential secrets in your commits."