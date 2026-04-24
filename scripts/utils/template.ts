import fs from 'fs';
import path from 'path';
import { templatesPath } from './config';

/**
 * Simple template engine — replaces {{var}} and handles {{#if var}}...{{/if}} blocks.
 */
export function render(templateFile: string, vars: Record<string, any>): string {
  const filePath = path.join(templatesPath(), templateFile);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Handle {{#if var}}...{{/if}} blocks
  content = content.replace(
    /\{\{#if (\w+)\}\}\n?([\s\S]*?)\{\{\/if\}\}\n?/g,
    (_, key, body) => (vars[key] ? body : '')
  );

  // Replace {{var}} placeholders
  content = content.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return vars[key] !== undefined ? String(vars[key]) : `{{${key}}}`;
  });

  return content;
}

export function writeTemplate(templateFile: string, destPath: string, vars: Record<string, any>): void {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const content = render(templateFile, vars);
  fs.writeFileSync(destPath, content);
}
