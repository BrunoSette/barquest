import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  uniqueIndex,
  boolean as pgBoolean, // Import boolean as pgBoolean to avoid conflicts
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { string } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("member"), // Role field to differentiate between Member and Admin
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id),
  questionText: text("question_text").notNull(),
  answer1: text("answer1").notNull(),
  answer2: text("answer2").notNull(),
  answer3: text("answer3").notNull(),
  answer4: text("answer4").notNull(),
  comments: text("comments").notNull(),
  correctAnswer: integer("correct_answer").notNull(), // Stores the index of the correct answer (1-4)
  is_approved: pgBoolean("is_approved").notNull().default(false), // Use pgBoolean for boolean type
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripeProductId: text("stripe_product_id"),
  planName: varchar("plan_name", { length: 50 }),
  subscriptionStatus: varchar("subscription_status", { length: 20 }),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  role: varchar("role", { length: 50 }).notNull(),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  ipAddress: varchar("ip_address", { length: 45 }),
});

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  invitedBy: integer("invited_by")
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp("invited_at").notNull().defaultNow(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
});

export const oneTimeTokens = pgTable(
  "one_time_tokens",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    token: varchar("token", { length: 255 }).notNull().unique(),
    type: varchar("type", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex("token_idx").on(table.token),
    };
  }
);

export const userAnswers = pgTable("user_answers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  questionId: integer("question_id").references(() => questions.id, {
    onDelete: "set null",
  }),
  testHistoryId: integer("test_history_id") // Foreign key to testHistory table
    .notNull()
    .default(0)
    .references(() => testHistory.id), // This ensures answers are linked to specific tests
  selectedAnswer: integer("selected_answer").notNull(),
  isCorrect: pgBoolean("is_correct").notNull(),
  answeredAt: timestamp("answered_at").notNull().defaultNow(),
});

export const testHistory = pgTable("test_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  score: integer("score").notNull(), // Stores the score as a percentage
  questions: integer("questions").notNull(), // Number of questions in the test
  timed: pgBoolean("timed").notNull(), // Indicates if the test was timed
  tutor: pgBoolean("tutor").notNull(), // Indicates if a tutor was involved
  questionmode: varchar("questionmode", { length: 50 }).notNull(), // Indicates the type of the test
  newQuestions: integer("new_questions").notNull(), // Number of new questions in the test
  date: timestamp("date").notNull().defaultNow(), // Date of the test attempt
});

export const userProducts = pgTable("user_products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  stripeProductId: text("stripe_product_id"),
  stripeProductName: varchar("stripe_product_name", { length: 50 }),
  stripePriceId: text("stripe_price_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(), // Date of the test attempt
  active: pgBoolean("active").default(true),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
  userAnswers: many(userAnswers),
  testHistory: many(testHistory),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const oneTimeTokensRelations = relations(oneTimeTokens, ({ one }) => ({
  user: one(users, {
    fields: [oneTimeTokens.userId],
    references: [users.id],
  }),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [questions.subjectId],
    references: [subjects.id],
  }),
  userAnswers: many(userAnswers),
}));

export const testHistoryRelations = relations(testHistory, ({ one, many }) => ({
  user: one(users, {
    fields: [testHistory.userId],
    references: [users.id],
  }),
  userAnswers: many(userAnswers), // Add this relation if not already present
}));

export const userAnswersRelations = relations(userAnswers, ({ one }) => ({
  user: one(users, {
    fields: [userAnswers.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [userAnswers.questionId],
    references: [questions.id],
  }),
  testHistory: one(testHistory, {
    fields: [userAnswers.testHistoryId], // Link answers to specific test history
    references: [testHistory.id],
  }),
}));

export const userProductsRelations = relations(userProducts, ({ one }) => ({
  user: one(users, {
    fields: [userProducts.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, "id" | "name" | "email">;
  })[];
};
export type OneTimeToken = typeof oneTimeTokens.$inferSelect;
export type NewOneTimeToken = typeof oneTimeTokens.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;
export type UserAnswer = typeof userAnswers.$inferSelect;
export type NewUserAnswer = typeof userAnswers.$inferInsert;
export type TestHistory = typeof testHistory.$inferSelect;
export type NewTestHistory = typeof testHistory.$inferInsert;
export type UserProduct = typeof userProducts.$inferSelect;
export type NewUserProduct = typeof userProducts.$inferInsert;

export enum ActivityType {
  SIGN_UP = "SIGN_UP",
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
  UPDATE_PASSWORD = "UPDATE_PASSWORD",
  DELETE_ACCOUNT = "DELETE_ACCOUNT",
  UPDATE_ACCOUNT = "UPDATE_ACCOUNT",
  CREATE_TEAM = "CREATE_TEAM",
  REMOVE_TEAM_MEMBER = "REMOVE_TEAM_MEMBER",
  INVITE_TEAM_MEMBER = "INVITE_TEAM_MEMBER",
  ACCEPT_INVITATION = "ACCEPT_INVITATION",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  RESET_PASSWORD = "RESET_PASSWORD",
}

export enum OneTimeTokenType {
  SIGN_IN = "SIGN_IN",
  RESET_PASSWORD = "RESET_PASSWORD",
}
