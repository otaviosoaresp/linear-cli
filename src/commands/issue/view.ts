import { getLinearClient } from '../../core/client';
import { displayKeyValue, displaySection, formatDate, formatLabels, formatStatus } from '../../utils/display';
import { handleError } from '../../utils/errors';
import { getPriorityColor, getPriorityLabel, badge } from '../../utils/colors';
import pc from 'picocolors';

export async function viewIssue(issueId: string): Promise<void> {
  try {
    const client = getLinearClient();
    const issue = await client.issue(issueId);

    if (!issue) {
      throw new Error(`Issue ${issueId} not found`);
    }

    const [state, assignee, creator, labels, team] = await Promise.all([
      issue.state,
      issue.assignee,
      issue.creator,
      issue.labels(),
      issue.team,
    ]);

    displaySection(`${issue.identifier}: ${issue.title}`);

    const statusText = state?.name || '-';
    const statusColor = state?.color;
    const formattedStatus = formatStatus(statusText, statusColor);

    const priorityLabel = getPriorityLabel(issue.priority);
    const priorityColor = getPriorityColor(issue.priority);
    const formattedPriority = badge(priorityLabel, priorityColor);

    const formattedLabels = formatLabels(labels.nodes);

    displayKeyValue('Status', formattedStatus);
    displayKeyValue('Assignee', assignee?.name || 'Unassigned');
    displayKeyValue('Creator', creator?.name || '-');
    displayKeyValue('Team', team?.name || '-');
    displayKeyValue('Priority', formattedPriority);
    displayKeyValue('Labels', formattedLabels);
    displayKeyValue('Created', formatDate(issue.createdAt));
    displayKeyValue('Updated', formatDate(issue.updatedAt));

    if (issue.dueDate) {
      displayKeyValue('Due Date', formatDate(new Date(issue.dueDate)));
    }

    if (issue.estimate) {
      displayKeyValue('Estimate', `${issue.estimate} points`);
    }

    if (issue.description) {
      displaySection('Description');
      console.log(issue.description);
    }

    console.log();
    displayKeyValue('URL', pc.cyan(issue.url));
  } catch (error) {
    handleError(error);
  }
}

