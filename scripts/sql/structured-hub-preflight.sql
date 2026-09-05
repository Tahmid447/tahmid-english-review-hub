-- Read-only preflight. Do not infer migration history from the default branch.
select jsonb_build_object(
  'foundation_objects_present', (select coalesce(jsonb_agg(c.relname), '[]'::jsonb)
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname in (
      'review_teacher_students','review_student_hub_settings','review_curriculum_levels',
      'review_curriculum_items','review_student_curriculum_access','review_curriculum_progress',
      'review_curriculum_favorites','review_announcements','review_announcement_targets','review_teacher_audit_log')),
  'prerequisite_functions', (select jsonb_object_agg(name, to_regprocedure(signature) is not null)
    from (values
      ('teacher_identity','public.is_review_teacher()'),
      ('plan_entitlement','public.review_plan_meets_requirement(text)'),
      ('profile_complete','public.review_profile_is_complete()'),
      ('lesson_access','public.review_lesson_access_mode(uuid)'),
      ('preview_rpc','public.review_teacher_preview_lesson(text,text)'),
      ('access_code_reissue','public.review_reissue_access_code(uuid)')
    ) required(name,signature)),
  'active_teachers', (select count(*) from public.review_teachers where active),
  'profiles', (select count(*) from public.review_profiles),
  'lessons', (select count(*) from public.review_lessons),
  'questions', (select count(*) from public.review_questions),
  'assignments', (select count(*) from public.review_assignments),
  'progress_attempts', (select count(*) from public.review_attempts),
  'premium_submissions', (select count(*) from public.review_task_submissions),
  'recordings', (select jsonb_build_object('count', count(*), 'bytes',coalesce(sum((metadata->>'size')::bigint),0)) from storage.objects where bucket_id='review-premium-recordings'),
  'recording_bucket', (select to_jsonb(bucket) - 'owner' - 'owner_id' from storage.buckets bucket where id='review-premium-recordings'),
  'review_table_rls_disabled', (select coalesce(jsonb_agg(c.relname), '[]'::jsonb) from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relkind='r' and c.relname like 'review_%' and not c.relrowsecurity)
) as preflight;
