// db/schema/enums.ts
import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "AGENCY_OWNER",
  "AGENCY_ADMIN",
  "SUBACCOUNT_USER",
  "SUBACCOUNT_GUEST",
]);

export const iconEnum = pgEnum("icon", [
  "settings",
  "chart",
  "calendar",
  "check",
  "chip",
  "compass",
  "database",
  "flag",
  "home",
  "info",
  "link",
  "lock",
  "messages",
  "notification",
  "payment",
  "power",
  "receipt",
  "shield",
  "star",
  "tune",
  "videorecorder",
  "wallet",
  "warning",
  "headphone",
  "send",
  "pipelines",
  "person",
  "category",
  "contact",
  "clipboardIcon",
]);

export const triggerTypesEnum = pgEnum("trigger_type", [
  "CONTACT_FORM",
]);

export const actionTypeEnum = pgEnum("action_type", [
  "CREATE_CONTACT",
]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "ACCEPTED",
  "REVOKED",
  "PENDING",
]);

export const planEnum = pgEnum("plan", [
  "price_1Ppo69RwpqMc2iheOHp2rbzA",
  "price_1Ppo73RwpqMc2ihef4jfoTTc",
]);

