-- Read-only transaction, existing account impersonation for aggregate RLS checks.
-- No table write, new user, settings change or message is performed. JWT settings
-- and roles are local to this transaction and end at ROLLBACK.
begin read only;
select set_config('review.qa_student', coalesce((select student_id::text from public.review_teacher_students where active order by student_id limit 1),''), true);
select set_config('review.qa_teacher', coalesce((select teacher_id::text from public.review_teacher_students where active order by student_id limit 1),''), true);
set local role authenticated;
select set_config('request.jwt.claim.sub', current_setting('review.qa_student'), true);
select set_config('review.qa_student_result', jsonb_build_object(
  'identity_available',auth.uid() is not null,
  'other_profiles_visible',(select count(*) from public.review_profiles where user_id <> auth.uid()),
  'other_settings_visible',(select count(*) from public.review_student_hub_settings where student_id <> auth.uid()),
  'other_progress_visible',(select count(*) from public.review_curriculum_progress where student_id <> auth.uid()),
  'other_attempts_visible',(select count(*) from public.review_attempts where user_id <> auth.uid()),
  'other_assignments_visible',(select count(*) from public.review_assignments where student_id <> auth.uid()),
  'other_packs_visible',(select count(*) from public.review_student_learning_packs where student_id <> auth.uid()),
  'raw_item_exceptions_visible',(select count(*) from public.review_student_curriculum_access),
  'unreadable_items_visible',(select count(*) from public.review_curriculum_items where not public.review_can_read_curriculum_item(id)),
  'blocked_lesson_payload_visible',(select count(*) from public.review_public_lessons where not public.review_can_read_catalog_lesson(id)),
  'blocked_question_payload_visible',(select count(*) from public.review_public_questions where not public.review_can_read_question(id))
)::text,true);
select set_config('request.jwt.claim.sub', current_setting('review.qa_teacher'), true);
select set_config('review.qa_teacher_result', jsonb_build_object(
  'identity_available',auth.uid() is not null,
  'unassigned_profiles_visible',(select count(*) from public.review_profiles where user_id <> auth.uid() and not public.review_teacher_can_manage(user_id)),
  'unassigned_progress_visible',(select count(*) from public.review_curriculum_progress where not public.review_teacher_can_manage(student_id)),
  'unassigned_assignments_visible',(select count(*) from public.review_assignments where not public.review_teacher_can_manage(student_id)),
  'unassigned_packs_visible',(select count(*) from public.review_student_learning_packs where not public.review_teacher_can_manage(student_id)),
  'other_private_lessons_visible',(select count(*) from public.review_lessons where assignment_only and not public.review_teacher_can_read_private_lesson(id))
)::text,true);
set local role anon;
select set_config('request.jwt.claim.sub','',true);
select jsonb_build_object(
 'student_rls',current_setting('review.qa_student_result')::jsonb,
 'teacher_rls',current_setting('review.qa_teacher_result')::jsonb,
 'anonymous_rls',jsonb_build_object(
  'preview_items',(select count(*) from public.review_curriculum_items),
  'unexpected_items',(select count(*) from public.review_curriculum_items where not active or not is_preview),
  'private_lesson_metadata',(select count(*) from public.review_public_lessons where not public.review_can_read_catalog_lesson(id)),
  'unexpected_question_payload',(select count(*) from public.review_public_questions where not public.review_can_read_question(id))
)) as production_rls;
rollback;
