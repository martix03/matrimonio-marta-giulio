#!/usr/bin/env python3
import os
import sys
import json
import uuid
import hashlib
import mimetypes
import urllib.request
import urllib.error

API_KEY = os.environ.get('SHIP_TOKEN', 'ship-0fad9b8f3f00a624b43c6d6a20b1ea88')
DOMAIN = os.environ.get('SHIP_DOMAIN', 'martaegiulio2027.shipstatic.com')

script_dir = os.path.dirname(os.path.abspath(__file__))
dist_dir = os.path.abspath(os.path.join(script_dir, '..', 'dist'))

if not os.path.isdir(dist_dir):
    print(f"Errore: la cartella {dist_dir} non esiste. Esegui prima 'npm run build'.")
    sys.exit(1)

print(f"📦 Preparazione deploy da: {dist_dir}")
print(f"🌐 Dominio di destinazione: {DOMAIN}")

files_to_upload = []
checksums = []

for root, _, files in os.walk(dist_dir):
    for f in sorted(files):
        if f.startswith('.'):
            continue
        abs_path = os.path.join(root, f)
        rel_path = os.path.relpath(abs_path, dist_dir)
        files_to_upload.append((rel_path, abs_path))

boundary = '----ShipStaticBoundary' + uuid.uuid4().hex
body = bytearray()

for rel_path, abs_path in files_to_upload:
    with open(abs_path, 'rb') as fp:
        data = fp.read()
    checksums.append(hashlib.md5(data).hexdigest())

    mime, _ = mimetypes.guess_type(abs_path)
    if not mime:
        mime = 'application/octet-stream'

    body.extend(f'--{boundary}\r\n'.encode('utf-8'))
    body.extend(f'Content-Disposition: form-data; name="files[]"; filename="{rel_path}"\r\n'.encode('utf-8'))
    body.extend(f'Content-Type: {mime}\r\n\r\n'.encode('utf-8'))
    body.extend(data)
    body.extend(b'\r\n')

body.extend(f'--{boundary}\r\n'.encode('utf-8'))
body.extend(b'Content-Disposition: form-data; name="checksums"\r\n\r\n')
body.extend(json.dumps(checksums).encode('utf-8'))
body.extend(b'\r\n')
body.extend(f'--{boundary}--\r\n'.encode('utf-8'))

print(f"🚀 Caricamento di {len(files_to_upload)} file su ShipStatic...")

req = urllib.request.Request(
    'https://api.shipstatic.com/deployments',
    data=bytes(body),
    headers={
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': f'multipart/form-data; boundary={boundary}',
        'User-Agent': 'ShipStatic-WeddingDeploy/1.0'
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        deployment_id = res.get('deployment')
        live_url = res.get('url')
        print(f"✅ Deployment completato: {deployment_id}")
        print(f"🔗 URL anteprima: {live_url}")
except urllib.error.HTTPError as e:
    print(f"❌ Errore upload ({e.code}): {e.read().decode('utf-8')}")
    sys.exit(1)

print(f"🔗 Collegamento della deployment a {DOMAIN}...")
put_data = json.dumps({'deployment': deployment_id}).encode('utf-8')
put_req = urllib.request.Request(
    f'https://api.shipstatic.com/domains/{DOMAIN}',
    data=put_data,
    headers={
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json',
        'User-Agent': 'ShipStatic-WeddingDeploy/1.0'
    },
    method='PUT'
)

try:
    with urllib.request.urlopen(put_req) as resp:
        print(f"🎉 Successo! Il sito è ora attivo su https://{DOMAIN}/")
except urllib.error.HTTPError as e:
    print(f"❌ Errore collegamento dominio ({e.code}): {e.read().decode('utf-8')}")
    sys.exit(1)
