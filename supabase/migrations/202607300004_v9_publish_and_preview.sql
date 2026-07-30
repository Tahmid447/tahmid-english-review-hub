begin;

-- The existing teacher account may also sign in through the learner client to
-- inspect the private hub. Teacher authorisation remains in review_teachers.
insert into public.review_profiles (user_id, display_name, access_scope)
select id, 'Tahmid - Preview Learner', 'takiwaki'
from auth.users
where lower(email) = 'tahmidhc245@gmail.com'
on conflict (user_id) do update
set display_name = excluded.display_name,
    access_scope = excluded.access_scope,
    updated_at = now();

-- Current launch decision: every verified lesson is visible in the general
-- catalogue and the private Takiwaki catalogue. Future edits remain available
-- from Teacher Studio and take effect immediately.
update public.review_lessons
set status = 'published',
    audience = 'both',
    updated_at = now()
where slug in (
  'june-28',
  'june-29',
  'june-30',
  'july-04',
  'july-05',
  'july-06',
  'july-07',
  'july-11',
  'july-12',
  'july-13',
  'july-18',
  'july-19',
  'july-22',
  'july-23',
  'july-25',
  'july-26',
  'july-27'
);

update public.review_questions
set payload = payload || jsonb_build_object(
  'image', '/assets/questions/july-25-feelings.png',
  'imageAlt', 'A learner looks irritated by repeated phone notifications.'
)
where stable_key = 'july-25-draft-choice-3';

update public.review_questions
set payload = payload || jsonb_build_object(
  'image', '/assets/questions/july-26-wish.png',
  'imageAlt', 'A person in a rainy room imagines being in sunny Malaysia.'
)
where stable_key = 'july-26-draft-choice-2';

update public.review_questions
set payload = payload || jsonb_build_object(
  'image', '/assets/questions/july-27-spill.png',
  'imageAlt', 'A person accidentally spills coffee on a shirt and table.'
)
where stable_key = 'july-27-draft-choice-1';

commit;
