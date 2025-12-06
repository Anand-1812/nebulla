CREATE TYPE "public"."action_type" AS ENUM('CREATE_CONTACT');--> statement-breakpoint
CREATE TYPE "public"."icon" AS ENUM('settings', 'chart', 'calendar', 'check', 'chip', 'compass', 'database', 'flag', 'home', 'info', 'link', 'lock', 'messages', 'notification', 'payment', 'power', 'receipt', 'shield', 'star', 'tune', 'videorecorder', 'wallet', 'warning', 'headphone', 'send', 'pipelines', 'person', 'category', 'contact', 'clipboardIcon');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('ACCEPTED', 'REVOKED', 'PENDING');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('price_1Ppo69RwpqMc2iheOHp2rbzA', 'price_1Ppo73RwpqMc2ihef4jfoTTc');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('AGENCY_OWNER', 'AGENCY_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST');--> statement-breakpoint
CREATE TYPE "public"."trigger_type" AS ENUM('CONTACT_FORM');--> statement-breakpoint
CREATE TABLE "actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "action_type" NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"lane_id" text DEFAULT '0' NOT NULL,
	"automation_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "addons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"price_id" text NOT NULL,
	"agency_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "addons_price_id_unique" UNIQUE("price_id")
);
--> statement-breakpoint
CREATE TABLE "agencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"connect_account_id" text,
	"customer_id" text DEFAULT '',
	"name" text NOT NULL,
	"agency_logo" text NOT NULL,
	"company_email" text NOT NULL,
	"company_phone" text NOT NULL,
	"white_label" boolean DEFAULT true NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"zip_code" text NOT NULL,
	"state" text NOT NULL,
	"country" text NOT NULL,
	"goal" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agency_sidebar_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT 'Menu' NOT NULL,
	"link" text DEFAULT '#' NOT NULL,
	"icon" "icon" DEFAULT 'info' NOT NULL,
	"agency_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "automations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"trigger_id" uuid,
	"sub_account_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "automation_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"automation_id" uuid NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_names" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"custom_data" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"funnel_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"sub_account_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funnels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"sub_domain_name" text,
	"favicon" text,
	"live_products" text DEFAULT '[]' NOT NULL,
	"sub_account_id" uuid NOT NULL,
	CONSTRAINT "funnels_sub_domain_name_unique" UNIQUE("sub_domain_name")
);
--> statement-breakpoint
CREATE TABLE "funnel_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"path_name" text DEFAULT '' NOT NULL,
	"visits" integer DEFAULT 0 NOT NULL,
	"content" text,
	"order" integer NOT NULL,
	"preview_image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"funnel_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"avatar_url" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" "role" DEFAULT 'SUBACCOUNT_USER' NOT NULL,
	"agency_id" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sub_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"connect_account_id" text,
	"name" text NOT NULL,
	"sub_account_logo" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"company_email" text NOT NULL,
	"company_phone" text NOT NULL,
	"goal" integer DEFAULT 5 NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"zip_code" text NOT NULL,
	"state" text NOT NULL,
	"country" text NOT NULL,
	"agency_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"access" boolean DEFAULT false NOT NULL,
	"sub_account_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification" text NOT NULL,
	"agency_id" uuid NOT NULL,
	"sub_account_id" uuid,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipelines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"sub_account_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lanes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"pipeline_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"value" numeric(12, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"lane_id" uuid NOT NULL,
	"customer_id" uuid,
	"assigned_user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"sub_account_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags_on_tickets" (
	"ticket_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "tags_on_tickets_ticket_id_tag_id_pk" PRIMARY KEY("ticket_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text,
	"name" text NOT NULL,
	"link" text NOT NULL,
	"sub_account_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "triggers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "trigger_type" NOT NULL,
	"sub_account_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"status" "invitation_status" DEFAULT 'PENDING' NOT NULL,
	"role" "role" DEFAULT 'SUBACCOUNT_USER' NOT NULL,
	"agency_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "subaccount_sidebar_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT 'Menu' NOT NULL,
	"link" text DEFAULT '#' NOT NULL,
	"icon" "icon" DEFAULT 'info' NOT NULL,
	"sub_account_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan" "plan",
	"price" text,
	"active" boolean DEFAULT false NOT NULL,
	"price_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"current_period_end_date" timestamp NOT NULL,
	"subscription_id" text NOT NULL,
	"agency_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_subscription_id_unique" UNIQUE("subscription_id"),
	CONSTRAINT "subscriptions_agency_id_unique" UNIQUE("agency_id")
);
--> statement-breakpoint
CREATE INDEX "actions_automation_idx" ON "actions" USING btree ("automation_id");--> statement-breakpoint
CREATE INDEX "addons_agency_idx" ON "addons" USING btree ("agency_id");--> statement-breakpoint
CREATE INDEX "agency_sidebar_idx" ON "agency_sidebar_options" USING btree ("agency_id");--> statement-breakpoint
CREATE INDEX "automations_trigger_idx" ON "automations" USING btree ("trigger_id");--> statement-breakpoint
CREATE INDEX "automations_subaccount_idx" ON "automations" USING btree ("sub_account_id");--> statement-breakpoint
CREATE INDEX "automation_instances_automation_idx" ON "automation_instances" USING btree ("automation_id");--> statement-breakpoint
CREATE INDEX "class_names_funnel_idx" ON "class_names" USING btree ("funnel_id");--> statement-breakpoint
CREATE INDEX "contacts_subaccount_idx" ON "contacts" USING btree ("sub_account_id");--> statement-breakpoint
CREATE INDEX "funnels_subaccount_idx" ON "funnels" USING btree ("sub_account_id");--> statement-breakpoint
CREATE INDEX "funnel_pages_funnel_idx" ON "funnel_pages" USING btree ("funnel_id");--> statement-breakpoint
CREATE INDEX "users_agency_id_idx" ON "users" USING btree ("agency_id");--> statement-breakpoint
CREATE INDEX "sub_accounts_agency_idx" ON "sub_accounts" USING btree ("agency_id");--> statement-breakpoint
CREATE INDEX "permissions_subaccount_idx" ON "permissions" USING btree ("sub_account_id");--> statement-breakpoint
CREATE INDEX "permissions_email_idx" ON "permissions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "notifications_agency_idx" ON "notifications" USING btree ("agency_id");--> statement-breakpoint
CREATE INDEX "notifications_subaccount_idx" ON "notifications" USING btree ("sub_account_id");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pipelines_subaccount_idx" ON "pipelines" USING btree ("sub_account_id");--> statement-breakpoint
CREATE INDEX "lanes_pipeline_idx" ON "lanes" USING btree ("pipeline_id");--> statement-breakpoint
CREATE INDEX "tickets_lane_idx" ON "tickets" USING btree ("lane_id");--> statement-breakpoint
CREATE INDEX "tickets_customer_idx" ON "tickets" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "tickets_assigned_idx" ON "tickets" USING btree ("assigned_user_id");--> statement-breakpoint
CREATE INDEX "tags_subaccount_idx" ON "tags" USING btree ("sub_account_id");--> statement-breakpoint
CREATE INDEX "media_subaccount_idx" ON "media" USING btree ("sub_account_id");--> statement-breakpoint
CREATE INDEX "media_link_idx" ON "media" USING btree ("link");--> statement-breakpoint
CREATE INDEX "triggers_subaccount_idx" ON "triggers" USING btree ("sub_account_id");--> statement-breakpoint
CREATE INDEX "invitation_agency_idx" ON "invitations" USING btree ("agency_id");--> statement-breakpoint
CREATE INDEX "subacc_sidebar_idx" ON "subaccount_sidebar_options" USING btree ("sub_account_id");--> statement-breakpoint
CREATE INDEX "subscriptions_customer_idx" ON "subscriptions" USING btree ("customer_id");