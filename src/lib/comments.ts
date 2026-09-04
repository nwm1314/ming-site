export type CommentsProvider = 'giscus' | 'waline';

// Keep provider selection out of article composition until a real provider is configured.
export const commentsProvider: CommentsProvider | undefined = undefined;
