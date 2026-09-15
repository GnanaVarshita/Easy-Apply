import { GeneratedATSResume } from '@velmurugan/shared';

export interface PDFRenderOptions {
  theme?: 'classic' | 'modern' | 'minimal';
}

export function compileLaTeXTemplate(latexCode: string): string {
  // Cleans and normalizes LaTeX string for Overleaf or pdflatex
  return latexCode.trim();
}

export function getOverleafDirectLink(latexCode: string): string {
  const encoded = encodeURIComponent(latexCode);
  return `https://www.overleaf.com/docs?snip_uri=data:text/plain;charset=utf-8,${encoded}`;
}

export function formatATSResumeHTML(resume: GeneratedATSResume): string {
  return resume.pdfHtmlContent;
}
