import { getLinearClient } from '../../core/client';
import { displaySection, formatDate } from '../../utils/display';
import { displaySuccess, handleError } from '../../utils/errors';
import pc from 'picocolors';

interface CommentOptions {
  add?: string;
}

export async function handleComments(issueId: string, options: CommentOptions): Promise<void> {
  try {
    if (options.add) {
      await createComment(issueId, options.add);
    } else {
      await listComments(issueId);
    }
  } catch (error) {
    handleError(error);
  }
}

async function listComments(issueId: string): Promise<void> {
  const client = getLinearClient();
  const issue = await client.issue(issueId);

  if (!issue) {
    throw new Error(`Issue ${issueId} not found`);
  }

  const comments = await issue.comments();

  if (comments.nodes.length === 0) {
    console.log('No comments found');
    return;
  }

  displaySection(`Comments on ${issue.identifier}`);

  for (const comment of comments.nodes) {
    const user = await comment.user;
    console.log(pc.bold(`${user?.name || 'Unknown'} - ${formatDate(comment.createdAt)}`));
    console.log(comment.body);
    console.log();
  }
}

async function createComment(issueId: string, body: string): Promise<void> {
  const client = getLinearClient();
  const issue = await client.issue(issueId);

  if (!issue) {
    throw new Error(`Issue ${issueId} not found`);
  }

  const payload = await client.createComment({
    issueId: issue.id,
    body,
  });

  if (!payload.success) {
    throw new Error('Failed to create comment');
  }

  displaySuccess(`Comment added to ${issue.identifier}`);
}
