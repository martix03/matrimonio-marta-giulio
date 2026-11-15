#!/usr/bin/env python3
import os
import subprocess
import sys

print("⚠️ Deploy su ShipStatic disabilitato.")
print("🚀 Esecuzione deploy su https://www.martaegiulio.it/ (GitHub Pages)...")

script_dir = os.path.dirname(os.path.abspath(__file__))
gh_deploy = os.path.join(script_dir, "deploy-gh-pages.sh")

ret = subprocess.call(["bash", gh_deploy])
sys.exit(ret)

