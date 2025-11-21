import { getLinearClient } from '../../core/client';
import { displayTable, formatLabels, formatStatus } from '../../utils/display';
import { handleError } from '../../utils/errors';
import { buildStringFilter } from '../../utils/filters';

interface ListOptions {
  status?: string[];
  assignee?: string[];
  label?: string[];
  excludeStatus?: string[];
  excludeAssignee?: string[];
  excludeLabel?: string[];
  sort?: string;
  order?: string;
  limit?: string;
}

export async function listIssues(options: ListOptions): Promise<void> {
  try {
    const client = getLinearClient();

    const filter = buildFilter(options);
    const orderBy = buildOrderBy(options.sort, options.order);
    const limit = options.limit ? parseInt(options.limit, 10) : 50;

    const issuesQuery: Record<string, unknown> = {
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      first: limit,
    };

    if (orderBy) {
      issuesQuery.orderBy = orderBy;
    }

    const issues = await client.issues(issuesQuery as any);

    if (issues.nodes.length === 0) {
      console.log('No issues found');
      return;
    }

    const rows = await Promise.all(
      issues.nodes.map(async (issue) => {
        const state = await issue.state;
        const assignee = await issue.assignee;
        const labels = await issue.labels();

        const statusText = state?.name || '-';
        const statusColor = state?.color;
        const formattedStatus = formatStatus(statusText, statusColor);

        const assigneeName = assignee?.name || 'Unassigned';
        const formattedLabels = formatLabels(labels.nodes);

        return [
          issue.identifier,
          issue.title,
          formattedStatus,
          assigneeName,
          formattedLabels,
        ];
      })
    );

    displayTable(
      [
        { header: 'ID', width: 12 },
        { header: 'Title', width: 50 },
        { header: 'Status', width: 15 },
        { header: 'Assignee', width: 20 },
        { header: 'Labels', width: 30 },
      ],
      rows
    );
  } catch (error) {
    handleError(error);
  }
}

function buildFilter(options: ListOptions): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  const statusValues = combineFilterValues(options.status, options.excludeStatus);
  const assigneeValues = combineFilterValues(options.assignee, options.excludeAssignee);
  const labelValues = combineFilterValues(options.label, options.excludeLabel);

  const statusFilter = buildStringFilter(statusValues);
  if (statusFilter) {
    filter.state = { name: statusFilter };
  }

  const assigneeFilter = buildStringFilter(assigneeValues);
  if (assigneeFilter) {
    filter.assignee = { email: assigneeFilter };
  }

  const labelFilter = buildStringFilter(labelValues);
  if (labelFilter) {
    filter.labels = { some: { name: labelFilter } };
  }

  return filter;
}

function combineFilterValues(
  includeValues?: string[],
  excludeValues?: string[]
): string[] {
  const combined: string[] = [];

  if (includeValues) {
    combined.push(...includeValues);
  }

  if (excludeValues) {
    const negatedValues = excludeValues.map((value: string) => `!${value}`);
    combined.push(...negatedValues);
  }

  return combined;
}

function buildOrderBy(sort?: string, _order?: string): string | undefined {
  if (!sort) {
    return undefined;
  }

  const sortMapping: Record<string, string> = {
    updated: 'updatedAt',
    created: 'createdAt',
    priority: 'priority',
    title: 'title',
  };

  return sortMapping[sort];
}
