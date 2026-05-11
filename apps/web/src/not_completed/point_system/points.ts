import {
  CommunityLevels,
  TypeClick,
  PointsConfig,
  POINTS_CONFIG,
  ACTION_CONFIG,
} from "./points_config";

const getUserLevelInCommunity = (xpPoints: number): CommunityLevels => {
  if (xpPoints <= 50) {
    return CommunityLevels.LEVEL_1;
  } else if (xpPoints >= 50 && xpPoints <= 100) {
    return CommunityLevels.LEVEL_2;
  } else if (xpPoints >= 100 && xpPoints <= 150) {
    return CommunityLevels.LEVEL_3;
  } else if (xpPoints >= 150 && xpPoints <= 200) {
    return CommunityLevels.LEVEL_4;
  } else if (xpPoints >= 200 && xpPoints <= 250) {
    return CommunityLevels.LEVEL_5;
  } else if (xpPoints >= 250 && xpPoints <= 300) {
    return CommunityLevels.LEVEL_6;
  } else if (xpPoints >= 300 && xpPoints <= 350) {
    return CommunityLevels.LEVEL_7;
  } else {
    return null;
  }
};

const availableTokens = 1000; // the tokens available for hte user.
const availableXP: number = 50;

// this is where the user is in relation to the action he/she is taking
const userCorrelationWithAction = (
  userLevel: CommunityLevels,
  actionEngagementLevel: PointsConfig["engagement_level"]
) => {
  const level = CommunityLevels[userLevel].level;
  switch (level) {
    case level - actionEngagementLevel === 0:
      return ACTION_CONFIG[level];
    case level - actionEngagementLevel === 1:
      return ACTION_CONFIG[level];
    case level - actionEngagementLevel === 2:
      return ACTION_CONFIG[level];
    case level - actionEngagementLevel === 3:
      return ACTION_CONFIG[level];
    case level - actionEngagementLevel === 4:
      return ACTION_CONFIG[level];

    default:
      return ACTION_CONFIG[CommunityLevels.LEVEL_0];
  }
};

const actionCost = (userLevel: CommunityLevels, TypeClick: TypeClick) => {
  return;
  //   userCorrelationWithAction(userLevel, TypeClick).token_cost_multiplier * ACTION_CONFIG[userLevel].token_cost_multiplier;
};
const xpGained = () => {
  return;
};
const pointsGained = () => {
  return;
};

const actionReturn = (level: CommunityLevels, TypeClick: TypeClick) => {
  let xpGained;
  let pointsGained;
  /// TOKEN COST
  // to get the cost you have to get the correlation between the action and the level of the user
  //userlevel = getuserlevel(xpPoints)
  // LEVEL_CONFIG[userlevel].token_cost_multiplier
  // we have to get the action Interaction_level and compare it to wehre the user is. ( if action.interaction_level =1 && userlevel = 3 then the multiplier is at 60%)
  //Token Cost = Tipper Token Cost × (User's Token Cost Multiplier)

  // XP GAINED from the action based on the level of hte user,  and the type of action
  //XP = Base XP × (User's XP Yield %) ×     IF(Engagement ≥ 6, 1 / (User's XP Yield %), 1)

  //we need to get the points gained from the action based on the level of hte user , type of the action, engagement level of hte action  and interaction level itself
  return {
    xpGained,
    pointsGained,
  };
};

const pointsFormula = (
  actionType: TypeClick,
  availableTokens: number,
  availableXP: number
) => {
  return;
};

export const addPoints = (type: TypeClick, amount: number) => {
  switch (type) {
    case TypeClick.UP_VOTE: //i need to use the formula that takes into account the data of the voting and create the correlation between the objects and hte xp
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.DOWN_VOTE:
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.POLL_CREATE:
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.POLL_UPVOTE:
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.POLL_DOWNVOTE:
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.POST_CREATE:
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.POST_UP_VOTE:
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.POST_DOWN_VOTE:
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.POST_COMMENT:
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.POST_COMMENT_UP_VOTE:
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.POST_COMMENT_DOWN_VOTE:
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.CHAT_GROUP_CREATE:
      return POINTS_CONFIG[type].points_earned * amount;
    case TypeClick.CHAT_REPLY:
      return POINTS_CONFIG[type].points_earned * amount;
    default:
      throw new Error(`Invalid type: ${type}`);
  }
};
