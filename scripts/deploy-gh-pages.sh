#!/bin/bash
set -e

echo "📦 Build di produzione..."
export PATH="/Users/marta/.gemini/antigravity/scratch/node_dist/bin:$PATH"
npm run build

echo "🚀 Deploy su martaegiulio.it (GitHub Pages)..."
TREE=$(git write-tree --prefix=dist)
COMMIT=$(git commit-tree $TREE -p refs/remotes/origin/gh-pages -m "deploy: update martaegiulio.it")
git update-ref refs/heads/gh-pages $COMMIT
git push origin gh-pages

echo "🎉 Successo! Il sito è aggiornato su https://www.martaegiulio.it/"
