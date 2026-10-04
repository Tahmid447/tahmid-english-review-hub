-- Additive preference control; existing content, preferences and RLS stay intact.
alter table public.review_student_hub_settings
  add column show_music boolean not null default true;

create or replace function public.review_valid_features(value jsonb) returns boolean
language sql immutable set search_path='' as $$
 select jsonb_typeof(value)='object' and not exists(select 1 from jsonb_each(value) e where
 e.key not in ('show_dashboard','show_words','show_phrases','show_phonics','show_review_lessons','show_homework','show_progress','show_pricing','show_contact_teacher','show_trial_cta','show_payment_plan','show_announcements','show_music') or jsonb_typeof(e.value)<>'boolean');
$$;
