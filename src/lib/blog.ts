import { promises as fs } from 'fs';
import path from 'path';

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  thumbnail?: string;
};

export type BlogPost = BlogFrontmatter & {
  content: string;
  html: string;
};

const blogDirectory = path.join(process.cwd(), 'src/content/blog');

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const parseFrontmatter = (fileContent: string): { frontmatter: BlogFrontmatter; content: string } => {
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

  const tagsValue = record.tags ?? '[]';
  const tags = tagsValue
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((tag) => tag.trim().replace(/^"|"$/g, ''))
    .filter(Boolean);

  const frontmatter: BlogFrontmatter = {
    title: (record.title ?? '').replace(/^"|"$/g, ''),
    description: (record.description ?? '').replace(/^"|"$/g, ''),
    date: (record.date ?? '').replace(/^"|"$/g, ''),
    slug: (record.slug ?? '').replace(/^"|"$/g, ''),
    thumbnail: (record.thumbnail ?? '').replace(/^"|"$/g, '') || undefined,
    tags
  };

  if (!frontmatter.title || !frontmatter.description || !frontmatter.date || !frontmatter.slug) {
    throw new Error('Missing required frontmatter field.');
  }

  return { frontmatter, content };
};

const renderInlineMarkdown = (line: string): string => {
  const escaped = escapeHtml(line);

  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-brand-primary underline" target="_blank" rel="noreferrer">$1</a>');
};

const renderMarkdownToHtml = (markdown: string): string => {
  const lines = markdown.split('\n');
  const html: string[] = [];
  let isListOpen = false;
  let isCodeBlockOpen = false;
  const codeBlock: string[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (isCodeBlockOpen) {
        html.push(
          `<pre class="mt-6 overflow-x-auto rounded-2xl bg-[#FFF5E9] p-4 text-sm leading-7 text-[#5C4033]"><code>${escapeHtml(codeBlock.join('\n'))}</code></pre>`
        );
        codeBlock.length = 0;
        isCodeBlockOpen = false;
      } else {
        if (isListOpen) {
          html.push('</ul>');
          isListOpen = false;
        }
        isCodeBlockOpen = true;
      }
      return;
    }

    if (isCodeBlockOpen) {
      codeBlock.push(line);
      return;
    }

    if (!trimmed) {
      if (isListOpen) {
        html.push('</ul>');
        isListOpen = false;
      }
      return;
    }

    if (trimmed.startsWith('### ')) {
      if (isListOpen) {
        html.push('</ul>');
        isListOpen = false;
      }
      html.push(`<h3 class="mt-8 text-xl font-bold text-[#4F2A1D]">${renderInlineMarkdown(trimmed.slice(4))}</h3>`);
      return;
    }

    if (trimmed.startsWith('## ')) {
      if (isListOpen) {
        html.push('</ul>');
        isListOpen = false;
      }
      html.push(`<h2 class="mt-10 text-2xl font-bold text-[#4F2A1D]">${renderInlineMarkdown(trimmed.slice(3))}</h2>`);
      return;
    }

    if (trimmed.startsWith('# ')) {
      if (isListOpen) {
        html.push('</ul>');
        isListOpen = false;
      }
      html.push(`<h1 class="mt-10 text-3xl font-bold text-[#4F2A1D]">${renderInlineMarkdown(trimmed.slice(2))}</h1>`);
      return;
    }

    if (trimmed.startsWith('- ')) {
      if (!isListOpen) {
        html.push('<ul class="ml-6 list-disc space-y-2 text-[#2D2D2D]">');
        isListOpen = true;
      }
      html.push(`<li>${renderInlineMarkdown(trimmed.slice(2))}</li>`);
      return;
    }

    if (trimmed.startsWith('> ')) {
      if (isListOpen) {
        html.push('</ul>');
        isListOpen = false;
      }
      html.push(
        `<blockquote class="mt-6 rounded-2xl border-l-4 border-[#E8B788] bg-[#FFF5E9] px-4 py-3 text-[#5C4033]">${renderInlineMarkdown(trimmed.slice(2))}</blockquote>`
      );
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

  if (isCodeBlockOpen && codeBlock.length > 0) {
    html.push(
      `<pre class="mt-6 overflow-x-auto rounded-2xl bg-[#FFF5E9] p-4 text-sm leading-7 text-[#5C4033]"><code>${escapeHtml(codeBlock.join('\n'))}</code></pre>`
    );
  }

  return html.join('');
};

const sortByDateDesc = (a: BlogFrontmatter, b: BlogFrontmatter): number =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export const getAllBlogPosts = async (): Promise<BlogFrontmatter[]> => {
  const fileNames = await fs.readdir(blogDirectory);
  const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));

  const posts = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const filePath = path.join(blogDirectory, fileName);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { frontmatter } = parseFrontmatter(fileContent);
      return frontmatter;
    })
  );

  return posts.sort(sortByDateDesc);
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await getAllBlogPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return null;
  }

  const filePath = path.join(blogDirectory, `${post.slug}.md`);
  const fileContent = await fs.readFile(filePath, 'utf8');
  const { content } = parseFrontmatter(fileContent);

  return {
    ...post,
    content,
    html: renderMarkdownToHtml(content)
  };
};
