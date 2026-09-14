-- Extend existing notebooks: reversible controls, protected practice and recipient-scoped updates.
-- Existing content and response histories remain intact.
alter table public.review_lesson_notes add column deleted_at timestamptz;
alter table public.review_lesson_note_annotations add column body_format jsonb not null default '{"version":1,"spans":[]}';
alter table public.review_lesson_note_notifications add column recipient_id uuid references auth.users(id);
update public.review_lesson_note_notifications set recipient_id=teacher_id;
alter table public.review_lesson_note_notifications alter column recipient_id set not null;
create index review_note_notices_recipient on public.review_lesson_note_notifications(recipient_id,unread,updated_at desc);
create or replace function public.review_note_student(n public.review_lesson_notes) returns boolean
 language sql stable security definer set search_path='' as $$
 select coalesce(auth.uid()=n.student_id and n.status='published' and n.deleted_at is null and not public.is_review_teacher()
   and public.review_student_hub_feature_enabled('homework'),false);
$$;
create or replace function public.review_note_validate_content(content jsonb) returns void
 language plpgsql immutable set search_path='' as $$
declare b jsonb; ids text[]='{}'; k text;
begin
 if content is null or jsonb_typeof(content)<>'object' or content->>'schemaVersion' is distinct from '1'
   or jsonb_typeof(content->'blocks') is distinct from 'array' or octet_length(content::text)>220000
   or jsonb_array_length(content->'blocks')>150 then raise exception 'Invalid lesson structure (maximum 150 blocks / 220KB)'; end if;
 for b in select value from jsonb_array_elements(content->'blocks') loop
  if jsonb_typeof(b)<>'object' or coalesce(b->>'id','') !~ '^[a-zA-Z0-9_-]{1,80}$'
    or b->>'id'=any(ids) or coalesce(b->>'type','') not in
    ('heading','paragraph','bullet_list','japanese_to_english','natural_english_upgrade','common_mistake','grammar_point','nuance','pronunciation','useful_phrase','vocabulary','teacher_tip','example','comparison','quick_practice','callout','collapsible_section','image','divider','quick_practice_group','multiple_choice','fill_in_blank','error_correction','sentence_reorder','japanese_to_english_practice','short_answer','self_check','remember_review')
    then raise exception 'Invalid or duplicate lesson block'; end if;
  ids=array_append(ids,b->>'id');
  if coalesce(b->>'japaneseSupportMode','none') not in ('none','short','explanation') or (b ? 'japaneseSupportMode' and jsonb_typeof(b->'japaneseSupportMode')<>'string') then raise exception 'Invalid Japanese support mode'; end if;
  foreach k in array array['englishText','japaneseSupport','explanation','originalText','title','answer','ipa','comparisonText','comparisonJapanese','questionId','hint','answerKey','difficulty'] loop
   if b ? k and (jsonb_typeof(b->k)<>'string' or length(b->>k)>6000) then raise exception 'Invalid block text'; end if;
  end loop;
  foreach k in array array['examples','items','correctOptions','tags','choices','acceptedAnswers'] loop
   if b ? k and (jsonb_typeof(b->k)<>'array' or jsonb_array_length(b->k)>30) then raise exception 'Invalid block list'; end if;
   if exists(select 1 from jsonb_array_elements(coalesce(b->k,'[]')) x where jsonb_typeof(x)<>'string' or length(x#>>'{}')>2000) then raise exception 'Invalid list text'; end if;
  end loop;
  if b ? 'displayOptions' and jsonb_typeof(b->'displayOptions')<>'object' then raise exception 'Invalid display options'; end if;
  if b->>'type' in ('multiple_choice','fill_in_blank','error_correction','sentence_reorder','japanese_to_english_practice','short_answer','self_check','remember_review') then
   if coalesce(b->>'questionId','') !~ '^[a-zA-Z0-9_-]{1,80}$' then raise exception 'Practice question ID required'; end if;
   if (select count(*) from jsonb_array_elements(content->'blocks') q where q->>'questionId'=b->>'questionId')<>1 then raise exception 'Duplicate question ID'; end if;
   if coalesce(b->>'difficulty','') not in ('','easy','medium','challenging') then raise exception 'Invalid difficulty';end if;
  end if;
 end loop;
end;
$$;

-- Reuse the existing inbox for both recipients. Notifications contain event labels, not responses.
drop policy review_note_notifications_read on public.review_lesson_note_notifications;
create policy review_note_notifications_read on public.review_lesson_note_notifications for select to authenticated
 using(recipient_id=auth.uid() and public.review_note_access(note_id));
create or replace function public.review_note_event(n public.review_lesson_notes, action text, entity text default '') returns void
 language plpgsql security definer set search_path='' as $$
declare fresh uuid; student_actor boolean=n.student_id=auth.uid(); recipient uuid;
begin
 insert into public.review_lesson_note_activity(note_id,actor_id,actor_role,action_type,entity_key)
 values(n.id,auth.uid(),case when student_actor then 'student' else 'teacher' end,action,entity)
 on conflict do nothing returning id into fresh;
 if fresh is null then
  update public.review_lesson_note_activity set updated_at=now() where note_id=n.id and actor_id=auth.uid() and action_type=action and entity_key=entity and batch_at=date_bin('30 minutes',now(),'2026-01-01'::timestamptz);
 end if;
 if student_actor and n.notify_teacher_on_change and action in ('annotation','suggestion','student_image','comment','direct_edit','reviewed','review_undone','practice') then recipient=n.teacher_id;
 elsif not student_actor and n.status='published' and n.deleted_at is null and action in ('note_created','note_published_or_updated','comment','asset_added','asset_replaced','suggestion_accepted','suggestion_rejected','suggestion_resolved') then recipient=n.student_id;
 end if;
 if recipient is not null then
  insert into public.review_lesson_note_notifications(note_id,teacher_id,actor_id,recipient_id,counts)
  values(n.id,n.teacher_id,auth.uid(),recipient,jsonb_build_object(action,1))
  on conflict(note_id,actor_id) do update set unread=true,updated_at=now(),counts=
   case when not review_lesson_note_notifications.unread then jsonb_build_object(action,1)
   when fresh is null then review_lesson_note_notifications.counts
   else jsonb_set(review_lesson_note_notifications.counts,array[action],to_jsonb(coalesce((review_lesson_note_notifications.counts->>action)::integer,0)+1)) end;
 end if;
end;
$$;
create function public.review_note_set_read(target_note uuid, make_unread boolean) returns void
 language plpgsql security definer set search_path='' as $$
begin
 if not public.review_note_access(target_note) then raise exception 'Note unavailable';end if;
 update public.review_lesson_note_notifications set unread=make_unread where note_id=target_note and recipient_id=auth.uid();
end;$$;
create or replace function public.review_note_acknowledge(target_note uuid) returns void
 language sql security definer set search_path='' as $$select public.review_note_set_read(target_note,false);$$;
create function public.review_note_set_reviewed(target_note uuid,reviewed boolean,expected_version integer) returns void
 language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; was integer;
begin
 select * into n from public.review_lesson_notes where id=target_note for update;
 if n.id is null or not public.review_note_student(n) then raise exception 'Note unavailable'; end if;
 if n.version is distinct from expected_version then raise exception 'NOTE_CONFLICT: refresh this lesson';end if;
 select reviewed_version into was from public.review_lesson_note_review_status where note_id=n.id and student_id=auth.uid();
 perform public.review_note_mark(target_note,false,expected_version);
 update public.review_lesson_note_review_status set reviewed_version=case when reviewed then n.version else 0 end,
 reviewed_at=case when reviewed then now() end where note_id=n.id and student_id=auth.uid();
 if (coalesce(was,0)>=n.version) is distinct from reviewed then
  perform public.review_note_event(n,case when reviewed then 'reviewed' else 'review_undone' end,n.version::text);
 end if;
end;$$;
create function public.review_note_trash(target_note uuid,restore_note boolean,expected_version integer) returns void
 language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes;
begin
 select * into n from public.review_lesson_notes where id=target_note for update;
 if n.id is null or not public.review_note_teacher(n) then raise exception 'Teacher authorisation required';end if;
 if n.version is distinct from expected_version then raise exception 'NOTE_CONFLICT';end if;
 if not restore_note and n.status<>'archived' then raise exception 'Archive the note before moving it to Trash';end if;
 perform public.review_note_snapshot(n,case when restore_note then 'trash_restored' else 'moved_to_trash' end);
 update public.review_lesson_notes set deleted_at=case when restore_note then null else now() end,
 status=case when restore_note then 'draft' else 'archived' end,version=version+1,updated_at=now(),updated_by=auth.uid()
 where id=n.id returning * into n;
 perform public.review_note_event(n,case when restore_note then 'trash_restored' else 'moved_to_trash' end,n.version::text);
end;$$;

-- Formatting is a bounded list of plain-text ranges; arbitrary HTML/styles are never accepted.
create function public.review_note_annotate_rich(target_note uuid,target_block text,body_text text,format_json jsonb,expected_version integer)
 returns public.review_lesson_note_annotations language plpgsql security definer set search_path='' as $$
declare s jsonb; a public.review_lesson_note_annotations;
begin
 if format_json is null or jsonb_typeof(format_json)<>'object' or format_json->>'version' is distinct from '1'
 or jsonb_typeof(format_json->'spans') is distinct from 'array' or jsonb_array_length(format_json->'spans')>100
 or octet_length(format_json::text)>20000 then raise exception 'Invalid note formatting';end if;
 for s in select value from jsonb_array_elements(format_json->'spans') loop
  if jsonb_typeof(s)<>'object' or exists(select 1 from jsonb_object_keys(s) k where k not in ('start','end','bold','color'))
  or coalesce(s->>'start','') !~ '^\d{1,5}$' or coalesce(s->>'end','') !~ '^\d{1,5}$'
  or (s->>'start')::integer>=(s->>'end')::integer or (s->>'end')::integer>12000
  or (s ? 'bold' and jsonb_typeof(s->'bold')<>'boolean')
  or (s ? 'color' and coalesce(s->>'color','') not in ('yellow','green','blue','pink')) then raise exception 'Invalid note mark';end if;
 end loop;
 a=public.review_note_annotate(target_note,target_block,body_text,expected_version);
 update public.review_lesson_note_annotations set body_format=format_json where id=a.id returning * into a;
 return a;
end;$$;
-- A legacy client that changes plain text must not retain stale ranges.
create function public.review_note_reset_format() returns trigger language plpgsql set search_path='' as $$
begin if new.body is distinct from old.body then new.body_format='{"version":1,"spans":[]}';end if;return new;end;$$;
create trigger review_note_plain_format before update of body on public.review_lesson_note_annotations for each row execute function public.review_note_reset_format();

create table public.review_lesson_note_practice_attempts (
 id uuid primary key default gen_random_uuid(),note_id uuid not null references public.review_lesson_notes(id),
 student_id uuid not null references auth.users(id),block_id text not null,question_id text not null,
 question_snapshot jsonb not null,response_json jsonb not null default '{}',is_correct boolean,
 completed boolean not null default false,self_check_status text check(self_check_status in ('understood','review')),
 opened_at timestamptz not null default now(),answered_at timestamptz,updated_at timestamptz not null default now(),
 answer_revealed boolean not null default false,version integer not null default 1,
 previous_answers jsonb not null default '[]',unique(note_id,student_id,question_id)
);
create index review_note_practice_note on public.review_lesson_note_practice_attempts(note_id,student_id,updated_at desc);
alter table public.review_lesson_note_practice_attempts enable row level security;
revoke all on public.review_lesson_note_practice_attempts from anon,authenticated;
grant select on public.review_lesson_note_practice_attempts to authenticated;
create policy review_note_practice_read on public.review_lesson_note_practice_attempts for select to authenticated
 using(public.review_note_access(note_id,true) or (student_id=auth.uid() and public.review_note_access(note_id)));
create function public.review_note_normal_answer(value text) returns text language sql immutable set search_path='' as $$
 select lower(regexp_replace(regexp_replace(btrim(translate(coalesce(value,''),'’‘“”','''''""')),'[[:space:]]+',' ','g'),'[.!?。]+$','','g'));
$$;
create function public.review_note_practice(target_note uuid,target_block text,expected_question jsonb,action text,response jsonb,expected_version integer default 0)
 returns public.review_lesson_note_practice_attempts language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes;b jsonb;a public.review_lesson_note_practice_attempts; qid text;kind text;correct boolean;answer text;keys jsonb;history jsonb;idx integer;known boolean;
begin
 select * into n from public.review_lesson_notes where id=target_note for update;
 if n.id is null or not public.review_note_student(n) then raise exception 'Practice unavailable';end if;
 b=public.review_note_block(n,target_block);kind=b->>'type';qid=coalesce(b->>'questionId',b->>'id');
 if b is null or kind not in ('quick_practice','multiple_choice','fill_in_blank','error_correction','sentence_reorder','japanese_to_english_practice','short_answer','self_check','remember_review') then raise exception 'Practice question unavailable';end if;
 if b is distinct from expected_question then raise exception 'NOTE_CONFLICT: this question has changed';end if;
 if action not in ('open','answer','reveal','complete','retry','self_check') or response is null or jsonb_typeof(response)<>'object' or octet_length(response::text)>12000 then raise exception 'Invalid practice response';end if;
 select * into a from public.review_lesson_note_practice_attempts where note_id=n.id and student_id=auth.uid() and question_id=qid;
 if coalesce(a.version,0) is distinct from expected_version then raise exception 'NOTE_CONFLICT: this practice changed in another tab';end if;
 if a.id is null then
  insert into public.review_lesson_note_practice_attempts(note_id,student_id,block_id,question_id,question_snapshot)
  values(n.id,auth.uid(),target_block,qid,b) returning * into a;
 elsif a.question_snapshot is distinct from b or action='retry' then
  history=jsonb_build_array(jsonb_build_object('question',a.question_snapshot,'response',a.response_json,'correct',a.is_correct,'answered_at',a.answered_at))||a.previous_answers;
  select coalesce(jsonb_agg(x.value),'[]') into history from (select value from jsonb_array_elements(history) with ordinality where ordinality<=5) x;
  update public.review_lesson_note_practice_attempts set question_snapshot=b,block_id=target_block,response_json='{}',is_correct=null,completed=false,self_check_status=null,answered_at=null,answer_revealed=false,previous_answers=history where id=a.id returning * into a;
 end if;
 if action='answer' then
  if kind='multiple_choice' then
   if coalesce(response->>'choice','') !~ '^\d{1,2}$' then raise exception 'Choose an answer';end if;
   idx=(response->>'choice')::integer;
   if idx<0 or idx>=jsonb_array_length(coalesce(b->'choices','[]')) then raise exception 'Invalid choice';end if;
   answer=b->'choices'->>idx;
   if coalesce(b->>'answerKey','')<>'' then correct=upper(btrim(b->>'answerKey'))=chr(65+idx) or public.review_note_normal_answer(b->>'answerKey')=public.review_note_normal_answer(answer);end if;
   response=jsonb_build_object('choice',idx,'text',answer);
  elsif kind='sentence_reorder' then
   if jsonb_typeof(response->'order') is distinct from 'array' or jsonb_array_length(response->'order')<>jsonb_array_length(coalesce(b->'items','[]')) or jsonb_array_length(response->'order')=0 then raise exception 'Arrange every word';end if;
   if exists(select 1 from jsonb_array_elements_text(response->'order') v where v !~ '^\d{1,2}$') then raise exception 'Invalid word order';end if;
   if (select count(distinct v::integer) from jsonb_array_elements_text(response->'order') v)<>jsonb_array_length(b->'items')
    or exists(select 1 from jsonb_array_elements_text(response->'order') v where v::integer>=jsonb_array_length(b->'items')) then raise exception 'Invalid word order';end if;
   select string_agg(b->'items'->>(v.value::integer),' ' order by v.ordinality) into answer from jsonb_array_elements_text(response->'order') with ordinality v;
   response=jsonb_build_object('order',response->'order','text',answer);
  else
   if jsonb_typeof(response->'text') is distinct from 'string' or length(btrim(response->>'text')) not between 1 and 6000 then raise exception 'Write your answer first';end if;
   answer=btrim(response->>'text');response=jsonb_build_object('text',answer);
  end if;
  if kind in ('fill_in_blank','error_correction','sentence_reorder','japanese_to_english_practice') then
   keys=coalesce(b->'acceptedAnswers','[]');
   if coalesce(b->>'answerKey','')<>'' then keys=keys||to_jsonb(regexp_split_to_array(b->>'answerKey',E'\n'));end if;
   if jsonb_array_length(keys)>0 then select exists(select 1 from jsonb_array_elements_text(keys) k where public.review_note_normal_answer(k)=public.review_note_normal_answer(answer)) into correct;end if;
  end if;
  update public.review_lesson_note_practice_attempts set response_json=response,is_correct=correct,answered_at=now(),completed=coalesce(correct,true),self_check_status=null where id=a.id;
 elsif action='self_check' then
  if coalesce(response->>'state','') not in ('understood','review') then raise exception 'Choose a self-check state';end if;
  update public.review_lesson_note_practice_attempts set self_check_status=response->>'state',completed=response->>'state'='understood',answered_at=coalesce(answered_at,now()) where id=a.id;
 elsif action='complete' then
  if a.answered_at is null and not a.answer_revealed then raise exception 'Answer or reveal the model first';end if;
  update public.review_lesson_note_practice_attempts set completed=true where id=a.id;
 elsif action='reveal' then update public.review_lesson_note_practice_attempts set answer_revealed=true where id=a.id;
 end if;
 update public.review_lesson_note_practice_attempts set version=version+1,updated_at=now() where id=a.id returning * into a;
 if action in ('answer','self_check','complete','retry') then perform public.review_note_event(n,'practice',qid);end if;
 return a;
end;$$;

-- No new public access: realtime filters are still subject to recipient RLS.
do $$ begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') and not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='review_lesson_note_notifications') then
  alter publication supabase_realtime add table public.review_lesson_note_notifications;
 end if;
end;$$;
do $$ declare f record;begin
 for f in select oid::regprocedure as signature,proname from pg_proc where pronamespace='public'::regnamespace and proname in
 ('review_note_set_read','review_note_set_reviewed','review_note_trash','review_note_annotate_rich','review_note_reset_format','review_note_normal_answer','review_note_practice') loop
  execute format('revoke all on function %s from public,anon,authenticated',f.signature);
  if f.proname not in ('review_note_reset_format','review_note_normal_answer') then execute format('grant execute on function %s to authenticated',f.signature);end if;
 end loop;
end;$$;

create function public.review_note_publish_practice_guard() returns trigger language plpgsql set search_path='' as $$
declare b jsonb;begin
 if new.deleted_at is not null and new.status<>'archived' then raise exception 'Restore this note from Trash before editing';end if;
 if new.status='published' then
  for b in select value from jsonb_array_elements(new.content_json->'blocks') loop
   if b->>'type' in ('multiple_choice','fill_in_blank','error_correction','sentence_reorder','japanese_to_english_practice','short_answer','self_check','remember_review') then
    if length(btrim(coalesce(b->>'englishText','')))=0 then raise exception 'Add a practice prompt before publishing';end if;
    if b->>'type'='multiple_choice' and jsonb_array_length(coalesce(b->'choices','[]'))<2 then raise exception 'Add at least two answer choices';end if;
    if b->>'type'='sentence_reorder' and jsonb_array_length(coalesce(b->'items','[]'))<2 then raise exception 'Add at least two reorder items';end if;
   end if;
  end loop;
 end if;return new;
end;$$;
revoke all on function public.review_note_publish_practice_guard() from public,anon,authenticated;
create trigger review_note_publish_practice_guard before insert or update on public.review_lesson_notes for each row execute function public.review_note_publish_practice_guard();
