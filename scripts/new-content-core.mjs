import { existsSync } from 'node:fs';

export function validateRequiredText(value, field) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) throw new Error(`${field} cannot be empty.`);
  return text;
}

export function validateSlug(value) {
  const slug = typeof value === 'string' ? value.trim() : '';
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) {
    throw new Error('Slug must use letters, numbers, dots, underscores, or hyphens, and cannot start with punctuation.');
  }
  return slug;
}

export function validateDate(value) {
  const date = typeof value === 'string' ? value.trim() : '';
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== date) {
    throw new Error('Date must use YYYY-MM-DD.');
  }
  return date;
}

export function assertTargetAvailable(path, exists = existsSync) {
  if (exists(path)) throw new Error(`Refusing to overwrite existing file: ${path}`);
}

export function createPostFrontmatter({ title, description, date }) {
  const safeTitle = validateRequiredText(title, 'Title');
  const safeDescription = validateRequiredText(description, 'Description');
  const safeDate = validateDate(date);

  return `---
title: ${JSON.stringify(safeTitle)}
description: ${JSON.stringify(safeDescription)}
publishDate: ${safeDate}
draft: true
category: Notes
tags: []
featured: false
toc: true
comments: false
---
`;
}

export function createMomentFrontmatter({ date }) {
  const safeDate = validateDate(date);

  return `---
publishDate: ${safeDate}
tags: []
visibility: unlisted
---
`;
}
