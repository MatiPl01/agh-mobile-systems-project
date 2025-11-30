#!/bin/bash
if [ -d '.git' ] && [ -d '.husky' ]; then
  find .husky -type f -name "*" ! -name ".*" -exec chmod +x {} \; 2>/dev/null || true
fi
