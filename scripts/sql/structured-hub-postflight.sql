-- Read-only postflight for 024 + 025 + 026 + 027. Returns aggregate state only.
select jsonb_build_object(
  'levels', (select count(*) from public.review_curriculum_levels),
  'items', (select count(*) from public.review_curriculum_items),
  'categories', (select jsonb_object_agg(category, jsonb_build_object('items',items,'levels',levels))
    from (select category,count(*) items,count(distinct level) levels from public.review_curriculum_items group by category) counts),
  'starter_scopes', (select count(*) from public.review_student_hub_settings where allowed_level_min=1 and allowed_level_max=4 and allowed_levels='{}' and category_access='{}'),
  'invalid_category_rules', (select count(*) from public.review_student_hub_settings where not public.review_valid_category_access(category_access)),
  'learners_without_settings', (select count(*) from public.review_profiles p where not exists(select 1 from public.review_teachers t where t.user_id=p.user_id and t.active) and not exists(select 1 from public.review_student_hub_settings s where s.student_id=p.user_id)),
  'learners_without_owner', (select count(*) from public.review_profiles p where not exists(select 1 from public.review_teachers t where t.user_id=p.user_id and t.active) and not exists(select 1 from public.review_teacher_students ts join public.review_teachers t on t.user_id=ts.teacher_id and t.active where ts.student_id=p.user_id and ts.active)),
  'teacher_as_learner_mappings', (select count(*) from public.review_teacher_students ts join public.review_teachers t on t.user_id=ts.student_id where t.active and ts.active),
  'rls_disabled', (select coalesce(jsonb_agg(c.relname), '[]'::jsonb) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and c.relname like 'review_%' and not c.relrowsecurity),
  'personal_pack_direct_write_grants', (select count(*) from information_schema.role_table_grants where table_schema='public' and table_name in ('review_student_learning_packs','review_student_learning_pack_items') and grantee in ('anon','authenticated','PUBLIC') and privilege_type <> 'SELECT'),
  'anonymous_preview_items', (select count(*) from public.review_curriculum_items item join public.review_curriculum_levels level using(category,level) where item.active and item.is_preview and level.active and level.is_preview),
  'assignment_only_lessons', (select count(*) from public.review_lessons where assignment_only),
  'public_view_guards', (select jsonb_build_object(
    'lesson_guard', pg_get_viewdef('public.review_public_lessons'::regclass,true) like '%review_can_read_catalog_lesson%',
    'question_guard', pg_get_viewdef('public.review_public_questions'::regclass,true) like '%review_can_read_question%')),
  'preserved_legacy_counts', jsonb_build_object(
    'lessons',(select count(*) from public.review_lessons),
    'questions',(select count(*) from public.review_questions),
    'assignments',(select count(*) from public.review_assignments),
    'attempts',(select count(*) from public.review_attempts),
    'submissions',(select count(*) from public.review_task_submissions))
) as postflight;
