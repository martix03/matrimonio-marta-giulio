import fs from 'fs';
const files = [
  'src/components/home/QuickFacts.tsx',
  'src/components/Footer.tsx',
  'src/components/Navbar.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("import { weddingConfig } from '../../config/wedding.config';", "import { useSettings } from '../../contexts/SettingsContext';");
  
  if (file.includes('QuickFacts')) {
    content = content.replace("export const QuickFacts: React.FC = () => {", "export const QuickFacts: React.FC = () => {\n  const { settings } = useSettings();");
    content = content.replace(/weddingConfig/g, "settings");
  } else if (file.includes('Footer')) {
    content = content.replace("export const Footer: React.FC = () => {", "export const Footer: React.FC = () => {\n  const { settings } = useSettings();");
    content = content.replace(/weddingConfig/g, "settings");
  } else if (file.includes('Navbar')) {
    content = content.replace("export const Navbar: React.FC<NavbarProps> = ({ cluster, onOpenAuth, onLogout }) => {", "export const Navbar: React.FC<NavbarProps> = ({ cluster, onOpenAuth, onLogout }) => {\n  const { settings } = useSettings();");
    content = content.replace(/weddingConfig/g, "settings");
  }
  
  fs.writeFileSync(file, content);
}
