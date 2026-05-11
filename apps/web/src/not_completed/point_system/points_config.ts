export enum TypeClick {
  UP_VOTE = "UP_VOTE",
  DOWN_VOTE = "DOW_NVOTE",
  POLL_CREATE = "POLL_CREATE",
  POLL_UPVOTE = "POLL_UPVOTE",
  POLL_DOWNVOTE = "POLL_DOWNVOTE",
  POLL_SELECT = "POLL_SELECT",
  POST_CREATE = "POST_CREATE",
  POST_UP_VOTE = "POST_UP_VOTE",
  POST_DOWN_VOTE = "POST_DOWN_VOTE",
  POST_COMMENT = "POST_COMMENT",
  POST_COMMENT_UP_VOTE = "POST_COMMENT_UP_VOTE",
  POST_COMMENT_DOWN_VOTE = "POST_COMMENT_DOWN_VOTE",
  CHAT_GROUP_CREATE = "CHAT_GROUP_CREATE",
  CHAT_REPLY = "CHAT_REPLY",
  CHAT_GROUP_JOIN = "CHAT_GROUP_JOIN",
  CHAT_MESSAGE_SEND = "CHAT_MESSAGE_SEND",
  CHAT_MESSAGE_UPVOTE = "CHAT_MESSAGE_UPVOTE",
  CHAT_MESSAGE_DOWNVOTE = "CHAT_MESSAGE_DOWNVOTE",
}
export enum CommunityLevels {
  LEVEL_0 = "LEVEL_O",
  LEVEL_1 = "LEVEL_1",
  LEVEL_2 = "LEVEL_2",
  LEVEL_3 = "LEVEL_3",
  LEVEL_4 = "LEVEL_4",
  LEVEL_5 = "LEVEL_5",
  LEVEL_6 = "LEVEL_6",
  LEVEL_7 = "LEVEL_7",
}
export interface PointsConfig {
  token_cost: number;
  points_earned: number;
  base_xp_points: number;
  XP_earned: number;
  engagement_level: number; // represent the strateigic value of the action
  interaction_level: number; // represent the effort and impact of the action
  weight: number; // the basexp
}

export const POINTS_CONFIG = {
  [TypeClick.UP_VOTE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.DOWN_VOTE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.POLL_CREATE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.POLL_UPVOTE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.POLL_DOWNVOTE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.POLL_SELECT]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.POST_CREATE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.POST_UP_VOTE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.POST_DOWN_VOTE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.POST_COMMENT]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.POST_COMMENT_UP_VOTE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.POST_COMMENT_DOWN_VOTE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.CHAT_GROUP_CREATE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.CHAT_REPLY]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.CHAT_GROUP_JOIN]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.CHAT_MESSAGE_SEND]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.CHAT_MESSAGE_UPVOTE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
  [TypeClick.CHAT_MESSAGE_DOWNVOTE]: {
    token_cost: 1,
    points_earned: 1,
    base_xp_points: 10,
    XP_earned: 1,
    engagement_level: 1, // represent the strateigic value of the action
    interaction_level: 1, // represent the effort and impact of the action
    weight: 1, // the basexp
  },
};

// these are the rules of the action depending on the level of the user.
export const ACTION_CONFIG = {
  [CommunityLevels.LEVEL_0]: {
    token_cost_multiplier: 1,
    xp_yield: 1, // % of the total xp that can be earned per level.
    level: 0,
  },
  [CommunityLevels.LEVEL_1]: {
    token_cost_multiplier: 1,
    xp_yield: 1, // % of the total xp that can be earned per level.
    level: 1,
  },

  [CommunityLevels.LEVEL_2]: {
    token_cost_multiplier: 1,
    xp_yield: 1, // % of the total xp that can be earned per level.
    level: 2,
  },
  [CommunityLevels.LEVEL_3]: {
    token_cost_multiplier: 1,
    xp_yield: 1, // % of the total xp that can be earned per level.
    level: 3,
  },
  [CommunityLevels.LEVEL_4]: {
    token_cost_multiplier: 1,
    xp_yield: 1, // % of the total xp that can be earned per level.
    level: 4,
  },
  [CommunityLevels.LEVEL_5]: {
    token_cost_multiplier: 1,
    xp_yield: 1, // % of the total xp that can be earned per level.
    level: 5,
  },
  [CommunityLevels.LEVEL_6]: {
    token_cost_multiplier: 1,
    xp_yield: 1, // % of the total xp that can be earned per level.
    level: 6,
  },
};
