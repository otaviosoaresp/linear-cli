import pc from 'picocolors';
import { badge } from './colors';

interface Column {
  header: string;
  width: number;
  align?: 'left' | 'right';
}

interface Label {
  name: string;
  color: string;
}

export function displayTable(columns: Column[], rows: string[][]): void {
  const headerRow = columns
    .map((col) => padString(col.header, col.width, col.align))
    .join('  ');

  console.log(pc.bold(headerRow));
  console.log(columns.map((col) => '-'.repeat(col.width)).join('  '));

  rows.forEach((row) => {
    const formattedRow = row
      .map((cell, index) => padString(cell, columns[index].width, columns[index].align))
      .join('  ');
    console.log(formattedRow);
  });
}

export function displayKeyValue(key: string, value: string): void {
  console.log(`${pc.bold(key)}: ${value}`);
}

export function displaySection(title: string): void {
  console.log();
  console.log(pc.bold(pc.cyan(title)));
  console.log();
}

function padString(str: string, width: number, align: 'left' | 'right' = 'left'): string {
  const visibleText = stripAnsi(str);
  const visibleLength = visibleText.length;

  const TRUNCATION_SUFFIX = '...';
  const TRUNCATION_SUFFIX_LENGTH = 3;

  if (visibleLength > width) {
    const maxLength = width - TRUNCATION_SUFFIX_LENGTH;
    const truncatedVisible = visibleText.substring(0, maxLength) + TRUNCATION_SUFFIX;
    return truncatedVisible;
  }

  const paddingLength = width - visibleLength;
  const padding = ' '.repeat(Math.max(0, paddingLength));

  return align === 'right' ? padding + str : str + padding;
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatLabels(labels: Label[]): string {
  if (labels.length === 0) {
    return '-';
  }

  const badgeList = labels.map((label: Label) => {
    return badge(label.name, label.color);
  });

  return badgeList.join(' ');
}

export function formatStatus(name: string, color?: string): string {
  return badge(name, color);
}

export function stripAnsi(text: string): string {
  const ANSI_ESCAPE_PATTERN = /\x1b\[[0-9;]*m/g;
  return text.replace(ANSI_ESCAPE_PATTERN, '');
}
