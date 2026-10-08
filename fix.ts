import fs from 'fs';
function fixFile(path: string) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/const \{ settings \} = useSettings\(\);\n  const \{ settings \} = useSettings\(\);/g, 'const { settings } = useSettings();');
  content = content.replace(/import \{ settings \} from '..\/config\/wedding.config';/g, '');
  content = content.replace(/import \{ settings \} from '..\/..\/config\/wedding.config';/g, '');
  fs.writeFileSync(path, content);
}
['src/components/Footer.tsx', 'src/components/home/QuickFacts.tsx', 'src/components/Navbar.tsx'].forEach(fixFile);
