import { promises as fs } from 'fs';
import path from 'path';

export type GuideCategory = 'exam' | 'vaccine' | 'lab' | 'imaging' | 'dental' | 'surgery' | 'medication';
export type GuideSpecies = 'dog' | 'cat' | 'all';

export type GuideFrontmatter = {
  title: string;
  slug: string;
  category: GuideCategory;
  species: GuideSpecies;
  description: string;
  keywords: string[];
  publishedAt: string;
};

export type GuidePost = GuideFrontmatter & {
  content: string;
  html: string;
};

const guidesDirectory = path.join(process.cwd(), 'src/content/guides');

const CATEGORY_LABELS: Record<GuideCategory, string> = {
  exam: '진찰료',
  vaccine: '예방접종',
  lab: '혈액검사',
  imaging: '영상검사',
  dental: '치과',
  surgery: '수술',
  medication: '투약'
};

export const guideCategoryLabels = CATEGORY_LABELS;

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const parseFrontmatter = (fileContent: string): { frontmatter: GuideFrontmatter; content: string } => {
  const sections = fileContent.split('---');

  if (sections.length < 3 || sections[0].trim() !== '') {
    throw new Error('Invalid markdown frontmatter format.');
  }

  const frontmatterRaw = sections[1].trim();
  const content = sections.slice(2).join('---').trim();

  const record = Object.fromEntries(
    frontmatterRaw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [key, ...rest] = line.split(':');
        return [key.trim(), rest.join(':').trim()];
      })
  );

  const keywordsValue = record.keywords ?? '[]';
  const keywords = keywordsValue
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((tag) => tag.trim().replace(/^"|"$/g, ''))
    .filter(Boolean);

  const frontmatter: GuideFrontmatter = {
    title: (record.title ?? '').replace(/^"|"$/g, ''),
    slug: (record.slug ?? '').replace(/^"|"$/g, ''),
    category: (record.category ?? '').replace(/^"|"$/g, '') as GuideCategory,
    species: (record.species ?? '').replace(/^"|"$/g, '') as GuideSpecies,
    description: (record.description ?? '').replace(/^"|"$/g, ''),
    publishedAt: (record.publishedAt ?? '').replace(/^"|"$/g, ''),
    keywords
  };

  if (!frontmatter.title || !frontmatter.slug || !frontmatter.category || !frontmatter.description) {
    throw new Error('Missing required guide frontmatter field.');
  }

  return { frontmatter, content };
};

const renderInlineMarkdown = (line: string): string => {
  const escaped = escapeHtml(line);

  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="text-[#F97316] underline" target="_blank" rel="noreferrer">$1</a>'
    );
};

const renderMarkdownToHtml = (markdown: string): string => {
  const lines = markdown.split('\n');
  const html: string[] = [];
  let isListOpen = false;

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      if (isListOpen) {
        html.push('</ul>');
        isListOpen = false;
      }
      return;
    }

    if (trimmed.startsWith('## ')) {
      if (isListOpen) {
        html.push('</ul>');
        isListOpen = false;
      }
      html.push(`<h2 class="mt-8 text-2xl font-bold text-[#4F2A1D]">${renderInlineMarkdown(trimmed.slice(3))}</h2>`);
      return;
    }

    if (trimmed.startsWith('### ')) {
      if (isListOpen) {
        html.push('</ul>');
        isListOpen = false;
      }
      html.push(`<h3 class="mt-6 text-xl font-bold text-[#4F2A1D]">${renderInlineMarkdown(trimmed.slice(4))}</h3>`);
      return;
    }

    if (trimmed.startsWith('- ')) {
      if (!isListOpen) {
        html.push('<ul class="ml-5 mt-3 list-disc space-y-1 text-[#2D2D2D]">');
        isListOpen = true;
      }
      html.push(`<li>${renderInlineMarkdown(trimmed.slice(2))}</li>`);
      return;
    }

    if (isListOpen) {
      html.push('</ul>');
      isListOpen = false;
    }

    html.push(`<p class="mt-4 leading-relaxed text-[#2D2D2D]">${renderInlineMarkdown(trimmed)}</p>`);
  });

  if (isListOpen) {
    html.push('</ul>');
  }

  return html.join('');
};

const sortByPublishedAtDesc = (a: GuideFrontmatter, b: GuideFrontmatter): number =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

export const getAllGuides = async (): Promise<GuideFrontmatter[]> => {
  const fileNames = await fs.readdir(guidesDirectory);
  const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));

  const guides = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const filePath = path.join(guidesDirectory, fileName);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { frontmatter } = parseFrontmatter(fileContent);
      return frontmatter;
    })
  );

  return guides.sort(sortByPublishedAtDesc);
};

export const getGuideBySlug = async (slug: string): Promise<GuidePost | null> => {
  const filePath = path.join(guidesDirectory, `${slug}.md`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { frontmatter, content } = parseFrontmatter(fileContent);

    return {
      ...frontmatter,
      content,
      html: renderMarkdownToHtml(content)
    };
  } catch {
    return null;
  }
};

export const getGuidesByCategory = async (category: GuideCategory, currentSlug?: string): Promise<GuideFrontmatter[]> => {
  const guides = await getAllGuides();

  return guides.filter((guide) => guide.category === category && guide.slug !== currentSlug);
};
